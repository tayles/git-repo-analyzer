# Batch 2: UI Enhancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add loading spinner, clickable StatCards, health score on AnalysisReportCard, cache-first loading from history, and motion/react animations.

**Architecture:** UI-layer changes in `packages/ui` + one store change in `packages/store` + `motion` package install. All changes are additive — no core logic changes.

**Tech Stack:** React, Tailwind CSS, motion/react, Zustand

---

### Task 1: Install `motion` package

**Files:**

- Modify: `packages/ui/package.json`

**Step 1: Install motion in the ui package**

Run: `cd /Users/dt/dev/git-repo-analyzer && bun add motion --filter @git-repo-analyzer/ui`

**Step 2: Verify build**

Run: `bun run --filter @git-repo-analyzer/ui build`

**Step 3: Commit**

```
feat(ui): Install motion package for animations
```

---

### Task 2: Add loading spinner to LoadingLayout

**Files:**

- Modify: `packages/ui/src/components/LoadingLayout.tsx`

**Step 1: Add a Tailwind CSS spinner**

Replace the entire LoadingLayout component with:

```tsx
import { Loader2 } from 'lucide-react';

import { Button } from './ui/button';

interface LoadingLayoutProps {
  repo: string;
  progress: string;
  onCancel: () => void;
}

export function LoadingLayout({ repo, progress, onCancel }: LoadingLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4 text-center">
      <Loader2 className="text-muted-foreground size-10 animate-spin" />
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">Analyzing {repo}...</h1>
        <p className="text-muted-foreground text-sm">{progress}</p>
      </div>
      <Button variant="outline" onClick={onCancel}>
        Cancel Analysis
      </Button>
    </div>
  );
}
```

Uses the `Loader2` icon from lucide-react (already installed) with Tailwind's `animate-spin`.

**Step 2: Verify build**

Run: `bun run --filter @git-repo-analyzer/ui build`

**Step 3: Commit**

```
feat(ui): Add loading spinner to LoadingLayout
```

---

### Task 3: Make StatCard clickable with href

**Files:**

- Modify: `packages/ui/src/components/StatCard.tsx`
- Modify: `packages/ui/src/components/RepoDetailsLayout.tsx`

**Step 1: Add optional href prop to StatCard**

Replace StatCard with:

```tsx
import { formatNumber } from '@git-repo-analyzer/core';

import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';

interface StatCardProps {
  label: string;
  value: string | number | null;
  icon?: React.ReactNode;
  href?: string;
}

export function StatCard({ label, value, icon, href }: StatCardProps) {
  let formattedValue: string | number | null = value;
  if (typeof value === 'number') {
    formattedValue = formatNumber(value);
  }

  const card = (
    <Card className={`gap-0 p-2 lg:p-4 ${href ? 'hover:bg-accent transition-colors' : ''}`}>
      <CardHeader className="p-0">
        <CardTitle className="text-muted-foreground text-xs font-normal">{label}</CardTitle>
        <CardAction className="text-muted-foreground">{icon}</CardAction>
      </CardHeader>
      <CardContent className="p-0 text-lg font-bold lg:text-xl">{formattedValue}</CardContent>
    </Card>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="no-underline">
        {card}
      </a>
    );
  }

  return card;
}
```

**Step 2: Pass href to each StatCard in RepoDetailsLayout**

Update each StatCard in the stats grid. Define `const baseUrl = report.basicStats.htmlUrl;` before the JSX, then pass href props:

- Stars: `href={`${baseUrl}/stargazers`}`
- Forks: `href={`${baseUrl}/forks`}`
- Open Issues: `href={`${baseUrl}/issues`}`
- Watchers: `href={`${baseUrl}/watchers`}`
- Language: `href={baseUrl}`
- License: `href={`${baseUrl}/blob/${report.basicStats.defaultBranch}/LICENSE`}`
- Size: `href={baseUrl}`
- Created: `href={baseUrl}`
- Updated: `href={baseUrl}`
- Pushed: `href={baseUrl}`

**Step 3: Verify build**

Run: `bun run --filter @git-repo-analyzer/ui build`

**Step 4: Commit**

```
feat(ui): Make StatCard clickable with links to GitHub
```

---

### Task 4: Show health score on AnalysisReportCard

**Files:**

- Modify: `packages/ui/src/components/AnalysisReportCard.tsx`

**Step 1: Add health score badge**

Add a health score percentage badge to the card header. The badge shows the overall health percentage with color coding (green >= 70%, yellow >= 40%, red < 40%).

Update the component to include a small health badge after the repo name in CardTitle:

```tsx
import type { AnalysisResult } from '@git-repo-analyzer/core';

import { X } from 'lucide-react';

import { RepoName } from './RepoName';
import { ToolLogo } from './ToolLogo';
import { Button } from './ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';

function healthScoreColor(score: number): string {
  if (score >= 70) return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
  if (score >= 40) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
  return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
}

interface AnalysisReportCardProps {
  report: AnalysisResult;
  onClick: () => void;
  onDelete: (repo: string) => void;
}

export function AnalysisReportCard({ report, onClick, onDelete }: AnalysisReportCardProps) {
  const healthPercent = Math.round((report.healthScore.overall / 100) * 100);

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer gap-0 p-2 hover:bg-gray-50 lg:p-4 dark:hover:bg-gray-800"
    >
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2">
          <RepoName fullName={report.basicStats.fullName} uid={report.basicStats.owner.id} />
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${healthScoreColor(report.healthScore.overall)}`}
          >
            {healthPercent}%
          </span>
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:bg-red-100 hover:text-red-600"
            title="Clear report"
            onClick={e => {
              e.stopPropagation();
              onDelete(report.basicStats.fullName);
            }}
          >
            <X />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex flex-wrap gap-2">
          {report.tooling.tools
            .filter(tool => tool.category !== 'Documentation')
            .map(tool => (
              <div key={tool.name} className="flex items-center gap-2 text-xs">
                <ToolLogo logo={tool.logo} className="size-4" />
                {tool.name}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 2: Verify build**

Run: `bun run --filter @git-repo-analyzer/ui build`

**Step 3: Commit**

```
feat(ui): Show health score badge on AnalysisReportCard
```

---

### Task 5: Cache-first loading — modify startAnalysis

**Files:**

- Modify: `packages/store/src/analysis-store.ts`
- Modify: `packages/ui/src/components/HomeLayout.tsx`
- Modify: `apps/web/src/App.tsx`
- Modify: `apps/extension/src/sidepanel/SidePanel.tsx`

**Step 1: Add useCache parameter to startAnalysis**

In `packages/store/src/analysis-store.ts`, change the `startAnalysis` action signature and add cache-first logic:

Change the interface (line 29):

```ts
startAnalysis: (repository: string, useCache?: boolean) => boolean;
```

Returns `true` if cache was used (caller should skip fetching), `false` if not.

Replace the implementation (lines 66-74):

```ts
      startAnalysis: (repository: string, useCache = true) => {
        if (useCache) {
          const { history } = get();
          const cached = history.find(
            item => item.basicStats.fullName === repository,
          );
          if (cached) {
            // Move to front of history and set as current result
            const filteredHistory = history.filter(
              item => item.basicStats.fullName !== repository,
            );
            set({
              currentRepository: repository,
              result: cached,
              isLoading: false,
              progress: null,
              error: null,
              history: [cached, ...filteredHistory].slice(0, 10),
            });
            return true;
          }
        }
        set({
          currentRepository: repository,
          result: null,
          isLoading: true,
          progress: null,
          error: null,
        });
        return false;
      },
```

**Step 2: Update App.tsx handleAnalyze**

In `apps/web/src/App.tsx`, update handleAnalyze to check cache return value:

```ts
const handleAnalyze = useCallback(
  async (repo: string) => {
    if (!repo.trim()) return;

    abortControllerRef.current?.abort();

    const usedCache = startAnalysis(repo);
    if (usedCache) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

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
```

And update handleRefresh to bypass cache:

```ts
const handleRefresh = useCallback(() => {
  if (result) {
    startAnalysis(result.basicStats.fullName, false);
    // Re-trigger analysis without cache
    void handleAnalyzeNoCache(result.basicStats.fullName);
  }
}, [result, handleAnalyzeNoCache, startAnalysis]);
```

Actually, simpler approach: just make handleRefresh call handleAnalyze but with `startAnalysis(repo, false)`. Since handleAnalyze already calls startAnalysis, we need a different pattern.

Better: Add a separate small helper or just inline. The cleanest approach:

In App.tsx, change handleAnalyze to accept an optional `useCache` param:

```ts
const handleAnalyze = useCallback(
  async (repo: string, useCache = true) => {
    if (!repo.trim()) return;

    abortControllerRef.current?.abort();

    const usedCache = startAnalysis(repo, useCache);
    if (usedCache) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

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
```

And handleRefresh:

```ts
const handleRefresh = useCallback(() => {
  if (result) {
    void handleAnalyze(result.basicStats.fullName, false);
  }
}, [result, handleAnalyze]);
```

**Step 3: Update SidePanel.tsx similarly**

Same pattern — add `useCache` param to handleAnalyze, handleRefresh passes `false`.

**Step 4: Update HomeLayout**

No change needed! HomeLayout already passes `onClick={() => onAnalyze(result.basicStats.fullName)}` and `onAnalyze` maps to `handleAnalyze` which now defaults `useCache=true`. The cache check happens automatically.

**Step 5: Update store test**

In `packages/store/src/analysis-store.test.ts`, update any tests that call `startAnalysis` to account for the new return value.

**Step 6: Verify build**

Run: `bun run build`

**Step 7: Commit**

```
feat: Cache-first loading when selecting previous reports
```

---

### Task 6: Add motion/react animations

**Files:**

- Modify: `apps/web/src/App.tsx` — page transitions with AnimatePresence
- Modify: `packages/ui/src/components/RepoDetailsLayout.tsx` — stagger-in for stat cards and tool cards
- Modify: `packages/ui/src/components/HomeLayout.tsx` — fade-in for report cards
- Modify: `packages/ui/src/components/LoadingLayout.tsx` — fade-in for loading state

**Step 1: Add page transitions in App.tsx**

Wrap the conditional rendering in `AnimatePresence` with `motion.div` wrappers for each page state:

```tsx
import { AnimatePresence, motion } from 'motion/react';

// In the return JSX, wrap the ternary with AnimatePresence:
<AnimatePresence mode="wait">
  {isLoading ? (
    <motion.div
      key="loading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <AppLoadingPage ... />
    </motion.div>
  ) : result ? (
    <motion.div
      key="details"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <AppRepoDetailsPage ... />
    </motion.div>
  ) : (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <AppHomePage ... />
    </motion.div>
  )}
</AnimatePresence>
```

**Step 2: Add stagger-in for cards in RepoDetailsLayout**

Wrap each StatCard and ToolCard in `motion.div` with staggered delays:

```tsx
import { motion } from 'motion/react';

// In the stats grid, wrap each StatCard:
{[
  { label: "Stars", value: report.basicStats.stars, icon: <Star .../>, href: `${baseUrl}/stargazers` },
  // ... rest of stat configs
].map((stat, i) => (
  <motion.div
    key={stat.label}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay: i * 0.03 }}
  >
    <StatCard {...stat} />
  </motion.div>
))}
```

Same pattern for ToolCards with stagger.

**Step 3: Add fade-in for AnalysisReportCards in HomeLayout**

Wrap each card in the history grid:

```tsx
import { motion } from 'motion/react';

// In the history grid:
{history.map((result, index) => (
  <motion.div
    key={result.basicStats.fullName}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay: index * 0.05 }}
  >
    <AnalysisReportCard ... />
  </motion.div>
))}
```

**Step 4: Verify build**

Run: `bun run build`

**Step 5: Commit**

```
feat(ui): Add page transitions and stagger animations with motion/react
```

---

### Task 7: Full build and verify

**Step 1: Run full build**

Run: `bun run build`

**Step 2: Verify dev server works**

Run: `bun run --filter web dev` and check in browser

**Step 3: Commit if any fixes needed**
