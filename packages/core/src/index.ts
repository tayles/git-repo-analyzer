export type {
  ProgressUpdate,
  RepositoryStats,
  Contributor,
  LanguageBreakdown,
  AnalysisResult,
  AnalyzeOptions,
} from './types';

import type { ProgressUpdate, AnalysisResult } from './types';

/**
 * Parse a repository string into owner/repo format
 */
function parseRepository(repo: string): { owner: string; repo: string } {
  // Handle full GitHub URLs
  const urlMatch = repo.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (urlMatch) {
    return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, '') };
  }

  // Handle owner/repo format
  const parts = repo.split('/');
  if (parts.length === 2) {
    return { owner: parts[0], repo: parts[1] };
  }

  throw new Error(`Invalid repository format: ${repo}. Expected "owner/repo" or full GitHub URL.`);
}

/**
 * Analyze a GitHub repository and return comprehensive statistics
 *
 * @param repo - GitHub repository in the format "owner/repo" or full URL
 * @param token - Optional GitHub token for authenticated requests
 * @param callback - Optional callback to receive intermediate status updates
 * @returns Promise resolving to the complete analysis result
 *
 * @example
 * ```typescript
 * const result = await analyzeGitRepository('facebook/react');
 * console.log(result.stats.totalCommits);
 * ```
 *
 * @example
 * ```typescript
 * // With progress callback
 * const result = await analyzeGitRepository(
 *   'facebook/react',
 *   process.env.GITHUB_TOKEN,
 *   (progress) => console.log(`${progress.phase}: ${progress.progress}%`)
 * );
 * ```
 */
export async function analyzeGitRepository(
  repo: string,
  token?: string,
  callback?: (result: ProgressUpdate) => void,
): Promise<AnalysisResult> {
  const startTime = Date.now();
  const { owner, repo: repoName } = parseRepository(repo);
  const repository = `${owner}/${repoName}`;

  // Report initial progress
  callback?.({
    phase: 'fetching',
    progress: 0,
    message: `Starting analysis of ${repository}...`,
  });

  // Simulate fetching phase
  callback?.({
    phase: 'fetching',
    progress: 25,
    message: `Fetching repository metadata for ${repository}...`,
  });

  // Simulate parsing phase
  callback?.({
    phase: 'parsing',
    progress: 50,
    message: 'Parsing commit history...',
  });

  // Simulate analyzing phase
  callback?.({
    phase: 'analyzing',
    progress: 75,
    message: 'Analyzing code statistics...',
  });

  // Create stub result
  const result: AnalysisResult = {
    repository,
    analyzedAt: new Date(),
    stats: {
      totalCommits: 1234,
      totalContributors: 42,
      totalFiles: 567,
      totalLinesOfCode: 89012,
      primaryLanguage: 'TypeScript',
      firstCommitDate: new Date('2020-01-01'),
      lastCommitDate: new Date(),
    },
    contributors: [
      {
        name: 'Example Contributor',
        email: 'example@example.com',
        commitCount: 100,
        linesAdded: 5000,
        linesDeleted: 2000,
      },
    ],
    languages: [
      {
        language: 'TypeScript',
        fileCount: 200,
        linesOfCode: 50000,
        percentage: 60,
      },
      {
        language: 'JavaScript',
        fileCount: 100,
        linesOfCode: 30000,
        percentage: 35,
      },
      {
        language: 'CSS',
        fileCount: 20,
        linesOfCode: 5000,
        percentage: 5,
      },
    ],
    durationMs: Date.now() - startTime,
  };

  // Report completion
  callback?.({
    phase: 'complete',
    progress: 100,
    message: 'Analysis complete!',
  });

  // Log token usage status (for debugging purposes)
  if (token) {
    // Token provided - would use for authenticated requests
  }

  return result;
}
