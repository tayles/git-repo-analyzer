import type { GitHubPullRequest } from '../client/github-types';
import type {
  DecoratedPullRequest,
  PullAnalysis,
  PullAnalysisCounts,
  PullsPerWeek,
  PullStatus,
  UserProfile,
} from '../types';
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

export function calculateCounts(pullRequests: GitHubPullRequest[]): PullAnalysisCounts {
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
  return pullRequests.toReversed().map(pull => parsePullRequest(pull, userProfiles));
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

  const status: PullStatus = pull.merged_at ? 'merged' : pull.state === 'open' ? 'open' : 'closed';

  const mergedAt = pull.merged_at ? parseDate(pull.merged_at, u?.timezone).weekStart : null;
  const closedAt =
    pull.closed_at && !pull.merged_at ? parseDate(pull.closed_at, u?.timezone).weekStart : null;

  return {
    number,
    author,
    title,
    date,
    status,
    mergedAt,
    closedAt,
  };
}

function ensureBucket(acc: PullsPerWeek, weekStart: string) {
  if (!acc[weekStart]) {
    acc[weekStart] = {
      total: 0,
      byType: {},
      byStatus: { open: 0, merged: 0, closed: 0 },
      byAuthor: {},
    };
  }
}

export function computePullsPerWeek(
  pulls: DecoratedPullRequest[],
  filterByLogin?: string,
): PullsPerWeek {
  const buckets = pulls.reduce((acc, pull) => {
    if (filterByLogin && pull.author?.toLowerCase() !== filterByLogin.toLowerCase()) {
      return acc; // Skip if filtering by login and this pull doesn't match
    }

    // opened event — always bucketed by created_at
    const openedBucket = pull.date.weekStart;
    ensureBucket(acc, openedBucket);
    acc[openedBucket].total++;
    const type = pull.title.type ?? 'other';
    acc[openedBucket].byType[type] = (acc[openedBucket].byType[type] ?? 0) + 1;
    const author = pull.author ?? 'unknown';
    acc[openedBucket].byAuthor[author] = (acc[openedBucket].byAuthor[author] ?? 0) + 1;
    acc[openedBucket].byStatus.open++;

    // merged/closed event — bucketed by their own date
    if (pull.mergedAt) {
      const mergedBucket = pull.mergedAt;
      ensureBucket(acc, mergedBucket);
      acc[mergedBucket].byStatus.merged++;
    } else if (pull.closedAt) {
      const closedBucket = pull.closedAt;
      ensureBucket(acc, closedBucket);
      acc[closedBucket].byStatus.closed++;
    }

    return acc;
  }, {} as PullsPerWeek);

  return Object.fromEntries(
    Object.entries(buckets).sort(([a], [b]) => a.localeCompare(b)),
  ) as PullsPerWeek;
}
