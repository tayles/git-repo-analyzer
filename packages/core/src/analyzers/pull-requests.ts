import type { GitHubPullRequest } from '../client/github-types';
import type { DecoratedPullRequest, PullAnalysis, PullsPerWeek, UserProfile } from '../types';
import { parseDate } from '../utils/date-utils';
import { detectConventions, parseMessage } from './commits';

export function processPullRequests(
  pullRequests: GitHubPullRequest[],
  userProfiles: UserProfile[],
): PullAnalysis {
  const pulls = decoratePulls(pullRequests, userProfiles);

  const counts = calculateCounts(pullRequests);

  const conventions = detectConventions(pulls.map(c => c.title));

  return {
    counts,
    conventions,
    pulls,
  };
}

export function calculateCounts(pullRequests: GitHubPullRequest[]) {
  return pullRequests.reduce(
    (acc, pr) => {
      acc.total += 1;
      if (pr.state === 'open') {
        acc.open += 1;
      } else if (pr.merged_at) {
        acc.merged += 1;
      } else {
        acc.closed += 1;
      }
      return acc;
    },
    { total: 0, open: 0, closed: 0, merged: 0 },
  );
}

export function decoratePulls(
  pullRequests: GitHubPullRequest[],
  userProfiles: UserProfile[],
): DecoratedPullRequest[] {
  return pullRequests.map(pull => parsePullRequest(pull, userProfiles));
}

export function parsePullRequest(
  pull: GitHubPullRequest,
  userProfiles: UserProfile[],
): DecoratedPullRequest {
  const number = pull.number;
  const author = pull.user.login;

  const u = author ? userProfiles.find(u => u.login === author) : null;

  const date = parseDate(pull.created_at, u?.timezone);

  const title = parseMessage(pull.title);

  return {
    number,
    author,
    title,
    date,
  };
}

export function computePullsPerWeek(
  pulls: DecoratedPullRequest[],
  filterByLogin?: string,
): PullsPerWeek {
  return pulls.reduce((acc, pull) => {
    if (filterByLogin && pull.author?.toLowerCase() !== filterByLogin.toLowerCase()) {
      return acc; // Skip if filtering by login and this pull doesn't match
    }
    const bucket = pull.date.weekStart;
    if (!acc[bucket]) {
      acc[bucket] = { total: 0, byType: {}, byAuthor: {} };
    }
    acc[bucket].total++;
    const type = pull.title.type ?? 'other';
    acc[bucket].byType[type] = (acc[bucket].byType[type] ?? 0) + 1;
    const author = pull.author ?? 'unknown';
    acc[bucket].byAuthor[author] = (acc[bucket].byAuthor[author] ?? 0) + 1;

    return acc;
  }, {} as PullsPerWeek);
}
