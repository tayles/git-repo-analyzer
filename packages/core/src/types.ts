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

export interface Contributor {
  login: string;
  avatarUrl: string;
  contributions: number;
  htmlUrl: string;
  location: string | null;
  country: string | null;
  countryCode: string | null;
  flag: string | null;
  timezone: string | null;
  utcOffset: number | null;
}

export type TeamSize = 'solo' | 'small' | 'medium' | 'large';

export interface ContributorAnalysis {
  totalContributors: number;
  teamSize: TeamSize;
  busFactor: number;
  primaryCountry: string | null;
  primaryCountryCode: string | null;
  primaryTimezone: string | null;
  topContributors: Contributor[];
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

export type WorkPatternClassification = 'professional' | 'mixed' | 'hobbyist';

export interface WorkPatterns {
  classification: WorkPatternClassification;
  workHoursPercent: number;
  eveningsPercent: number;
  weekendsPercent: number;
}

export type BucketByWeek = Record<string, number>; // e.g. { '2023-01-02': 5, '2023-01-09': 8 }

export interface CommitAnalysis {
  totalCommits: number;
  firstCommitDate: string | null;
  lastCommitDate: string | null;
  conventions: CommitConventionsAnalysis;
  workPatterns: WorkPatterns;
  activityHeatmap: ActivityHeatmap;
  byWeek: BucketByWeek;
}

export interface PullAnalysis {
  totalOpen: number;
  totalClosed: number;
  totalMerged: number;
  avgMergeTimeHours: number | null;
  byWeek: BucketByWeek;
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
  tooling: ToolAnalysis;
  healthScore: HealthScoreAnalysis;
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
}
