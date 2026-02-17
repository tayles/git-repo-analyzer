export type { ProgressUpdate, Contributor, AnalysisResult } from './types';
export { TOOL_REGISTRY } from './tool-registry';
export { LANGUAGE_COLORS } from './utils/language-utils';

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
import type { ProgressUpdate, AnalysisResult } from './types';

// import GitHubRawDataJson from '../../mocks/src/github-api-raw.json';
import { processBasicStats } from './analyzers/basic-stats';
import { processCommits } from './analyzers/commits';
import { processContributors } from './analyzers/contributors';
import { processHealthScore } from './analyzers/health-score';
import { processLanguages } from './analyzers/languages';
import { processPullRequests } from './analyzers/pull-requests';
import { processTooling } from './analyzers/tooling-detection';
import { GitHubAPI } from './client/github-api';
import { parseRepository } from './utils/parse-utils';

/**
 * Analyze a GitHub repository and return comprehensive statistics
 *
 * @param repo - GitHub repository in the format "owner/repo" or full URL
 * @param token - Optional GitHub token for authenticated requests and higher rate limits
 * @param callback - Optional callback to receive intermediate status updates
 * @returns Promise resolving to the complete analysis result
 *
 * @example
 * ```typescript
 * const result = await analyzeGitRepository('facebook/react');
 * console.log(result.stats.totalCommits);
 * ```
 *
 * @example
 * ```typescript
 * // With progress callback
 * const result = await analyzeGitRepository(
 *   'facebook/react',
 *   process.env.GITHUB_TOKEN,
 *   (progress) => console.log(`${progress.phase}: ${progress.progress}%`)
 * );
 * ```
 */
export async function analyzeGitRepository(
  repoNameOrUrl: string,
  token?: string,
  callback?: (result: ProgressUpdate) => void,
): Promise<AnalysisResult> {
  const startTime = Date.now();
  const repo = parseRepository(repoNameOrUrl);

  // Report initial progress
  callback?.({
    phase: 'fetching',
    progress: 0,
    message: `Fetching data for ${repo}...`,
  });

  const rawData = await fetchRepositoryData(repo, token, callback);
  // const rawData = GitHubRawDataJson as unknown as GitHubRawData;

  callback?.({
    phase: 'analyzing',
    progress: 80,
    message: 'Analyzing...',
  });

  // console.log(rawData);

  // Process raw data to compute analysis result
  const basicStats = processBasicStats(rawData.repoDetails);
  const contributors = processContributors(rawData.contributors, rawData.userProfiles);
  const commits = processCommits(rawData.commits, contributors);
  const pullRequests = processPullRequests(rawData.pullRequests);
  const languages = processLanguages(rawData.languages);

  callback?.({
    phase: 'analyzing',
    progress: 90,
    message: 'Detecting tooling...',
  });

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

  // Combine all processed data into final result
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
  };

  console.log(result);

  // Report completion
  callback?.({
    phase: 'complete',
    progress: 100,
    message: 'Analysis complete!',
  });

  return result;

  // await delay(500);

  // // Simulate fetching phase
  // callback?.({
  //   phase: 'fetching',
  //   progress: 25,
  //   message: `Fetching repository metadata for ${repository}...`,
  // });

  // await delay(500);

  // // Simulate parsing phase
  // callback?.({
  //   phase: 'parsing',
  //   progress: 50,
  //   message: 'Parsing commit history...',
  // });

  // await delay(500);

  // // Simulate analyzing phase
  // callback?.({
  //   phase: 'analyzing',
  //   progress: 75,
  //   message: 'Analyzing code statistics...',
  // });

  // await delay(500);

  // const durationMs = Date.now() - startTime;

  // // Create stub result
  // const result: AnalysisResult = {
  //   generator: {
  //     name: 'git-repo-analyzer',
  //     version: '1.0.0',
  //     analyzedAt: new Date().toISOString(),
  //     durationMs
  //   },
  //   basicStats: {
  //     name: repoName,
  //       fullName: repository,
  // htmlUrl: `https://github.com/${repository}`,
  // description: `Description for ${repository}`,
  // stars: 0,
  // forks: 0,
  // openIssues: 0,
  // watchers: 0,
  // language: null,
  // license: 'MIT',
  // createdAt: new Date().toISOString(),
  // updatedAt: new Date().toISOString(),
  // pushedAt: new Date().toISOString(),
  // defaultBranch: 'main',
  // size: 0,
  // hasWiki: false,
  // hasPages: false,
  // archived: false,
  // topics: [],
  // homepage: null,
  //   },
  //   contributors: [
  //     {
  //       name: 'Example Contributor',
  //       email: 'alice@example.com',
  //       commitCount: 100,
  //       linesAdded: 5000,
  //       linesDeleted: 2000,
  //     },
  //   ],
  //   commits: {
  //     commits: [],

  //   },
  //   pullRequests: {
  //     pulls: [],
  //   },
  // };

  // // Report completion
  // callback?.({
  //   phase: 'complete',
  //   progress: 100,
  //   message: 'Analysis complete!',
  // });

  // // Log token usage status (for debugging purposes)
  // if (token) {
  //   // Token provided - would use for authenticated requests
  // }

  // return result;
}

export async function fetchRepositoryData(
  repo: string,
  token?: string,
  _callback?: (result: ProgressUpdate) => void,
): Promise<GitHubRawData> {
  const api = new GitHubAPI(token);

  const [repoDetails, { contributors, userProfiles }, commits, pullRequests, languages, files] =
    await Promise.all([
      fetchRepoDetails(api, repo),
      fetchContributors(api, repo),
      fetchCommits(api, repo),
      fetchPullRequests(api, repo),
      fetchLanguages(api, repo),
      fetchRepoFiles(api, repo),
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
