import type { AnalysisResult, Contributor, LanguageBreakdown } from '@git-repo-analyzer/core';

/**
 * Mock contributors for testing
 */
export const mockContributors: Contributor[] = [
  {
    name: 'Alice Developer',
    email: 'alice@example.com',
    commitCount: 523,
    linesAdded: 45000,
    linesDeleted: 12000,
  },
  {
    name: 'Bob Engineer',
    email: 'bob@example.com',
    commitCount: 312,
    linesAdded: 28000,
    linesDeleted: 8500,
  },
  {
    name: 'Charlie Coder',
    email: 'charlie@example.com',
    commitCount: 187,
    linesAdded: 15000,
    linesDeleted: 5000,
  },
];

/**
 * Mock language breakdown for testing
 */
export const mockLanguages: LanguageBreakdown[] = [
  {
    language: 'TypeScript',
    fileCount: 245,
    linesOfCode: 62000,
    percentage: 55,
  },
  {
    language: 'JavaScript',
    fileCount: 89,
    linesOfCode: 25000,
    percentage: 22,
  },
  {
    language: 'CSS',
    fileCount: 45,
    linesOfCode: 12000,
    percentage: 11,
  },
  {
    language: 'JSON',
    fileCount: 32,
    linesOfCode: 8000,
    percentage: 7,
  },
  {
    language: 'Markdown',
    fileCount: 18,
    linesOfCode: 5500,
    percentage: 5,
  },
];

/**
 * Create a mock analysis result
 */
export function createMockAnalysisResult(
  repository: string = 'test-org/test-repo',
  overrides: Partial<AnalysisResult> = {},
): AnalysisResult {
  return {
    repository,
    analyzedAt: new Date(),
    stats: {
      totalCommits: 1022,
      totalContributors: mockContributors.length,
      totalFiles: 429,
      totalLinesOfCode: 112500,
      primaryLanguage: 'TypeScript',
      firstCommitDate: new Date('2021-03-15'),
      lastCommitDate: new Date('2024-12-01'),
    },
    contributors: mockContributors,
    languages: mockLanguages,
    durationMs: 1250,
    ...overrides,
  };
}

/**
 * Create a mock analysis result with minimal data
 */
export function createMinimalMockAnalysisResult(
  repository: string = 'minimal/repo',
): AnalysisResult {
  return {
    repository,
    analyzedAt: new Date(),
    stats: {
      totalCommits: 10,
      totalContributors: 1,
      totalFiles: 5,
      totalLinesOfCode: 500,
      primaryLanguage: 'JavaScript',
      firstCommitDate: new Date('2024-01-01'),
      lastCommitDate: new Date('2024-01-15'),
    },
    contributors: [mockContributors[0]],
    languages: [mockLanguages[1]],
    durationMs: 100,
  };
}
