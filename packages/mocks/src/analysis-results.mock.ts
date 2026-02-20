import type {
  AnalysisResult,
  AnalysisResultWithRaw,
  Contributor,
  GitHubRawData,
} from '@git-repo-analyzer/core';

import MockResultFacebookDocusaurusJson from '../data/facebook__docusaurus.json';

/**
 * Mock contributors for testing
 */
export const mockContributors: Contributor[] = [
  {
    id: 123,
    name: 'Alice Smith',
    login: 'alice',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
    contributions: 150,
    htmlUrl: 'https://github.com/alice',
    location: 'San Francisco, CA',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    timezone: 'America/Los_Angeles',
  },
];

export const mockResultWithRawData: AnalysisResultWithRaw =
  MockResultFacebookDocusaurusJson as unknown as AnalysisResultWithRaw;

const { raw: rawData, ...rest } = mockResultWithRawData;

export const mockRawData: GitHubRawData = rawData;
export const mockResult: AnalysisResult = rest;

/**
 * Create a mock analysis result
 */
export function createMockAnalysisResult(
  _repository: string = 'test-org/test-repo',
  overrides: Partial<AnalysisResultWithRaw> = {},
): AnalysisResultWithRaw {
  return { ...mockResultWithRawData, ...overrides };
}
