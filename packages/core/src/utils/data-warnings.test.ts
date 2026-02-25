import { describe, expect, it } from 'bun:test';

import type { AnalysisResult } from '../types';
import {
  COMMIT_FETCH_LIMIT,
  CONTRIBUTORS_FETCH_LIMIT,
  PR_FETCH_LIMIT,
  computeDataWarnings,
} from './data-warnings';

const mockCommit = {
  sha: 'sha',
  author: 'alice',
  message: {
    raw: 'feat: test',
    type: 'feat',
    scope: null,
    convention: 'conventional' as const,
  },
  date: {
    orig: '2025-01-01T00:00:00.000Z',
    local: null,
    weekStart: '2024-12-30',
    dayOfWeek: 1,
    hourOfDay: 10,
    timeOfDay: 'workday' as const,
  },
};

const mockPull = {
  number: 1,
  author: 'alice',
  title: {
    raw: 'feat: pull',
    type: 'feat',
    scope: null,
    convention: 'conventional' as const,
  },
  date: {
    orig: '2025-01-01T00:00:00.000Z',
    local: null,
    weekStart: '2024-12-30',
    dayOfWeek: 1,
    hourOfDay: 10,
    timeOfDay: 'workday' as const,
  },
  status: 'open' as const,
  mergedAt: null,
  closedAt: null,
};

function buildResult(overrides: Partial<AnalysisResult> = {}): AnalysisResult {
  return {
    generator: {
      name: 'git-repo-analyzer',
      version: '1.0.0',
      analyzedAt: new Date().toISOString(),
      durationMs: 12,
    },
    basicStats: {} as AnalysisResult['basicStats'],
    commits: {
      ...({} as AnalysisResult['commits']),
      commits: Array.from({ length: COMMIT_FETCH_LIMIT }, () => mockCommit),
    },
    pullRequests: {
      ...({} as AnalysisResult['pullRequests']),
      pulls: Array.from({ length: PR_FETCH_LIMIT }, () => mockPull),
    },
    contributors: {
      ...({} as AnalysisResult['contributors']),
      topContributors: Array.from({ length: CONTRIBUTORS_FETCH_LIMIT }, (_, idx) => ({
        login: `u${idx}`,
        contributions: idx + 1,
      })),
      recentContributors: [
        { login: 'alice', contributions: 5 },
        { login: 'bob', contributions: 3 },
      ],
    },
    languages: {} as AnalysisResult['languages'],
    techStack: {} as AnalysisResult['techStack'],
    healthScore: {} as AnalysisResult['healthScore'],
    userProfiles: [
      { login: 'alice', timezone: 'America/New_York' },
      { login: 'bob', timezone: null },
      { login: 'someone-else', timezone: null },
    ] as AnalysisResult['userProfiles'],
    fileTree: {} as AnalysisResult['fileTree'],
    ...overrides,
  };
}

describe('computeDataWarnings', () => {
  it('detects capped datasets and missing recent contributor timezones', () => {
    const warnings = computeDataWarnings(buildResult());

    expect(warnings.commitsCapped).toBe(true);
    expect(warnings.pullRequestsCapped).toBe(true);
    expect(warnings.contributorsCapped).toBe(true);
    expect(warnings.contributorsMissingTimezone).toBe(1);
    expect(warnings.totalRecentContributors).toBe(2);
  });

  it('returns uncapped false values below limits', () => {
    const warnings = computeDataWarnings(
      buildResult({
        commits: { ...({} as AnalysisResult['commits']), commits: [] },
        pullRequests: { ...({} as AnalysisResult['pullRequests']), pulls: [] },
        contributors: {
          ...({} as AnalysisResult['contributors']),
          topContributors: [],
          recentContributors: [],
        },
        userProfiles: [],
      }),
    );

    expect(warnings.commitsCapped).toBe(false);
    expect(warnings.pullRequestsCapped).toBe(false);
    expect(warnings.contributorsCapped).toBe(false);
    expect(warnings.contributorsMissingTimezone).toBe(0);
    expect(warnings.totalRecentContributors).toBe(0);
  });
});
