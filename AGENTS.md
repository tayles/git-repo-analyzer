# AGENTS.md

`git-repo-analyzer` is a monorepo for a Chrome Extension, CLI, TypeScript library and online tool for viewing the tech stack, health and other insights of any GitHub repository.

## Commands

```sh
bun install          # Install dependencies
bun dev              # Start all dev servers (via turbo)
bun run build        # Build all packages (via turbo)
bun run test         # Run all tests (via turbo, uses bun test)
bun fix              # Format, lint and type check all files (and autofix where possible)
```

Run tests for a single package:

```sh
bun test packages/core/src/analyzers/commits.test.ts
```

## Architecture

This is a **Turborepo monorepo** using **bun** as the package manager and test runner.

### Apps

| App              | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `apps/web`       | Vite + React SPA, deployed to GitHub Pages               |
| `apps/extension` | Chrome Extension via CRXJS + Vite                        |
| `apps/cli`       | Published npm CLI + TypeScript library, built with bunup |
| `apps/ladle`     | Component stories using Ladle                            |

### Packages

| Package                      | Description                                                             |
| ---------------------------- | ----------------------------------------------------------------------- |
| `packages/core`              | Core analysis engine — fetches GitHub API data and runs all analyzers   |
| `packages/store`             | Zustand store with persist middleware, shared between web and extension |
| `packages/ui`                | Shared React components (shadcn/ui style) and page layouts              |
| `packages/mocks`             | Mock data and test utilities                                            |
| `packages/typescript-config` | Shared `tsconfig` base files                                            |

### Data Flow

1. **`packages/core`** — `analyzeGitRepository(repo, options)` is the main entry point. It calls `GitHubAPI` to fetch raw data in parallel (repo details, contributors, commits, PRs, languages, file tree), then passes results through individual analyzers (`processBasicStats`, `processCommits`, etc).

2. **`packages/store`** — Zustand store (`useAnalysisStore`) manages analysis state (loading, progress, result, error, history with caching) and persists history to localStorage.

3. **`packages/ui`** — Exports page-level components (`AppHomePage`, `AppLoadingPage`, `AppRepoDetailsPage`) and chart/visualization components. The `app/` subdir has full-page layouts; `sidepanel/` has Chrome extension layouts; `ui/` has primitive shadcn-style components.

4. **`apps/web`** and **`apps/extension`** each wire up the store and UI package. The web app (`App.tsx`) handles URL sync via `useUrlSync`.

### Key Conventions

- All packages export from `src/index.ts` directly (no build step for internal workspace dependencies — only the CLI package builds to `dist/`).
- Tailwind CSS v4 is configured CSS-first (no `tailwind.config.js`), using `@tailwindcss/vite`.
- Formatting: **oxfmt**; Linting: **oxlint** with `--type-aware`.
- Tests live alongside source files (`.test.ts` / `.test.tsx`).
- The `turbo.json` tasks: `build` depends on upstream builds; `dev` requires upstream builds first.
- Always use `bun` instead of `npm` or `pnpm`, and `bunx` instead of `npx`.
- Always use `bun fix` to autofix formatting + lint issues at the end of a task.
- Use `bun fix` to run type checking instead of `tsx --noEmit` or `bun typecheck`.
- All UI components require stories in `apps/ladle/[ComponentName].stories.tsx`. Combine into a single `[ComponentName]s` story where applicable
- Never run the dev servers with `bun dev` - assume it is running elsewhere
