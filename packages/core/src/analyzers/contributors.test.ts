import { describe, expect, it } from 'bun:test';

import type { GitHubCommit, GitHubContributor } from '../client/github-types';
import type { UserProfile } from '../types';
import { classifyTeamSize, processContributors } from './contributors';

const contributors: GitHubContributor[] = [
  { login: 'alice', avatar_url: '', contributions: 10, html_url: '' },
  { login: 'bob', avatar_url: '', contributions: 5, html_url: '' },
  { login: 'carol', avatar_url: '', contributions: 2, html_url: '' },
];

const commits: GitHubCommit[] = [
  {
    sha: '1',
    commit: {
      author: { name: 'alice', email: 'a@a.com', date: '2025-01-01T10:00:00.000Z' },
      committer: { name: 'alice', email: 'a@a.com', date: '2025-01-01T10:00:00.000Z' },
      message: 'feat: first',
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
    sha: '2',
    commit: {
      author: { name: 'bob', email: 'b@b.com', date: '2025-01-02T10:00:00.000Z' },
      committer: { name: 'bob', email: 'b@b.com', date: '2025-01-02T10:00:00.000Z' },
      message: 'fix: second',
    },
    author: { login: 'bob', id: 2, avatar_url: '', html_url: '', type: 'User', site_admin: false },
    parents: [],
  },
  {
    sha: '3',
    commit: {
      author: { name: 'alice', email: 'a@a.com', date: '2025-01-03T10:00:00.000Z' },
      committer: { name: 'alice', email: 'a@a.com', date: '2025-01-03T10:00:00.000Z' },
      message: 'chore: third',
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

const userProfiles: UserProfile[] = [
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
  {
    id: 2,
    name: 'Bob',
    login: 'bob',
    avatarUrl: '',
    htmlUrl: '',
    location: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    timezone: 'Europe/London',
  },
];

describe('contributors analyzer', () => {
  it('classifies team size buckets', () => {
    expect(classifyTeamSize(1)).toBe('solo');
    expect(classifyTeamSize(5)).toBe('small');
    expect(classifyTeamSize(20)).toBe('medium');
    expect(classifyTeamSize(21)).toBe('large');
  });

  it('builds contributor analysis including geography and recency', () => {
    const result = processContributors(contributors, userProfiles, commits);

    expect(result.totalContributors).toBe(3);
    expect(result.teamSize).toBe('small');
    expect(result.recentContributors[0]?.login).toBe('alice');
    expect(result.primaryCountry).toBeTruthy();
    expect(result.primaryCountryCode).toBeTruthy();
    expect(result.primaryTimezone).toBeTruthy();
  });
});
