import { describe, expect, it } from 'bun:test';

import type { GitHubPullRequest } from '../client/github-types';
import type { UserProfile } from '../types';
import { calculateCounts, computePullsPerWeek, processPullRequests } from './pull-requests';

const users: UserProfile[] = [
  {
    id: 1,
    name: 'Alice',
    login: 'alice',
    avatarUrl: '',
    htmlUrl: '',
    location: 'New York',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    timezone: 'America/New_York',
  },
];

const pulls: GitHubPullRequest[] = [
  {
    number: 1,
    state: 'open',
    merged_at: null,
    created_at: '2025-01-01T00:00:00.000Z',
    closed_at: null,
    user: { login: 'alice', type: 'User' },
    title: 'feat: open pull',
    html_url: '',
  },
  {
    number: 2,
    state: 'closed',
    merged_at: '2025-01-03T00:00:00.000Z',
    created_at: '2025-01-02T00:00:00.000Z',
    closed_at: '2025-01-03T00:00:00.000Z',
    user: { login: 'alice', type: 'User' },
    title: 'fix: merged pull',
    html_url: '',
  },
  {
    number: 3,
    state: 'closed',
    merged_at: null,
    created_at: '2025-01-04T00:00:00.000Z',
    closed_at: '2025-01-05T00:00:00.000Z',
    user: { login: 'alice', type: 'User' },
    title: 'chore: closed pull',
    html_url: '',
  },
];

describe('pull-requests analyzer', () => {
  it('calculates open/merged/closed counts', () => {
    const counts = calculateCounts(pulls);
    expect(counts).toEqual({ total: 3, open: 1, merged: 1, closed: 1 });
  });

  it('decorates pull requests and computes convention summary', () => {
    const result = processPullRequests(pulls, users);

    expect(result.pulls.length).toBe(3);
    expect(result.conventions.conventionalCommits).toBe(true);
    expect(result.counts.total).toBe(3);
  });

  it('computes week buckets including merged/closed events', () => {
    const decorated = processPullRequests(pulls, users).pulls;
    const buckets = computePullsPerWeek(decorated);
    const totals = Object.values(buckets).reduce((sum, bucket) => sum + bucket.total, 0);

    expect(totals).toBe(3);

    const mergedCount = Object.values(buckets).reduce(
      (sum, bucket) => sum + bucket.byStatus.merged,
      0,
    );
    const closedCount = Object.values(buckets).reduce(
      (sum, bucket) => sum + bucket.byStatus.closed,
      0,
    );
    expect(mergedCount).toBe(1);
    expect(closedCount).toBe(1);
  });

  it('filters pull buckets by author login case-insensitively', () => {
    const decorated = processPullRequests(pulls, users).pulls;

    expect(Object.keys(computePullsPerWeek(decorated, 'ALICE')).length).toBeGreaterThan(0);
    expect(Object.keys(computePullsPerWeek(decorated, 'someone-else')).length).toBe(0);
  });
});
