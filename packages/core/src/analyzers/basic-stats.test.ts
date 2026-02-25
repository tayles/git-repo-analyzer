import { describe, expect, it } from 'bun:test';

import type { GitHubRepoDetails } from '../client/github-types';
import { processBasicStats } from './basic-stats';

const repo: GitHubRepoDetails = {
  name: 'repo',
  full_name: 'owner/repo',
  html_url: 'https://github.com/owner/repo',
  description: 'A test repo',
  owner: {
    login: 'owner',
    id: 1,
    node_id: 'node',
    avatar_url: 'https://example.com/avatar.png',
  },
  stargazers_count: 100,
  forks_count: 25,
  open_issues_count: 3,
  subscribers_count: 8,
  language: 'TypeScript',
  license: { spdx_id: 'MIT', name: 'MIT License' },
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-02T00:00:00.000Z',
  pushed_at: '2024-01-03T00:00:00.000Z',
  default_branch: 'main',
  size: 10,
  has_wiki: true,
  has_pages: false,
  archived: false,
  topics: ['tooling'],
  homepage: 'https://example.com',
};

describe('processBasicStats', () => {
  it('maps GitHub repo details to basic stats shape', () => {
    const result = processBasicStats(repo);

    expect(result.fullName).toBe('owner/repo');
    expect(result.stars).toBe(100);
    expect(result.license).toBe('MIT');
    expect(result.owner.login).toBe('owner');
    expect(result.topics).toEqual(['tooling']);
  });

  it('returns null license when missing', () => {
    const result = processBasicStats({ ...repo, license: null });
    expect(result.license).toBeNull();
  });
});
