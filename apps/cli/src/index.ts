/**
 * Git Repo Analyzer - TypeScript Library
 *
 * This module exports the main library functionality for analyzing GitHub repositories.
 * It can be used programmatically in Node.js/Bun applications.
 *
 * @example
 * ```typescript
 * import { analyze, formatResult } from 'git-repo-analyzer-cli';
 *
 * const result = await analyze('facebook/react');
 * console.log(formatResult(result));
 * ```
 */

export {
  analyzeGitRepository,
  type AnalysisResult,
  type ProgressUpdate,
  type Contributor,
  type LanguageBreakdown,
  type RepositoryStats,
} from '@git-repo-analyzer/core';

import type { AnalysisResult } from '@git-repo-analyzer/core';

/**
 * Format an analysis result as a human-readable string
 */
export function formatResult(result: AnalysisResult): string {
  const lines: string[] = [
    `Repository: ${result.repository}`,
    `Analyzed: ${result.analyzedAt.toISOString()}`,
    '',
    'Statistics:',
    `  Commits: ${result.stats.totalCommits.toLocaleString()}`,
    `  Contributors: ${result.stats.totalContributors.toLocaleString()}`,
    `  Files: ${result.stats.totalFiles.toLocaleString()}`,
    `  Lines of Code: ${result.stats.totalLinesOfCode.toLocaleString()}`,
    `  Primary Language: ${result.stats.primaryLanguage}`,
    '',
    'Languages:',
  ];

  for (const lang of result.languages) {
    lines.push(
      `  ${lang.language}: ${lang.percentage}% (${lang.linesOfCode.toLocaleString()} lines)`
    );
  }

  lines.push('');
  lines.push(`Analysis completed in ${result.durationMs}ms`);

  return lines.join('\n');
}

/**
 * Format an analysis result as JSON
 */
export function formatResultJson(result: AnalysisResult): string {
  return JSON.stringify(result, null, 2);
}
