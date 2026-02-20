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
 * const result = await analyzeGitRepository('facebook/docusaurus');
 * console.log(result.basicStats.totalCommits);
 * ```
 *
 * @example
 * ```typescript
 * // With options
 * const controller = new AbortController();
 * const result = await analyzeGitRepository('facebook/docusaurus', {
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
  const contributors = processContributors(rawData.contributors, rawData.userProfiles);
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
  const totalSteps = 6;

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

  const [repoDetails, { contributors, userProfiles }, commits, pullRequests, languages, files] =
    await Promise.all([
      fetchRepoDetails(api, repo).then(trackCompletion('Repository details')),
      fetchContributors(api, repo).then(trackCompletion('Contributors & profiles')),
      fetchCommits(api, repo).then(trackCompletion('Commits')),
      fetchPullRequests(api, repo).then(trackCompletion('Pull requests')),
      fetchLanguages(api, repo).then(trackCompletion('Languages')),
      fetchRepoFiles(api, repo).then(trackCompletion('File tree')),
    ]);

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

export async function fetchRepoDetails(api: GitHubAPI, repo: string): Promise<GitHubRepoDetails> {
  return await api.fetch<GitHubRepoDetails>(`/repos/${repo}`);
}

export async function fetchContributors(
  api: GitHubAPI,
  repo: string,
): Promise<{ contributors: GitHubContributor[]; userProfiles: GitHubUserProfile[] }> {
  const contributors = await api.fetchPaginated<GitHubContributor>(
    `/repos/${repo}/contributors`,
    1,
  );

  const top10 = contributors
    // Filter out bots
    .filter(c => !c.login.toLowerCase().includes('[bot]'))
    // Sort by contributions
    .sort((a, b) => b.contributions - a.contributions)
    // Take top 10
    .slice(0, 10);

  const userProfiles = await Promise.all(
    top10.map(async c => {
      return await api.fetch<GitHubUserProfile>(`/users/${c.login}`);
    }),
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
