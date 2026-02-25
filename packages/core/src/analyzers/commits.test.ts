import { describe, expect, it } from 'bun:test';

import type { GitHubCommit } from '../client/github-types';
import type { UserProfile } from '../types';
import {
  analyzeWorkPatterns,
  computeActivityHeatmap,
  computeCommitsPerWeek,
  detectConventions,
  parseMessage,
  processCommits,
} from './commits';

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

const commits: GitHubCommit[] = [
  {
    sha: 'sha-1',
    commit: {
      author: { name: 'Alice', email: 'a@example.com', date: '2025-01-06T15:00:00.000Z' },
      committer: { name: 'Alice', email: 'a@example.com', date: '2025-01-06T15:00:00.000Z' },
      message: 'feat(core): add parser',
    },
    author: {
      login: 'alice',
      id: 1,
      avatar_url: '',
      html_url: '',
      type: 'User',
      site_admin: false,
    },
    parents: [],
  },
  {
    sha: 'sha-2',
    commit: {
      author: { name: 'Alice', email: 'a@example.com', date: '2025-01-11T02:00:00.000Z' },
      committer: { name: 'Alice', email: 'a@example.com', date: '2025-01-11T02:00:00.000Z' },
      message: '✨ improve docs',
    },
    author: {
      login: 'alice',
      id: 1,
      avatar_url: '',
      html_url: '',
      type: 'User',
      site_admin: false,
    },
    parents: [],
  },
];

describe('commits analyzer', () => {
  it('parses commit messages for conventional and gitmoji styles', () => {
    const conventional = parseMessage('feat(api): add endpoint\n\nbody');
    const gitmoji = parseMessage('✨ improve docs');

    expect(conventional.type).toBe('feat');
    expect(conventional.convention).toBe('conventional');
    expect(gitmoji.convention).toBe('gitmoji');
  });

  it('detects convention summary and sorted prefixes', () => {
    const summary = detectConventions([
      { raw: 'feat: one', type: 'feat', scope: null, convention: 'conventional' },
      { raw: 'fix: two', type: 'fix', scope: null, convention: 'conventional' },
      { raw: 'feat: three', type: 'feat', scope: null, convention: 'conventional' },
    ]);

    expect(summary.conventionalCommits).toBe(true);
    expect(summary.gitmoji).toBe(false);
    expect(Object.keys(summary.prefixes)[0]).toBe('feat');
  });

  it('processes commits and derives analysis fields', () => {
    const result = processCommits(commits, users);

    expect(result.totalCommits).toBe(2);
    expect(result.conventions.conventionalCommits).toBe(true);
    expect(result.commits.length).toBe(2);
    expect(result.workPatterns.classification).toBeTruthy();
  });

  it('computes work patterns and heatmap buckets', () => {
    const decorated = processCommits(commits, users).commits;

    const work = analyzeWorkPatterns(decorated);
    const heatmap = computeActivityHeatmap(decorated);
    const byWeek = computeCommitsPerWeek(decorated);

    expect(work.workHoursPercent + work.eveningsPercent + work.weekendsPercent).toBe(100);
    expect(heatmap.maxValue).toBeGreaterThan(0);
    expect(Object.values(byWeek).reduce((sum, w) => sum + w.total, 0)).toBe(2);
  });

  it('supports filtering by login', () => {
    const decorated = processCommits(commits, users).commits;
    const filtered = computeCommitsPerWeek(decorated, 'alice');
    const missing = computeCommitsPerWeek(decorated, 'nobody');

    expect(Object.keys(filtered).length).toBeGreaterThan(0);
    expect(Object.keys(missing).length).toBe(0);
  });
});
