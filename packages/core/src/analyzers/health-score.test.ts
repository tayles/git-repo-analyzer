import { describe, expect, it } from 'bun:test';

import type { AnalysisResult } from '../types';
import { processHealthScore } from './health-score';

type PartialAnalysis = Omit<AnalysisResult, 'healthScore' | 'generator'>;

function createInput(overrides: Partial<PartialAnalysis> = {}): PartialAnalysis {
  return {
    basicStats: {
      name: 'repo',
      fullName: 'owner/repo',
      htmlUrl: '',
      description: 'Repo',
      stars: 1200,
      forks: 120,
      openIssues: 1,
      watchers: 1,
      language: 'TypeScript',
      license: 'MIT',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      pushedAt: new Date().toISOString(),
      defaultBranch: 'main',
      size: 1,
      hasWiki: true,
      hasPages: false,
      archived: false,
      topics: ['one', 'two'],
      homepage: 'https://example.com',
      owner: { login: 'owner', id: 1, avatarUrl: '' },
    },
    contributors: {
      totalContributors: 12,
      teamSize: 'medium',
      busFactor: 3,
      primaryCountry: 'United States',
      primaryCountryCode: 'US',
      primaryTimezone: 'America/New_York',
      topContributors: [{ login: 'alice', contributions: 100 }],
      recentContributors: [{ login: 'alice', contributions: 50 }],
    },
    commits: {
      totalCommits: 250,
      firstCommitDate: null,
      lastCommitDate: null,
      commits: [],
      conventions: { conventionalCommits: true, gitmoji: false, prefixes: { feat: 10 } },
      workPatterns: {
        classification: 'professional',
        workHoursPercent: 70,
        eveningsPercent: 20,
        weekendsPercent: 10,
      },
    },
    pullRequests: {
      counts: { total: 20, open: 2, merged: 18, closed: 0 },
      conventions: { conventionalCommits: true, gitmoji: false, prefixes: { feat: 5 } },
      pulls: [],
    },
    languages: { primaryLanguage: 'TypeScript', langs: [] },
    tooling: {
      tools: [
        { name: 'Jest', category: 'Testing', logo: null, url: 'https://jestjs.io', paths: [] },
        {
          name: 'ESLint',
          category: 'Linting & Formatting',
          logo: null,
          url: 'https://eslint.org',
          paths: [],
        },
        {
          name: 'GitHub Actions',
          category: 'CI/CD & Deployment',
          logo: null,
          url: 'https://github.com/features/actions',
          paths: [],
        },
        {
          name: 'Docker',
          category: 'Frameworks',
          logo: null,
          url: 'https://docker.com',
          paths: [],
        },
      ],
      categories: ['Testing', 'Linting & Formatting', 'CI/CD & Deployment', 'Frameworks'],
    },
    userProfiles: [],
    ...overrides,
  };
}

describe('processHealthScore', () => {
  it('returns category scores and overall total', () => {
    const result = processHealthScore(createInput());

    expect(result.overall).toBeGreaterThan(0);
    expect(result.categories.Maintenance.maxScore).toBe(25);
    expect(result.categories.Documentation.maxScore).toBe(20);
    expect(result.categories.Community.maxScore).toBe(25);
    expect(result.categories['Code Quality'].maxScore).toBe(15);
    expect(result.categories.Security.maxScore).toBe(15);
  });

  it('reduces score for weak signals', () => {
    const weak = processHealthScore(
      createInput({
        basicStats: {
          ...createInput().basicStats,
          description: null,
          license: null,
          homepage: null,
          topics: [],
          archived: true,
          stars: 2,
          forks: 0,
          pushedAt: '2020-01-01T00:00:00.000Z',
        },
        contributors: {
          ...createInput().contributors,
          totalContributors: 1,
          busFactor: 1,
        },
        commits: {
          ...createInput().commits,
          totalCommits: 1,
        },
        pullRequests: {
          ...createInput().pullRequests,
          counts: { total: 0, open: 0, merged: 0, closed: 0 },
        },
        tooling: { tools: [], categories: [] },
      }),
    );

    expect(weak.overall).toBeLessThan(processHealthScore(createInput()).overall);
  });
});
