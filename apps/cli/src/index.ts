/**
 * Git Repo Analyzer - TypeScript Library
 *
 * This module exports the main library functionality for analyzing GitHub repositories.
 * It can be used programmatically in Node.js applications.
 *
 * @example
 * ```typescript
 * import { analyzeGitRepository } from 'git-repo-analyzer';
 *
 * const result = await analyzeGitRepository('facebook/react');
 * console.log(result);
 * ```
 */

export {
  analyzeGitRepository,
  type AnalysisResult,
  type ProgressUpdate,
} from '@git-repo-analyzer/core';
