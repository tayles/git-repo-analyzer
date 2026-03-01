export type { ProgressUpdate, Contributor, AnalysisResult } from './types';
export { TOOL_REGISTRY } from './tool-registry';
export { LANGUAGE_COLORS } from './utils/language-utils';

// import RawJson from '../../mocks/data/facebook__docusaurus.raw.json';
import { processBasicStats } from './analyzers/basic-stats';
import { processCommits } from './analyzers/commits';
import { processContributors } from './analyzers/contributors';
import { processFileTree } from './analyzers/file-tree';
import { processHealthScore } from './analyzers/health-score';
import { processLanguages } from './analyzers/languages';
import { processPullRequests } from './analyzers/pull-requests';
import { processTechStack } from './analyzers/tech-stack-detection';
import { processUserProfiles } from './analyzers/user-profiles';
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
): Promise<AnalysisResult | AnalysisResultWithRaw> {
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
  // await Bun.write('./packages/mocks/data/debug.raw.json', JSON.stringify(rawData, null, 2));
  // const rawData = RawJson as GitHubRawData;

  onProgress?.({
    phase: 'analyzing',
    progress: 80,
    message: 'Analyzing...',
  });

  // Process raw data to compute analysis result
  const basicStats = processBasicStats(rawData.repoDetails);
  const userProfiles = processUserProfiles(rawData.userProfiles);
  const commits = processCommits(rawData.commits, userProfiles);
  const contributors = processContributors(rawData.contributors, userProfiles, rawData.commits);
  const pullRequests = processPullRequests(rawData.pullRequests, userProfiles);
  const languages = processLanguages(rawData.languages);
  const fileTree = processFileTree(rawData.files);

  onProgress?.({
    phase: 'analyzing',
    progress: 90,
    message: 'Detecting tech stack...',
  });

  await delay(1); // Yield to allow progress update to render

  const techStack = processTechStack(rawData.files, basicStats.language);
  const healthScore = processHealthScore({
    basicStats,
    contributors,
    commits,
    pullRequests,
    languages,
    techStack,
    userProfiles,
    fileTree,
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
    techStack,
    fileTree,
    healthScore,
    userProfiles,
  };

  // Report completion
  onProgress?.({
    phase: 'complete',
    progress: 100,
    message: 'Analysis complete!',
  });

  await delay(1); // Yield to allow progress update to render

  if (includeRawData) {
    return { result, raw: rawData };
  } else {
    return result;
  }
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

  const [repoDetails, contributors, commits, pullRequests, languages, files] = await Promise.all([
    fetchRepoDetails(api, repo).then(trackCompletion('Repository details')),
    fetchContributors(api, repo).then(trackCompletion('Contributors & profiles')),
    fetchCommits(api, repo).then(trackCompletion('Commits')),
    fetchPullRequests(api, repo).then(trackCompletion('Pull requests')),
    fetchLanguages(api, repo).then(trackCompletion('Languages')),
    fetchRepoFiles(api, repo).then(trackCompletion('File tree')),
  ]);

  onProgress?.({
    phase: 'fetching',
    progress: 90,
    message: `Fetching user profiles...`,
  });

  const top10AuthorLogins = Object.entries(
    commits.reduce(
      (acc, commit) => {
        const login = commit.author?.login;
        if (login) {
          acc[login] = (acc[login] ?? 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    ),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([login]) => login);

  const userProfiles = await fetchUserProfiles(api, top10AuthorLogins);

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
): Promise<GitHubContributor[]> {
  try {
    return await api.fetchPaginated<GitHubContributor>(`/repos/${repo}/contributors`, 3);
  } catch {
    return [];
  }
}

/**
 * Fetch user profiles for a list of logins
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

export async function fetchCommits(api: GitHubAPI, repo: string): Promise<GitHubCommit[]> {
  return await api.fetchPaginated<GitHubCommit>(`/repos/${repo}/commits`, 3);
}

export async function fetchPullRequests(
  api: GitHubAPI,
  repo: string,
): Promise<GitHubPullRequest[]> {
  try {
    return await api.fetchPaginated<GitHubPullRequest>(
      `/repos/${repo}/pulls?state=all&sort=created&direction=desc`,
      3,
    );
  } catch {
    return [];
  }
}

export async function fetchLanguages(api: GitHubAPI, repo: string): Promise<GitHubLanguage> {
  return await api.fetch<GitHubLanguage>(`/repos/${repo}/languages`);
}

export async function fetchRepoFiles(api: GitHubAPI, repo: string): Promise<GitHubFileTree> {
  return await api.fetch<GitHubFileTree>(`/repos/${repo}/git/trees/HEAD?recursive=1`);
}
