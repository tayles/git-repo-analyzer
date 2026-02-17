# Batch 1: Core API Refactor Design

## Goal

Refactor `analyzeGitRepository` to use an options object pattern, add AbortController support for cancellation, improve progress reporting with per-request granularity, and add verbose logging with rate limit info.

## New API Signature

```ts
// packages/core/src/types.ts
export interface AnalyzeOptions {
  token?: string;
  signal?: AbortSignal;
  verbose?: boolean;
  onProgress?: (update: ProgressUpdate) => void;
}
```

```ts
// packages/core/src/analyze-repo.ts
export async function analyzeGitRepository(
  repoNameOrUrl: string,
  options?: AnalyzeOptions,
): Promise<AnalysisResult>;
```

This is a breaking change. All callers must update.

## AbortController

- `GitHubAPI` constructor accepts optional `AbortSignal`
- Signal is passed to every native `fetch()` call
- When aborted, `DOMException` with name `'AbortError'` propagates to callers
- Web app and extension create an `AbortController` in `handleAnalyze`, store the ref, and call `controller.abort()` in `handleCancel`

### GitHubAPI Changes

```ts
class GitHubAPI {
  private token: string | undefined;
  private signal: AbortSignal | undefined;
  private verbose: boolean;
  rateLimit: RateLimitInfo | null = null;

  constructor(options?: { token?: string; signal?: AbortSignal; verbose?: boolean }) {
    this.token = options?.token;
    this.signal = options?.signal;
    this.verbose = options?.verbose ?? false;
  }

  async fetch<T>(path: string): Promise<T> {
    // ... pass { headers, signal: this.signal } to fetch()
    // ... conditional logging based on this.verbose
    // ... rate limit logging when verbose
  }
}
```

## Progress Tracking

The fetching phase makes 6 parallel API call groups. Track completions:

```ts
let completed = 0;
const totalSteps = 6;

function trackCompletion<T>(label: string): (result: T) => T {
  return (result) => {
    completed++;
    onProgress?.({
      phase: 'fetching',
      progress: Math.round((completed / totalSteps) * 80),
      message: `Completed ${completed} of ${totalSteps}: ${label}`,
    });
    return result;
  };
}

// Usage in Promise.all:
fetchRepoDetails(api, repo).then(trackCompletion('Repository details')),
fetchContributors(api, repo).then(trackCompletion('Contributors & profiles')),
fetchCommits(api, repo).then(trackCompletion('Commits')),
fetchPullRequests(api, repo).then(trackCompletion('Pull requests')),
fetchLanguages(api, repo).then(trackCompletion('Languages')),
fetchRepoFiles(api, repo).then(trackCompletion('File tree')),
```

Messages will read: `"Completed 3 of 6: Commits"`

## Verbose Logging

- `verbose` flag passed to `GitHubAPI` constructor
- Existing `console.log` calls in `GitHubAPI.fetch()` and `fetchPaginated()` become conditional on `verbose`
- After each API response (when verbose): log rate limit info
  - Format: `[Rate Limit] 57/60, resets at 2:30:00 PM`
- Remove the stray `console.log(result)` on line 120 of analyze-repo.ts (or gate behind verbose)

## Files to Change

| File                                         | Change                                                                                                                                     |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/core/src/types.ts`                 | Add `AnalyzeOptions` interface                                                                                                             |
| `packages/core/src/client/github-api.ts`     | Accept signal + verbose in constructor, pass signal to fetch, conditional logging, rate limit logging                                      |
| `packages/core/src/analyze-repo.ts`          | New signature, destructure options, pass signal/verbose to GitHubAPI, completion tracking in fetchRepositoryData, remove stray console.log |
| `packages/core/src/index.ts`                 | Export `AnalyzeOptions` type                                                                                                               |
| `apps/web/src/App.tsx`                       | Create AbortController, store ref, pass signal + onProgress, abort on cancel                                                               |
| `apps/extension/src/sidepanel/SidePanel.tsx` | Same AbortController pattern as web                                                                                                        |
| `apps/cli/src/cli.ts`                        | Update to new signature with options object                                                                                                |
| `packages/core/src/analyze-repo.test.ts`     | Update all call signatures to use options object                                                                                           |

## Caller Migration Examples

### Web App (App.tsx)

```tsx
const abortControllerRef = useRef<AbortController | null>(null);

const handleAnalyze = useCallback(async (repo: string) => {
  abortControllerRef.current?.abort();
  const controller = new AbortController();
  abortControllerRef.current = controller;

  startAnalysis(repo);
  try {
    const result = await analyzeGitRepository(repo, {
      signal: controller.signal,
      onProgress: updateProgress,
    });
    completeAnalysis(result);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return;
    setError(err instanceof Error ? err.message : 'Analysis failed');
  }
}, [...]);

const handleCancel = useCallback(() => {
  abortControllerRef.current?.abort();
  clearAnalysis();
}, [clearAnalysis]);
```

### CLI (cli.ts)

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
