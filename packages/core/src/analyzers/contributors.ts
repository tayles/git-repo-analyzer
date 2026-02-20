import type { GitHubContributor, GitHubUserProfile } from '../client/github-types';
import type { ContributorAnalysis, TeamSize } from '../types';
import { countryCodeToEmojiFlag, parseLocation } from '../utils/location-utils';

export function processContributors(
  contributors: GitHubContributor[],
  userProfiles: GitHubUserProfile[],
): ContributorAnalysis {
  const processedContributors = userProfiles.map((u, idx) => {
    const contributions = contributors[idx]?.contributions ?? 0;
    const location = parseLocation(u.location);
    const country = location?.country ?? null;
    const countryCode = location?.iso2 ?? null;
    const flag = countryCode ? countryCodeToEmojiFlag(countryCode) : null;
    const timezone = location?.timezone ?? null;

    return {
      id: u.id,
      name: u.name ?? null,
      login: u.login,
      avatarUrl: u.avatar_url,
      contributions,
      htmlUrl: u.html_url,
      location: u.location ?? null,
      country,
      countryCode,
      flag,
      timezone,
    };
  });

  const contribsPerCountry = processedContributors.reduce(
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
    processedContributors.find(c => c.country === primaryCountry)?.countryCode ?? null;
  const primaryTimezone =
    processedContributors.find(c => c.country === primaryCountry)?.timezone ?? null;

  return {
    totalContributors: contributors.length,
    teamSize: classifyTeamSize(contributors.length),
    busFactor: 1,
    primaryCountry,
    primaryCountryCode,
    primaryTimezone,
    topContributors: processedContributors,
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
