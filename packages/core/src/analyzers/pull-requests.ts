import type { GitHubPullRequest } from '../client/github-types';
import type { BucketByWeek, PullAnalysis } from '../types';
import { weekStart } from '../utils/date-utils';

export function processPullRequests(pullRequests: GitHubPullRequest[]): PullAnalysis {
  const byWeek = pullRequests.reduce((acc, pull) => {
    const weekStartDate = weekStart(pull.created_at);
    acc[weekStartDate] = (acc[weekStartDate] || 0) + 1;
    return acc;
  }, {} as BucketByWeek);

  return {
    totalOpen: pullRequests.filter(pr => pr.state === 'open').length,
    totalClosed: pullRequests.filter(pr => pr.state === 'closed' && !pr.merged_at).length,
    totalMerged: pullRequests.filter(pr => pr.merged_at).length,
    avgMergeTimeHours: null,
    byWeek,
  };
}
