import type { GitHubRawData } from './client/github-types';
import type { ToolCategory, ToolMetaWithFileMatches } from './tool-registry';

export interface GeneratorInfo {
  name: string;
  version: string;
  analyzedAt: string;
  durationMs: number;
}

export interface BasicStats {
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  language: string | null;
  license: string | null;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  defaultBranch: string;
  size: number;
  hasWiki: boolean;
  hasPages: boolean;
  archived: boolean;
  topics: string[];
  homepage: string | null;
  owner: {
    login: string;
    id: number;
    avatarUrl: string;
  };
}

export interface UserProfile {
  id: number;
  name: string | null;
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  location: string | null;

  // Derived fields from location string
  country: string | null;
  countryCode: string | null;
  flag: string | null;
  timezone: string | null;
}
export interface Contributor {
  login: string;
  contributions: number;
}

export type TeamSize = 'solo' | 'small' | 'medium' | 'large';

export interface ContributorAnalysis {
  totalContributors: number;
  teamSize: TeamSize;
  busFactor: number;
  topContributors: Contributor[];
  recentContributors: Contributor[];

  /**
   * Denormalised data based on recent contributors
   */
  primaryCountry: string | null;
  primaryCountryCode: string | null;
  primaryTimezone: string | null;
}

export interface UserProfileAnalysis {
  users: UserProfile[];
}

/**
 * Days (0-6) on Y axis, Hours (0-23) on X axis
 * Each cell contains the count of commits for that day/hour
 * Also returns the max value for scaling the heatmap visualization
 */
export interface ActivityHeatmap {
  grid: number[][];
  maxValue: number;
}

export interface CommitConventionsAnalysis {
  conventionalCommits: boolean;
  gitmoji: boolean;
  prefixes: Record<string, number>;
}

export type TimeOfDay = 'weekend' | 'workday' | 'offHours';

export type WorkPatternClassification = 'professional' | 'mixed' | 'hobbyist';

export interface WorkPatterns {
  classification: WorkPatternClassification;
  workHoursPercent: number;
  eveningsPercent: number;
  weekendsPercent: number;
}

/**
 * @example
 * { '2023-01-02': { user1: 5, user2: 3 }, '2023-01-09': { user3: 1 } }
 */
export type CommitsPerWeek = Record<
  string,
  { total: number; byType: Record<string, number>; byAuthor: Record<string, number> }
>;

/**
 * @example
 * { '2023-01-02': { byType: { open: 4, closed: 2 }, byAuthor: { user1: 3, user2: 3 } }, ... }
 */
export type PullStatus = 'open' | 'merged' | 'closed';

export type PullsPerWeek = Record<
  string,
  {
    total: number;
    byType: Record<string, number>;
    byStatus: Record<PullStatus, number>;
    byAuthor: Record<string, number>;
  }
>;

export interface DecoratedCommit {
  sha: string;
  author: string | null;
  message: CommitMessageAnalysis;
  date: DateAnalysis;
}

export interface DecoratedPullRequest {
  number: number;
  author: string | null;
  title: PullRequestTitleAnalysis;
  date: DateAnalysis;
  status: PullStatus;
  mergedAt: string | null;
  closedAt: string | null;
}

export interface PullRequestTitleAnalysis extends CommitMessageAnalysis {}

export interface DateAnalysis {
  orig: string;
  local: string | null;
  weekStart: string;
  dayOfWeek: number;
  hourOfDay: number;
  timeOfDay: TimeOfDay;
}

export type CommitConvention = 'conventional' | 'gitmoji' | null;

export interface CommitMessageAnalysis {
  raw: string;
  type: string | null;
  scope: string | null;
  convention: CommitConvention;
}
export interface CommitAnalysis {
  totalCommits: number;
  firstCommitDate: string | null;
  lastCommitDate: string | null;
  conventions: CommitConventionsAnalysis;
  workPatterns: WorkPatterns;
  commits: DecoratedCommit[];
}

export interface PullAnalysisCounts {
  total: number;
  open: number;
  closed: number;
  merged: number;
}

export interface PullAnalysis {
  counts: PullAnalysisCounts;
  conventions: CommitConventionsAnalysis;
  pulls: DecoratedPullRequest[];
}

export interface LanguageAnalysis {
  primaryLanguage: string | null;
  langs: LanguageDetails[];
}

export interface LanguageDetails {
  name: string;
  bytes: number;
  percent: number;
  color: string;
}

export interface ToolAnalysis {
  tools: ToolMetaWithFileMatches[];
  categories: ToolCategory[];
}

export interface DirectorySize {
  /** Top-level directory name (or "." for repository root files) */
  name: string;
  /** Directory path relative to repository root */
  path: string;
  bytes: number;
  fileCount: number;
}

export interface FileTreeAnalysis {
  totalBytes: number;
  totalFiles: number;
  directories: DirectorySize[];
}

export type HealthCategory =
  | 'Maintenance'
  | 'Documentation'
  | 'Community'
  | 'Code Quality'
  | 'Security';

export interface HealthScoreDetail {
  message: string;
  delta: number;
}

export interface HealthScore {
  score: number;
  maxScore: number;
  details: HealthScoreDetail[];
}

export interface HealthScoreAnalysis {
  overall: number;
  categories: Record<HealthCategory, HealthScore>;
}

export interface AnalysisResult {
  generator: GeneratorInfo;
  basicStats: BasicStats;
  contributors: ContributorAnalysis;
  commits: CommitAnalysis;
  pullRequests: PullAnalysis;
  languages: LanguageAnalysis;
  techStack: ToolAnalysis;
  fileTree: FileTreeAnalysis;
  healthScore: HealthScoreAnalysis;
  userProfiles: UserProfile[];
}

/** Wrapper for Analysis result and the original raw GitHub API data */
export interface AnalysisResultWithRaw {
  result: AnalysisResult;
  raw: GitHubRawData;
}

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
 * Options for analyzeGitRepository
 */
export interface AnalyzeOptions {
  /** GitHub token for authenticated requests and higher rate limits */
  token?: string;
  /** AbortSignal for cancelling in-progress analysis */
  signal?: AbortSignal;
  /** Enable verbose console logging (API calls, rate limits) */
  verbose?: boolean;
  /** Callback for progress updates during analysis */
  onProgress?: (update: ProgressUpdate) => void;
  /** Include raw GitHub API data in the result (default: false) */
  includeRawData?: boolean;
}
