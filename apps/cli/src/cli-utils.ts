import type { AnalysisResult } from '@git-repo-analyzer/core';

/**
 * Format an analysis result as a human-readable string
 */
export function formatResult(result: AnalysisResult): string {
  const lines: string[] = [
    `Repository: ${result.basicStats.fullName}`,
    `Analyzed: ${result.generator.analyzedAt}`,
    '',
    'Statistics:',
    `  Commits: ${result.commits.totalCommits.toLocaleString()}`,
    `  Contributors: ${result.contributors.totalContributors.toLocaleString()}`,
    `  Tools: ${result.tooling.categories.join(', ') || 'None'}`,
    `  Primary Language: ${result.languages.primaryLanguage || 'Unknown'}`,
    '',
    'Languages:',
  ];

  lines.push('');
  lines.push(`Analysis completed in ${result.generator.durationMs}ms`);

  return lines.join('\n');
}

/**
 * Format an analysis result as JSON
 */
export function formatResultJson(result: AnalysisResult): string {
  return JSON.stringify(result, null, 2);
}
