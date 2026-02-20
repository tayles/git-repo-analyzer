export type { ProgressUpdate, Contributor, AnalysisResult } from './types';
export { TOOL_REGISTRY } from './tool-registry';
export { LANGUAGE_COLORS } from './utils/language-utils';

import { processBasicStats } from './analyzers/basic-stats';
import { processCommits } from './analyzers/commits';
import { processContributors } from './analyzers/contributors';
import { processHealthScore } from './analyzers/health-score';
import { processLanguages } from './analyzers/languages';
import { processPullRequests } from './analyzers/pull-requests';
import { processTooling } from './analyzers/tooling-detection';
import { GitHubAPI } from './client/github-api';
import type {
  GitHubCommit,
  GitHubContributor,
  GitHubFileTree,
  GitHubLanguage,
  GitHubPullRequest,
  GitHubRawData,
  GitHubRepoDetails,
  GitHubUserProfile,
} from './client/github-types';
import type { AnalysisResult, AnalysisResultWithRaw, AnalyzeOptions } from './types';
import { delay } from './utils/async-utils';
import { parseRepository } from './utils/parse-utils';

/**
 * Analyze a GitHub repository and return comprehensive statistics
 *
 * @param repoNameOrUrl - GitHub repository in the format "owner/repo" or full URL
 * @param options - Optional configuration for the analysis
 * @returns Promise resolving to the complete analysis result
 *
 * @example
 * ```typescript
 * const result = await analyzeGitRepository('facebook/react');
 * console.log(result.basicStats.totalCommits);
 * ```
 *
 * @example
 * ```typescript
 * // With options
 * const controller = new AbortController();
 * const result = await analyzeGitRepository('facebook/react', {
 *   token: process.env.GITHUB_TOKEN,
 *   signal: controller.signal,
 *   verbose: true,
 *   onProgress: (progress) => console.log(`${progress.phase}: ${progress.progress}%`),
 * });
 * ```
 */
export async function analyzeGitRepository(
  repoNameOrUrl: string,
  options: AnalyzeOptions & { includeRawData: true },
): Promise<AnalysisResultWithRaw>;
export async function analyzeGitRepository(
  repoNameOrUrl: string,
  options?: AnalyzeOptions,
): Promise<AnalysisResult>;
export async function analyzeGitRepository(
  repoNameOrUrl: string,
  options?: AnalyzeOptions,
): Promise<AnalysisResult> {
  const { token, signal, verbose, onProgress, includeRawData } = options ?? {};
  const startTime = Date.now();
  const repo = parseRepository(repoNameOrUrl);

  // Report initial progress
  onProgress?.({
    phase: 'fetching',
    progress: 0,
    message: `Fetching data for ${repo}...`,
  });

  const rawData = await fetchRepositoryData(repo, { token, signal, verbose, onProgress });

  onProgress?.({
    phase: 'analyzing',
    progress: 80,
    message: 'Analyzing...',
  });

  // Process raw data to compute analysis result
  const basicStats = processBasicStats(rawData.repoDetails);
  const contributors = processContributors(
    rawData.contributors,
    rawData.commits,
    rawData.userProfiles,
  );
  const commits = processCommits(rawData.commits, contributors);
  const pullRequests = processPullRequests(rawData.pullRequests);
  const languages = processLanguages(rawData.languages);

  onProgress?.({
    phase: 'analyzing',
    progress: 90,
    message: 'Detecting tooling...',
  });

  await delay(1); // Yield to allow progress update to render

  const tooling = processTooling(rawData.files);
  const healthScore = processHealthScore({
    basicStats,
    contributors,
    commits,
    pullRequests,
    languages,
    tooling,
  });

  const durationMs = Date.now() - startTime;

  const result: AnalysisResult = {
    generator: {
      name: 'git-repo-analyzer',
      version: '1.0.0',
      analyzedAt: new Date().toISOString(),
      durationMs,
    },
    basicStats,
    contributors,
    commits,
    pullRequests,
    languages,
    tooling,
    healthScore,
    ...(includeRawData ? { raw: rawData } : {}),
  };

  // Report completion
  onProgress?.({
    phase: 'complete',
    progress: 100,
    message: 'Analysis complete!',
  });

  await delay(1); // Yield to allow progress update to render

  return result;
}

export async function fetchRepositoryData(
  repo: string,
  options?: AnalyzeOptions,
): Promise<GitHubRawData> {
  const { token, signal, verbose, onProgress } = options ?? {};
  const api = new GitHubAPI({ token, signal, verbose });

  let completed = 0;
  const totalSteps = 7;

  function trackCompletion<T>(label: string): (result: T) => T {
    return (result: T) => {
      completed++;
      onProgress?.({
        phase: 'fetching',
        progress: Math.round((completed / totalSteps) * 80),
        message: `Completed ${completed} of ${totalSteps}: ${label}`,
      });
      return result;
    };
  }

  // Phase 1: Fetch raw data in parallel
  const [repoDetails, contributors, commits, pullRequests, languages, files] = await Promise.all([
    fetchRepoDetails(api, repo).then(trackCompletion('Repository details')),
    fetchContributors(api, repo).then(trackCompletion('Contributors')),
    fetchCommits(api, repo).then(trackCompletion('Commits')),
    fetchPullRequests(api, repo).then(trackCompletion('Pull requests')),
    fetchLanguages(api, repo).then(trackCompletion('Languages')),
    fetchRepoFiles(api, repo).then(trackCompletion('File tree')),
  ]);

  // Phase 2: Determine which user profiles we need (top + recent contributors, deduplicated)
  const topLogins = contributors
    .filter(c => !c.login.toLowerCase().includes('[bot]'))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 10)
    .map(c => c.login);

  const recentLogins = extractRecentContributorLogins(commits);

  // Merge both lists, preserving order but deduplicating
  const allLogins = [...new Set([...topLogins, ...recentLogins])];

  const userProfiles = await fetchUserProfiles(api, allLogins);
  trackCompletion('User profiles')(userProfiles);

  return {
    repoDetails,
    contributors,
    commits,
    pullRequests,
    languages,
    files,
    userProfiles,
  };
}

/**
 * Extract the top 10 recent contributor logins from commits, sorted by commit count.
 * Filters out bots and returns unique logins.
 */
export function extractRecentContributorLogins(commits: GitHubCommit[]): string[] {
  const counts = new Map<string, { login: string; count: number }>();

  for (const commit of commits) {
    const login = commit.author?.login;
    if (!login) continue;
    if (commit.author?.type === 'Bot') continue;
    if (login.toLowerCase().includes('[bot]')) continue;

    const existing = counts.get(login);
    if (existing) {
      existing.count++;
    } else {
      counts.set(login, { login, count: 1 });
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(e => e.login);
}

export async function fetchRepoDetails(api: GitHubAPI, repo: string): Promise<GitHubRepoDetails> {
  return await api.fetch<GitHubRepoDetails>(`/repos/${repo}`);
}

export async function fetchContributors(
  api: GitHubAPI,
  repo: string,
): Promise<GitHubContributor[]> {
  return await api.fetchPaginated<GitHubContributor>(`/repos/${repo}/contributors`, 1);
}

/**
 * Fetch user profiles for a list of logins, deduplicating requests.
 * Uses a cache to avoid fetching the same user twice.
 */
export async function fetchUserProfiles(
  api: GitHubAPI,
  logins: string[],
): Promise<GitHubUserProfile[]> {
  return await Promise.all(
    logins.map(async login => {
      return await api.fetch<GitHubUserProfile>(`/users/${login}`);
    }),
  );
}

/** @deprecated Use fetchContributors + fetchUserProfiles instead */
export async function fetchTopContributors(
  api: GitHubAPI,
  repo: string,
): Promise<{ contributors: GitHubContributor[]; userProfiles: GitHubUserProfile[] }> {
  const contributors = await fetchContributors(api, repo);

  const top10 = contributors
    .filter(c => !c.login.toLowerCase().includes('[bot]'))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 10);

  const userProfiles = await fetchUserProfiles(
    api,
    top10.map(c => c.login),
  );

  return { contributors, userProfiles };
}

export async function fetchCommits(api: GitHubAPI, repo: string): Promise<GitHubCommit[]> {
  return await api.fetchPaginated<GitHubCommit>(`/repos/${repo}/commits`, 3);
}

export async function fetchPullRequests(
  api: GitHubAPI,
  repo: string,
): Promise<GitHubPullRequest[]> {
  return await api.fetchPaginated<GitHubPullRequest>(
    `/repos/${repo}/pulls?state=all&sort=created&direction=desc`,
    3,
  );
}

export async function fetchLanguages(api: GitHubAPI, repo: string): Promise<GitHubLanguage> {
  return await api.fetch<GitHubLanguage>(`/repos/${repo}/languages`);
}

export async function fetchRepoFiles(api: GitHubAPI, repo: string): Promise<GitHubFileTree> {
  return await api.fetch<GitHubFileTree>(`/repos/${repo}/git/trees/HEAD?recursive=1`);
}
