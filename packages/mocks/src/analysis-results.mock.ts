import type { AnalysisResult, Contributor, GitHubRawData } from '@git-repo-analyzer/core';

import MockRawDataFacebookDocusaurusJson from '../data/facebook__docusaurus.raw.json';
import MockResultFacebookDocusaurusJson from '../data/facebook__docusaurus.report.json';

/**
 * Mock contributors for testing
 */
export const mockContributors: Contributor[] = [
  {
    login: 'alice',
    contributions: 150,
  },
];

export const mockResult: AnalysisResult =
  MockResultFacebookDocusaurusJson as unknown as AnalysisResult;

export const mockRawData: GitHubRawData =
  MockRawDataFacebookDocusaurusJson as unknown as GitHubRawData;

/**
 * Create a mock analysis result
 */
export function createMockAnalysisResult(
  _repository: string = 'test-org/test-repo',
  overrides: Partial<AnalysisResult> = {},
): AnalysisResult {
  return { ...mockResult, ...overrides };
}
