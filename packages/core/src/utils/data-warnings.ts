import type { AnalysisResult } from '../types';

/** API pagination limits */
export const COMMIT_FETCH_LIMIT = 300;
export const PR_FETCH_LIMIT = 100;
export const CONTRIBUTORS_FETCH_LIMIT = 100;
export const USER_PROFILES_FETCH_LIMIT = 10;

export interface DataWarnings {
  /** True when the commit dataset appears to be capped at the pagination limit */
  commitsCapped: boolean;
  /** True when the pull-request dataset appears to be capped at the pagination limit */
  pullRequestsCapped: boolean;
  /** Number of recent contributors whose timezone could not be determined */
  contributorsMissingTimezone: number;
  /** Total number of recent contributors */
  totalRecentContributors: number;
}

/**
 * Derive data-limitation warnings from an analysis result.
 *
 * These are intended for display as subtle informational notices so the
 * user understands that the charts/metrics may not represent the full
 * history of the repository.
 */
export function computeDataWarnings(result: AnalysisResult): DataWarnings {
  const commitsCapped = result.commits.commits.length >= COMMIT_FETCH_LIMIT;
  const pullRequestsCapped = result.pullRequests.pulls.length >= PR_FETCH_LIMIT;

  const recentLogins = new Set(result.contributors.recentContributors.map(c => c.login));
  const profilesForRecent = result.userProfiles.filter(p => recentLogins.has(p.login));
  const contributorsMissingTimezone = profilesForRecent.filter(p => !p.timezone).length;

  return {
    commitsCapped,
    pullRequestsCapped,
    contributorsMissingTimezone,
    totalRecentContributors: result.contributors.recentContributors.length,
  };
}
