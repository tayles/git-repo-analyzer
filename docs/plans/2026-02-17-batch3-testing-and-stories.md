# Batch 3: Testing & Stories Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Mock out fetch calls in core unit tests so they don't hit real GitHub API, and add Ladle stories for all remaining UI components.

**Architecture:** Use Bun's built-in `mock` module to mock global `fetch` in tests. Use existing `github-api-raw.json` mock data (which already has the exact `GitHubRawData` shape). For stories, follow existing Ladle patterns with `createMockAnalysisResult()`.

**Tech Stack:** Bun test runner, `bun:test` mock module, Ladle, React

---

### Task 1: Mock global fetch in analyze-repo.test.ts

**Files:**

- Create: `packages/core/src/test-utils.ts`
- Modify: `packages/core/src/analyze-repo.test.ts`

**Step 1: Create test-utils with a fetch mock helper**

Create `packages/core/src/test-utils.ts`:

```ts
import { mock } from 'bun:test';

import type { GitHubRawData } from './client/github-types';

import MockRawData from '../../mocks/src/github-api-raw.json';

const rawData = MockRawData as unknown as GitHubRawData;

/**
 * Creates a mock fetch function that returns pre-recorded GitHub API responses
 * based on the URL path. Call this in beforeAll/beforeEach.
 */
export function mockGitHubFetch() {
  const mockFetch = mock((url: string | URL | Request, init?: RequestInit) => {
    const urlStr = typeof url === 'string' ? url : url instanceof URL ? url.toString() : url.url;

    const rateLimitHeaders = {
      'x-ratelimit-remaining': '59',
      'x-ratelimit-limit': '60',
      'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 3600),
    };

    function jsonResponse(data: unknown, status = 200) {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'content-type': 'application/json', ...rateLimitHeaders },
      });
    }

    // Match API paths
    if (urlStr.includes('/repos/') && urlStr.includes('/contributors')) {
      return Promise.resolve(jsonResponse(rawData.contributors));
    }
    if (urlStr.includes('/repos/') && urlStr.includes('/commits')) {
      return Promise.resolve(jsonResponse(rawData.commits));
    }
    if (urlStr.includes('/repos/') && urlStr.includes('/pulls')) {
      return Promise.resolve(jsonResponse(rawData.pullRequests));
    }
    if (urlStr.includes('/repos/') && urlStr.includes('/languages')) {
      return Promise.resolve(jsonResponse(rawData.languages));
    }
    if (urlStr.includes('/repos/') && urlStr.includes('/git/trees')) {
      return Promise.resolve(jsonResponse(rawData.files));
    }
    if (urlStr.includes('/users/')) {
      // Return first user profile for any user request
      const login = urlStr.split('/users/')[1]?.split('?')[0];
      const profile = rawData.userProfiles.find(p => p.login === login) ?? rawData.userProfiles[0];
      return Promise.resolve(jsonResponse(profile));
    }
    if (urlStr.includes('/repos/') && !urlStr.includes('/')) {
      // Fallback: repo details (catch-all for /repos/owner/repo)
      return Promise.resolve(jsonResponse(rawData.repoDetails));
    }
    // Default: repo details for /repos/owner/repo
    if (urlStr.match(/\/repos\/[^/]+\/[^/]+$/)) {
      return Promise.resolve(jsonResponse(rawData.repoDetails));
    }

    // Unknown endpoint
    return Promise.resolve(jsonResponse({ message: 'Not Found' }, 404));
  });

  globalThis.fetch = mockFetch as unknown as typeof fetch;
  return mockFetch;
}
```

**Step 2: Rewrite analyze-repo.test.ts to use mocked fetch**

Replace the entire test file:

```ts
import { afterAll, beforeAll, describe, expect, it } from 'bun:test';

import type { ProgressUpdate } from './types';

import { analyzeGitRepository } from './index';
import { mockGitHubFetch } from './test-utils';

const originalFetch = globalThis.fetch;

describe('analyzeGitRepository', () => {
  beforeAll(() => {
    mockGitHubFetch();
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

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

  it('should include health score in the result', async () => {
    const result = await analyzeGitRepository('facebook/react');
    expect(result.healthScore).toBeDefined();
    expect(result.healthScore.overall).toBeGreaterThanOrEqual(0);
    expect(result.healthScore.overall).toBeLessThanOrEqual(100);
  });

  it('should include tooling detection in the result', async () => {
    const result = await analyzeGitRepository('facebook/react');
    expect(result.tooling).toBeDefined();
    expect(result.tooling.tools).toBeInstanceOf(Array);
  });
});
```

**Step 3: Run tests**

Run: `bun test --filter packages/core`

All tests should pass without network calls.

**Step 4: Verify build**

Run: `bun run build`

**Step 5: Commit**

```
feat(core): Mock GitHub API in unit tests using pre-recorded responses
```

---

### Task 2: Add stories for StatCard

**Files:**

- Create: `apps/ladle/src/StatCard.stories.tsx`

**Step 1: Create StatCard stories**

```tsx
import type { Story } from '@ladle/react';

import { Calendar, Code, Eye, HardDrive, Scale, Split, Star } from 'lucide-react';

import { StatCard } from '@git-repo-analyzer/ui/components/StatCard';

export default {
  title: 'Components',
};

export const StatCards: Story = () => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 p-4">
    <StatCard label="Stars" value={231456} icon={<Star className="size-4" />} href="https://github.com" />
    <StatCard label="Forks" value={48200} icon={<Split className="size-4" />} href="https://github.com" />
    <StatCard label="Watchers" value={6700} icon={<Eye className="size-4" />} />
    <StatCard label="Language" value="TypeScript" icon={<Code className="size-4" />} />
    <StatCard label="License" value="MIT" icon={<Scale className="size-4" />} />
    <StatCard label="Size" value={245000} icon={<HardDrive className="size-4" />} />
    <StatCard label="Created" value="2013-05-24" icon={<Calendar className="size-4" />} />
    <StatCard label="No Value" value={null} />
  </div>
);
```

**Step 2: Verify ladle builds**

Run: `bun run --filter ladle build`

**Step 3: Commit**

```
feat(ladle): Add StatCard stories
```

---

### Task 3: Add stories for ErrorAlert, LoadingLayout, ThemeToggle, RepoName

**Files:**

- Create: `apps/ladle/src/ErrorAlert.stories.tsx`
- Create: `apps/ladle/src/LoadingLayout.stories.tsx`
- Create: `apps/ladle/src/ThemeToggle.stories.tsx`
- Create: `apps/ladle/src/RepoName.stories.tsx`

**Step 1: Create ErrorAlert stories**

```tsx
import type { Story } from '@ladle/react';

import { ErrorAlert } from '@git-repo-analyzer/ui/components/ErrorAlert';

export default { title: 'Components' };

export const ErrorAlerts: Story = () => (
  <div className="flex flex-col gap-4 p-4">
    <ErrorAlert message="Repository not found. Please check the name and try again." />
    <ErrorAlert message="GitHub API rate limit exceeded. Try again later." />
  </div>
);
```

**Step 2: Create LoadingLayout stories**

```tsx
import type { Story } from '@ladle/react';

import { LoadingLayout } from '@git-repo-analyzer/ui/components/LoadingLayout';

export default { title: 'Components' };

export const LoadingLayouts: Story = () => (
  <LoadingLayout repo="facebook/react" progress="Completed 3 of 6: Commits" onCancel={() => {}} />
);
```

**Step 3: Create ThemeToggle stories**

```tsx
import type { Story } from '@ladle/react';

import { ThemeToggle } from '@git-repo-analyzer/ui';

export default { title: 'Components' };

export const ThemeToggles: Story = () => (
  <div className="p-4">
    <ThemeToggle />
  </div>
);
```

**Step 4: Create RepoName stories**

```tsx
import type { Story } from '@ladle/react';

import { RepoName } from '@git-repo-analyzer/ui/components/RepoName';

export default { title: 'Components' };

export const RepoNames: Story = () => (
  <div className="flex flex-col gap-4 p-4 text-lg">
    <RepoName fullName="facebook/react" uid={69631} />
    <RepoName fullName="vercel/next.js" uid={14985020} />
    <RepoName fullName="microsoft/typescript" uid={6154722} />
  </div>
);
```

**Step 5: Verify ladle builds**

Run: `bun run --filter ladle build`

**Step 6: Commit**

```
feat(ladle): Add stories for ErrorAlert, LoadingLayout, ThemeToggle, RepoName
```

---

### Task 4: Add stories for chart and data components

**Files:**

- Create: `apps/ladle/src/ActivityHeatmapChart.stories.tsx`
- Create: `apps/ladle/src/CommitChart.stories.tsx`
- Create: `apps/ladle/src/ContributorsSection.stories.tsx`
- Create: `apps/ladle/src/HealthScoreCard.stories.tsx`
- Create: `apps/ladle/src/LanguageChart.stories.tsx`
- Create: `apps/ladle/src/PullRequestChart.stories.tsx`
- Create: `apps/ladle/src/WorkPatternsCard.stories.tsx`

All these stories follow the same pattern: use `createMockAnalysisResult()` and pass the relevant data slice.

**Step 1: Create all chart/data stories**

Each file follows this pattern:

```tsx
// ActivityHeatmapChart.stories.tsx
import type { Story } from '@ladle/react';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { ActivityHeatmapChart } from '@git-repo-analyzer/ui/components/ActivityHeatmapChart';

export default { title: 'Components' };

const report = createMockAnalysisResult('facebook/react');

export const ActivityHeatmap: Story = () => (
  <div className="max-w-2xl p-4">
    <ActivityHeatmapChart data={report.commits.activityHeatmap} />
  </div>
);
```

```tsx
// CommitChart.stories.tsx
import type { Story } from '@ladle/react';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { CommitChart } from '@git-repo-analyzer/ui/components/CommitChart';

export default { title: 'Components' };

const report = createMockAnalysisResult('facebook/react');

export const CommitCharts: Story = () => (
  <div className="max-w-2xl p-4">
    <CommitChart data={report.commits.byWeek} />
  </div>
);
```

```tsx
// ContributorsSection.stories.tsx
import type { Story } from '@ladle/react';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { ContributorsSection } from '@git-repo-analyzer/ui/components/ContributorsSection';

export default { title: 'Components' };

const report = createMockAnalysisResult('facebook/react');

export const Contributors: Story = () => (
  <div className="max-w-2xl p-4">
    <ContributorsSection data={report.contributors} />
  </div>
);
```

```tsx
// HealthScoreCard.stories.tsx
import type { Story } from '@ladle/react';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { HealthScoreCard } from '@git-repo-analyzer/ui/components/HealthScoreCard';

export default { title: 'Components' };

const report = createMockAnalysisResult('facebook/react');

export const HealthScoreCards: Story = () => (
  <div className="max-w-2xl p-4">
    <HealthScoreCard health={report.healthScore} />
  </div>
);
```

```tsx
// LanguageChart.stories.tsx
import type { Story } from '@ladle/react';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { LanguageChart } from '@git-repo-analyzer/ui/components/LanguageChart';

export default { title: 'Components' };

const report = createMockAnalysisResult('facebook/react');

export const LanguageCharts: Story = () => (
  <div className="max-w-2xl p-4">
    <LanguageChart data={report.languages} />
  </div>
);
```

```tsx
// PullRequestChart.stories.tsx
import type { Story } from '@ladle/react';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { PullRequestChart } from '@git-repo-analyzer/ui/components/PullRequestChart';

export default { title: 'Components' };

const report = createMockAnalysisResult('facebook/react');

export const PullRequestCharts: Story = () => (
  <div className="max-w-2xl p-4">
    <PullRequestChart data={report.pullRequests} />
  </div>
);
```

```tsx
// WorkPatternsCard.stories.tsx
import type { Story } from '@ladle/react';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { WorkPatternsCard } from '@git-repo-analyzer/ui/components/WorkPatternsCard';

export default { title: 'Components' };

const report = createMockAnalysisResult('facebook/react');

export const WorkPatterns: Story = () => (
  <div className="max-w-2xl p-4">
    <WorkPatternsCard data={report.commits.workPatterns} />
  </div>
);
```

**Step 2: Verify ladle builds**

Run: `bun run --filter ladle build`

**Step 3: Commit**

```
feat(ladle): Add stories for chart and data visualization components
```

---

### Task 5: Full build and test verification

**Step 1: Run all tests**

Run: `bun run test`

**Step 2: Run full build**

Run: `bun run build`

**Step 3: Commit if any fixes needed**
