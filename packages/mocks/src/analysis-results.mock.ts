import type { AnalysisResult, Contributor } from '@git-repo-analyzer/core';

import MockResultJson from './analysis-result.json';
/**
 * Mock contributors for testing
 */
export const mockContributors: Contributor[] = [
  {
    login: 'alice',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
    contributions: 150,
    htmlUrl: 'https://github.com/alice',
    location: 'San Francisco, CA',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    timezone: 'America/Los_Angeles',
    utcOffset: -480,
  },
];

export const mockResult: AnalysisResult = MockResultJson as unknown as AnalysisResult;

/**
 * Create a mock analysis result
 */
export function createMockAnalysisResult(
  _repository: string = 'test-org/test-repo',
  overrides: Partial<AnalysisResult> = {},
): AnalysisResult {
  return { ...mockResult, ...overrides };
}
