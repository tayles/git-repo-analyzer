/**
 * Progress update sent during repository analysis
 */
export interface ProgressUpdate {
  /** Current phase of the analysis */
  phase: 'fetching' | 'parsing' | 'analyzing' | 'complete';
  /** Progress percentage (0-100) */
  progress: number;
  /** Human-readable message describing current status */
  message: string;
}

/**
 * Statistics about the repository
 */
export interface RepositoryStats {
  /** Total number of commits */
  totalCommits: number;
  /** Total number of contributors */
  totalContributors: number;
  /** Total number of files */
  totalFiles: number;
  /** Total lines of code */
  totalLinesOfCode: number;
  /** Primary programming language */
  primaryLanguage: string;
  /** Date of first commit */
  firstCommitDate: Date;
  /** Date of most recent commit */
  lastCommitDate: Date;
}

/**
 * Information about a contributor
 */
export interface Contributor {
  /** Username or name of the contributor */
  name: string;
  /** Email if available */
  email?: string;
  /** Number of commits by this contributor */
  commitCount: number;
  /** Number of lines added */
  linesAdded: number;
  /** Number of lines deleted */
  linesDeleted: number;
}

/**
 * Language breakdown of the repository
 */
export interface LanguageBreakdown {
  /** Language name */
  language: string;
  /** Number of files in this language */
  fileCount: number;
  /** Lines of code in this language */
  linesOfCode: number;
  /** Percentage of total codebase */
  percentage: number;
}

/**
 * Complete analysis result for a repository
 */
export interface AnalysisResult {
  /** Repository name in format "owner/repo" */
  repository: string;
  /** When the analysis was performed */
  analyzedAt: Date;
  /** Overall repository statistics */
  stats: RepositoryStats;
  /** List of contributors */
  contributors: Contributor[];
  /** Language breakdown */
  languages: LanguageBreakdown[];
  /** Analysis duration in milliseconds */
  durationMs: number;
}

/**
 * Options for the analyzeGitRepository function
 */
export interface AnalyzeOptions {
  /** GitHub token for authenticated requests */
  token?: string;
  /** Callback for progress updates */
  onProgress?: (update: ProgressUpdate) => void;
}

export const TOOL_CATEGORIES = [
  'AI Tools',
  'Package Managers',
  'Frameworks',
  'Testing',
  'Linting & Formatting',
  'Monorepo',
  'CI/CD & Deployment',
  'IDEs',
] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export type ToolName = string;

export interface ToolMetaBasic {
  logo: string | null;
  url: string;
  /** Glob patterns to match against file paths. Patterns ending with / match directories. */
  files: string[];
}

export interface ToolMeta extends ToolMetaBasic {
  name: string;
  category: ToolCategory;
}
