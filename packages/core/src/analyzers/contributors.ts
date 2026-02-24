import type { GitHubCommit, GitHubContributor } from '../client/github-types';
import type { Contributor, ContributorAnalysis, TeamSize, UserProfile } from '../types';
import { calculateBusFactor } from '../utils/bus-factor';

export function processContributors(
  contributors: GitHubContributor[],
  userProfiles: UserProfile[],
  commits: GitHubCommit[],
): ContributorAnalysis {
  const topContributors: Contributor[] = contributors.map(c => ({
    login: c.login,
    contributions: c.contributions,
  }));

  const recentContributors: Contributor[] = Object.entries(
    commits.reduce(
      (acc, commit) => {
        const login = commit.author?.login;
        if (login) {
          acc[login] = (acc[login] ?? 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    ),
  )
    .sort((a, b) => b[1] - a[1])
    .map(([login, contributions]) => ({ login, contributions }));

  const timezoneMap = new Map<string, number>();
  const countryMap = new Map<string, number>();
  const countryCodeMap = new Map<string, number>();

  for (const commit of commits) {
    const login = commit.author?.login;
    const profile = login ? userProfiles.find(u => u.login === login) : null;
    if (profile) {
      if (profile.timezone) {
        timezoneMap.set(profile.timezone, (timezoneMap.get(profile.timezone) ?? 0) + 1);
      }
      if (profile.country) {
        countryMap.set(profile.country, (countryMap.get(profile.country) ?? 0) + 1);
      }
      if (profile.countryCode) {
        countryCodeMap.set(profile.countryCode, (countryCodeMap.get(profile.countryCode) ?? 0) + 1);
      }
    }
  }

  const primaryTimezone =
    Array.from(timezoneMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const primaryCountry =
    Array.from(countryMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const primaryCountryCode =
    Array.from(countryCodeMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    totalContributors: contributors.length,
    teamSize: classifyTeamSize(contributors.length),
    busFactor: calculateBusFactor(topContributors),
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
