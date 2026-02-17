# Batch 1: Core API Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor `analyzeGitRepository` to use an options object, add AbortController cancellation, granular progress reporting, and verbose logging with rate limit info.

**Architecture:** The core `analyzeGitRepository` function gets a new options-object signature. `GitHubAPI` gains `signal` and `verbose` support. Progress callbacks fire per-request during parallel fetching. All 4 callers (web, extension, CLI, tests) migrate to the new API.

**Tech Stack:** TypeScript, Bun test runner, React (useRef for AbortController)

**Design doc:** `docs/plans/2026-02-16-batch1-core-api-refactor-design.md`

---

### Task 1: Add `AnalyzeOptions` type

**Files:**

- Modify: `packages/core/src/types.ts:169` (append after ProgressUpdate)
- Modify: `packages/core/src/index.ts:1` (add to exports)

**Step 1: Add the type to types.ts**

Append after the `ProgressUpdate` interface (line 169):

```ts
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
```

**Step 2: Export from index.ts**

In `packages/core/src/index.ts`, add `AnalyzeOptions` to the type exports on line 1:

```ts
export type {
  ProgressUpdate,
  Contributor,
  ContributorAnalysis,
  AnalysisResult,
  ActivityHeatmap,
  BucketByWeek,
  LanguageAnalysis,
  PullAnalysis,
  WorkPatterns,
  HealthScoreAnalysis,
  HealthScore,
  AnalyzeOptions,
} from './types';
```

**Step 3: Verify build**

Run: `cd /Users/dt/dev/git-repo-analyzer && bun run --filter @git-repo-analyzer/core build`
Expected: Success, no type errors

**Step 4: Commit**

```
feat(core): Add AnalyzeOptions type
```

---

### Task 2: Refactor `GitHubAPI` — options constructor, signal, verbose logging

**Files:**

- Modify: `packages/core/src/client/github-api.ts`

**Step 1: Refactor constructor to accept options object**

Replace the current constructor (lines 19-25):

```ts
export class GitHubAPI {
  private token: string | undefined;
  private signal: AbortSignal | undefined;
  private verbose: boolean;
  rateLimit: RateLimitInfo | null = null;

  constructor(options?: { token?: string; signal?: AbortSignal; verbose?: boolean }) {
    this.token = options?.token;
    this.signal = options?.signal;
    this.verbose = options?.verbose ?? false;
  }
```

**Step 2: Add verbose logging helper and update `fetch` method**

Replace the `fetch` method (lines 50-67):

```ts
  private log(...args: unknown[]) {
    if (this.verbose) console.log(...args);
  }

  private logRateLimit() {
    if (this.verbose && this.rateLimit) {
      const { remaining, limit, resetAt } = this.rateLimit;
      this.log(`[Rate Limit] ${remaining}/${limit}, resets at ${resetAt.toLocaleTimeString()}`);
    }
  }

  async fetch<T>(path: string): Promise<T> {
    const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
    this.log(`[GitHub API] GET ${url}`);
    const response = await fetch(url, { headers: this.headers(), signal: this.signal });
    this.updateRateLimit(response);
    this.logRateLimit();

    if (!response.ok) {
      if (response.status === 404) {
        throw new GitHubAPIError(404, 'Repository not found');
      }
      if (response.status === 403 && this.rateLimit?.remaining === 0) {
        throw new GitHubAPIError(403, 'GitHub API rate limit exceeded');
      }
      throw new GitHubAPIError(response.status, `GitHub API error: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }
```

**Step 3: Update `fetchPaginated` method**

Replace lines 69-92:

```ts
  async fetchPaginated<T>(path: string, maxPages = 3): Promise<T[]> {
    const items: T[] = [];
    let url: string | null = `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}per_page=100`;
    this.log(`[GitHub API] GET ${url} (paginated, max ${maxPages} pages)`);

    for (let page = 0; page < maxPages && url; page++) {
      if (page > 0) this.log(`[GitHub API] Fetching page ${page + 1}/${maxPages}: ${url}`);
      const response = await fetch(url, { headers: this.headers(), signal: this.signal });
      this.updateRateLimit(response);
      this.logRateLimit();

      if (!response.ok) {
        if (response.status === 409) return items; // empty repo
        throw new GitHubAPIError(response.status, `GitHub API error: ${response.statusText}`);
      }

      const data = (await response.json()) as T[];
      items.push(...data);

      const link = response.headers.get('link');
      url = this.parseNextLink(link);
    }

    return items;
  }
```

**Step 4: Verify build**

Run: `cd /Users/dt/dev/git-repo-analyzer && bun run --filter @git-repo-analyzer/core build`
Expected: Success (no callers changed yet, but the module compiles)

**Step 5: Commit**

```
feat(core): Add signal, verbose, and rate limit logging to GitHubAPI
```

---

### Task 3: Refactor `analyzeGitRepository` signature and `fetchRepositoryData`

**Files:**

- Modify: `packages/core/src/analyze-repo.ts`

**Step 1: Update imports**

Replace the import of types on line 15:

```ts
import type { ProgressUpdate, AnalysisResult, AnalyzeOptions } from './types';
```

**Step 2: Replace `analyzeGitRepository` function signature and body**

Replace lines 52-129 (the entire function):

```ts
export async function analyzeGitRepository(
  repoNameOrUrl: string,
  options?: AnalyzeOptions,
): Promise<AnalysisResult> {
  const { token, signal, verbose, onProgress } = options ?? {};
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
  };

  // Report completion
  onProgress?.({
    phase: 'complete',
    progress: 100,
    message: 'Analysis complete!',
  });

  return result;
}
```

**Step 3: Replace `fetchRepositoryData` signature and add progress tracking**

Replace lines 225-251:

```ts
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
```

**Step 4: Remove dead commented-out code**

Delete lines 131-222 (all the old commented-out simulation code after `return result;`).

**Step 5: Verify build**

Run: `cd /Users/dt/dev/git-repo-analyzer && bun run --filter @git-repo-analyzer/core build`
Expected: Success

**Step 6: Commit**

```
feat(core): Refactor analyzeGitRepository to options object with progress tracking
```

---

### Task 4: Update tests

**Files:**

- Modify: `packages/core/src/analyze-repo.test.ts`

**Step 1: Update all test call sites**

Replace the entire file content:

```ts
import { describe, expect, it } from 'bun:test';

import type { ProgressUpdate } from './types';

import { analyzeGitRepository } from './index';

describe('analyzeGitRepository', () => {
  it('should analyze a repository in owner/repo format', async () => {
    const result = await analyzeGitRepository('facebook/react');

    expect(result.basicStats.fullName).toBe('facebook/react');
    expect(result.basicStats).toBeDefined();
    expect(result.basicStats.stars).toBeGreaterThan(0);
    expect(result.contributors).toBeDefined();
    expect(result.contributors.totalContributors).toBeGreaterThan(0);
    expect(result.contributors.topContributors).toBeInstanceOf(Array);
    expect(result.languages).toBeDefined();
    expect(result.languages.langs).toBeInstanceOf(Array);
  });

  it('should analyze a repository from a full GitHub URL', async () => {
    const result = await analyzeGitRepository('https://github.com/facebook/react');

    expect(result.basicStats.fullName).toBe('facebook/react');
  });

  it('should handle URLs with .git suffix', async () => {
    const result = await analyzeGitRepository('https://github.com/facebook/react.git');

    expect(result.basicStats.fullName).toBe('facebook/react');
  });

  it('should call the progress callback with updates', async () => {
    const progressUpdates: ProgressUpdate[] = [];

    await analyzeGitRepository('facebook/react', {
      onProgress: update => {
        progressUpdates.push(update);
      },
    });

    expect(progressUpdates.length).toBeGreaterThan(0);
    expect(progressUpdates[0].phase).toBe('fetching');
    expect(progressUpdates[progressUpdates.length - 1].phase).toBe('complete');
    expect(progressUpdates[progressUpdates.length - 1].progress).toBe(100);
  });

  it('should accept an optional token', async () => {
    const result = await analyzeGitRepository('facebook/react', { token: 'test-token' });

    expect(result.basicStats.fullName).toBe('facebook/react');
  });

  it('should throw an error for invalid repository format', async () => {
    expect(analyzeGitRepository('invalid-format')).rejects.toThrow('Invalid repository format');
  });

  it('should include timing information in the result', async () => {
    const result = await analyzeGitRepository('facebook/react');

    expect(result.generator.durationMs).toBeGreaterThanOrEqual(0);
    expect(typeof result.generator.analyzedAt).toBe('string');
  });
});
```

Note: These tests still hit the real GitHub API. Mocking is deferred to Batch 3.

**Step 2: Run tests**

Run: `cd /Users/dt/dev/git-repo-analyzer && bun test packages/core/src/analyze-repo.test.ts`
Expected: All tests pass

**Step 3: Commit**

```
test(core): Update tests for new analyzeGitRepository options signature
```

---

### Task 5: Update web app caller (App.tsx)

**Files:**

- Modify: `apps/web/src/App.tsx`

**Step 1: Add useRef import and AbortController**

Replace the entire file:

```tsx
import { analyzeGitRepository } from '@git-repo-analyzer/core';
import { useAnalysisStore } from '@git-repo-analyzer/store';
import {
  AppHomePage,
  AppLoadingPage,
  AppRepoDetailsPage,
  ThemeToggle,
} from '@git-repo-analyzer/ui';
import { useCallback, useRef } from 'react';

function App() {
  const currentRepository = useAnalysisStore(state => state.currentRepository);
  const result = useAnalysisStore(state => state.result);
  const isLoading = useAnalysisStore(state => state.isLoading);
  const progress = useAnalysisStore(state => state.progress);
  const error = useAnalysisStore(state => state.error);
  const history = useAnalysisStore(state => state.history);
  const startAnalysis = useAnalysisStore(state => state.startAnalysis);
  const updateProgress = useAnalysisStore(state => state.updateProgress);
  const completeAnalysis = useAnalysisStore(state => state.completeAnalysis);
  const setError = useAnalysisStore(state => state.setError);
  const clearAnalysis = useAnalysisStore(state => state.clearAnalysis);
  const clearHistory = useAnalysisStore(state => state.clearHistory);
  const removeFromHistory = useAnalysisStore(state => state.removeFromHistory);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleAnalyze = useCallback(
    async (repo: string) => {
      if (!repo.trim()) return;

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      startAnalysis(repo);

      try {
        const analysisResult = await analyzeGitRepository(repo, {
          signal: controller.signal,
          onProgress: updateProgress,
        });
        completeAnalysis(analysisResult);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Analysis failed');
      }
    },
    [startAnalysis, updateProgress, completeAnalysis, setError],
  );

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    clearAnalysis();
  }, [clearAnalysis]);

  const handleBack = useCallback(() => {
    clearAnalysis();
  }, [clearAnalysis]);

  const handleRefresh = useCallback(() => {
    if (result) {
      void handleAnalyze(result.basicStats.fullName);
    }
  }, [result, handleAnalyze]);

  const handleDeleteReport = useCallback(
    (repo: string) => {
      removeFromHistory(repo);
      if (result?.basicStats.fullName === repo) {
        handleBack();
      }
    },
    [result, handleBack, removeFromHistory],
  );

  return (
    <main className="bg-background min-h-screen">
      {isLoading ? (
        <AppLoadingPage
          repo={currentRepository || ''}
          progress={progress?.message || 'Starting analysis...'}
          onCancel={handleCancel}
        />
      ) : result ? (
        <AppRepoDetailsPage report={result} onBack={handleBack} onRefresh={handleRefresh} />
      ) : (
        <AppHomePage
          repo={currentRepository || ''}
          errorMsg={error}
          history={history}
          onAnalyze={handleAnalyze}
          onDeleteReport={handleDeleteReport}
          onDeleteAllReports={clearHistory}
          onCancel={handleCancel}
        />
      )}
      <ThemeToggle />
    </main>
  );
}

export default App;
```

**Step 2: Verify dev server builds**

Run: `cd /Users/dt/dev/git-repo-analyzer && bun run --filter web build`
Expected: Success

**Step 3: Commit**

```
feat(web): Use options API with AbortController for cancellation
```

---

### Task 6: Update extension caller (SidePanel.tsx)

**Files:**

- Modify: `apps/extension/src/sidepanel/SidePanel.tsx`

**Step 1: Add useRef import and AbortController pattern**

Add `useRef` to the React import (line 9):

```ts
import { useCallback, useEffect, useRef } from 'react';
```

Add after `removeFromHistory` selector (line 24):

```ts
const abortControllerRef = useRef<AbortController | null>(null);
```

Replace `handleAnalyze` (lines 26-37):

```ts
const handleAnalyze = useCallback(
  async (repo: string) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      startAnalysis(repo);
      const result = await analyzeGitRepository(repo, {
        signal: controller.signal,
        onProgress: updateProgress,
      });
      completeAnalysis(result);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Analysis failed');
    }
  },
  [startAnalysis, updateProgress, completeAnalysis, setError],
);
```

Replace `handleCancel` (lines 75-77):

```ts
const handleCancel = useCallback(() => {
  abortControllerRef.current?.abort();
  abortControllerRef.current = null;
  clearAnalysis();
}, [clearAnalysis]);
```

**Step 2: Verify extension builds**

Run: `cd /Users/dt/dev/git-repo-analyzer && bun run --filter extension build`
Expected: Success

**Step 3: Commit**

```
feat(extension): Use options API with AbortController for cancellation
```

---

### Task 7: Update CLI caller

**Files:**

- Modify: `apps/cli/src/cli.ts`

**Step 1: Update the analyzeGitRepository call**

Replace lines 105-111:

```ts
const result = await analyzeGitRepository(options.repository, {
  token: options.token,
  verbose: true,
  onProgress: progress => {
    if (!options.json) {
      process.stderr.write('\r' + ' '.repeat(60) + '\r');
      process.stderr.write(`\r${progress.message} (${progress.progress}%)`);
    }
  },
});
```

**Step 2: Verify CLI builds**

Run: `cd /Users/dt/dev/git-repo-analyzer && bun run --filter cli build`
Expected: Success

**Step 3: Commit**

```
feat(cli): Use options API with verbose logging enabled
```

---

### Task 8: Full build and verify

**Step 1: Run full build**

Run: `cd /Users/dt/dev/git-repo-analyzer && bun run build`
Expected: All packages and apps build successfully

**Step 2: Run all tests**

Run: `cd /Users/dt/dev/git-repo-analyzer && bun run test`
Expected: All tests pass

**Step 3: Final commit (if any fixes needed)**

```
chore: Fix any build/test issues from API refactor
```
