import type { GitHubCommit, GitHubContributor, GitHubUserProfile } from '../client/github-types';
import type { Contributor, ContributorAnalysis, TeamSize } from '../types';
import { countryCodeToEmojiFlag, parseLocation } from '../utils/location-utils';

/**
 * Build a lookup from login → GitHubUserProfile for quick access.
 */
function buildProfileMap(userProfiles: GitHubUserProfile[]): Map<string, GitHubUserProfile> {
  return new Map(userProfiles.map(p => [p.login, p]));
}

/**
 * Convert a GitHubUserProfile into a processed Contributor.
 */
function toContributor(profile: GitHubUserProfile, contributions: number): Contributor {
  const location = parseLocation(profile.location);
  const country = location?.country ?? null;
  const countryCode = location?.iso2 ?? null;
  const flag = countryCode ? countryCodeToEmojiFlag(countryCode) : null;
  const timezone = location?.timezone ?? null;

  return {
    id: profile.id,
    name: profile.name ?? null,
    login: profile.login,
    avatarUrl: profile.avatar_url,
    contributions,
    htmlUrl: profile.html_url,
    location: profile.location ?? null,
    country,
    countryCode,
    flag,
    timezone,
  };
}

export function processContributors(
  contributors: GitHubContributor[],
  commits: GitHubCommit[],
  userProfiles: GitHubUserProfile[],
): ContributorAnalysis {
  const profileMap = buildProfileMap(userProfiles);
  const contribByLogin = new Map(contributors.map(c => [c.login, c.contributions]));

  // Top contributors: sorted by total contributions
  const topLogins = contributors
    .filter(c => !c.login.toLowerCase().includes('[bot]'))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 10)
    .map(c => c.login);

  const topContributors = topLogins
    .map(login => {
      const profile = profileMap.get(login);
      if (!profile) return null;
      return toContributor(profile, contribByLogin.get(login) ?? 0);
    })
    .filter((c): c is Contributor => c !== null);

  // Recent contributors: count recent commits per author, take top 10 by count
  const recentCommitCounts = new Map<string, { login: string; count: number }>();
  for (const commit of commits) {
    const login = commit.author?.login;
    if (!login) continue;
    if (commit.author?.type === 'Bot') continue;
    if (login.toLowerCase().includes('[bot]')) continue;

    const existing = recentCommitCounts.get(login);
    if (existing) {
      existing.count++;
    } else {
      recentCommitCounts.set(login, { login, count: 1 });
    }
  }

  const recentContributors = [...recentCommitCounts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(({ login, count }) => {
      const profile = profileMap.get(login);
      if (!profile) return null;
      return toContributor(profile, count);
    })
    .filter((c): c is Contributor => c !== null);

  // Compute stats from ALL processed contributors (use topContributors for country stats)
  const allProcessed = topContributors;

  const contribsPerCountry = allProcessed.reduce(
    (acc, c) => {
      if (c.country) {
        acc[c.country] = (acc[c.country] ?? 0) + c.contributions;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const primaryCountry =
    Object.entries(contribsPerCountry).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const primaryCountryCode =
    allProcessed.find(c => c.country === primaryCountry)?.countryCode ?? null;
  const primaryTimezone = allProcessed.find(c => c.country === primaryCountry)?.timezone ?? null;

  return {
    totalContributors: contributors.length,
    teamSize: classifyTeamSize(contributors.length),
    busFactor: 1,
    primaryCountry,
    primaryCountryCode,
    primaryTimezone,
    topContributors,
    recentContributors,
  };
}

export function classifyTeamSize(count: number): TeamSize {
  if (count <= 1) return 'solo';
  if (count <= 5) return 'small';
  if (count <= 20) return 'medium';
  return 'large';
}

// function calculateBusFactor(contributors: Contributor[]): number {
//   if (contributors.length === 0) return 0;

//   const total = contributors.reduce((sum, c) => sum + c.contributions, 0);
//   if (total === 0) return 0;

//   let accumulated = 0;
//   for (let i = 0; i < contributors.length; i++) {
//     accumulated += contributors[i]!.contributions;
//     if (accumulated / total >= 0.5) {
//       return i + 1;
//     }
//   }
//   return contributors.length;
// }
