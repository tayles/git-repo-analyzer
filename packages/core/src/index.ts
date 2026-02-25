export type {
  ActivityHeatmap,
  AnalysisResult,
  AnalysisResultWithRaw,
  AnalyzeOptions,
  CommitAnalysis,
  CommitConventionsAnalysis,
  CommitsPerWeek,
  Contributor,
  ContributorAnalysis,
  DecoratedCommit,
  DirectorySize,
  FileTreeAnalysis,
  HealthScore,
  HealthScoreAnalysis,
  LanguageAnalysis,
  ProgressUpdate,
  PullAnalysis,
  PullsPerWeek,
  PullStatus,
  UserProfile,
  WorkPatterns,
} from './types';
export type { GitHubRawData, GitHubCommit, GitHubPullRequest } from './client/github-types';
export { TOOL_REGISTRY, type ToolMeta, type ToolMetaWithFileMatches } from './tool-registry';
export { LANGUAGE_COLORS } from './utils/language-utils';
export { countryCodeToEmojiFlag } from './utils/location-utils';
export { relativeDateLabel, formatWeekLabel, formatDate } from './utils/date-utils';
export { calculateBusFactor } from './utils/bus-factor';
export { analyzeGitRepository } from './analyze-repo';
export { formatBytes, formatNumber } from './utils/format-utils';
export {
  computeActivityHeatmap,
  analyzeWorkPatterns,
  computeCommitsPerWeek,
  detectConventions,
} from './analyzers/commits';
export { computePullsPerWeek } from './analyzers/pull-requests';
export { processFileTree } from './analyzers/file-tree';
export {
  computeDataWarnings,
  COMMIT_FETCH_LIMIT,
  PR_FETCH_LIMIT,
  CONTRIBUTORS_FETCH_LIMIT,
  USER_PROFILES_FETCH_LIMIT,
  type DataWarnings,
} from './utils/data-warnings';
