# Git Repo Analyzer

![git-repo-analyzer Logo](https://raw.githubusercontent.com/tayles/git-repo-analyzer/main/docs/git-repo-analyzer-logo.png)

A Chrome Extension, CLI, TypeScript library and online tool for analyzing Git repositories.

- 🌐 **[Online Tool](https://tayles.github.io/git-repo-analyzer)** _(Try it now!)_
- 🧩 **[Chrome Extension](#chrome-extension)**
- 💻 **[CLI Tool](#cli)**
- 🧑‍💻 **[TypeScript Library](#typescript-api)**

## Screenshots

|                                                                                                                                                                   |                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chrome Extension (Light Theme)                                                                                                                                    | Chrome Extension (Dark Theme)                                                                                                                                   |
| ![Report (Light)](https://raw.githubusercontent.com/tayles/git-repo-analyzer/main/docs/screenshots/git-repo-analyzer-chrome-extension-sidepanel-report-light.png) | ![Report (Dark)](https://raw.githubusercontent.com/tayles/git-repo-analyzer/main/docs/screenshots/git-repo-analyzer-chrome-extension-sidepanel-report-dark.png) |
| Web App                                                                                                                                                           | CLI Output                                                                                                                                                      |
| ![Web App](https://raw.githubusercontent.com/tayles/git-repo-analyzer/main/docs/screenshots/git-repo-analyzer-web-screenshot.png)                                 | ![Home (Light)](https://raw.githubusercontent.com/tayles/git-repo-analyzer/main/docs/screenshots/git-repo-analyzer-cli-screenshot.png)                          |

## Online Tool

Try it now at **[tayles.github.io/git-repo-analyzer](https://tayles.github.io/git-repo-analyzer)**

## Chrome Extension

View details for any GitHub repo in a side panel.

Get it now on the **[Chrome Web Store](https://chromewebstore.google.com/detail/git-repo-analyzer/lohfeibjkcdoadkbdooliabaafagbfek)**

## CLI

Find it on npm at **[git-repo-analyzer](https://www.npmjs.com/package/git-repo-analyzer)**

Install with:

```shell
npm install -g git-repo-analyzer
```

Run with:

```shell
git-repo-analyzer 'facebook/docusaurus'
```

Export in structured JSON format:

```shell
git-repo-analyzer 'facebook/docusaurus' --json
```

_See example JSON output here: [`facebook__docusaurus.report.json`](packages/mocks/data/facebook__docusaurus.report.json)._

## TypeScript API

The `git-repo-analyzer` package exports:

```typescript
export async analyzeGitRepository(
  repoNameOrUrl,        // "owner/repo" or full GitHub URL
  {
    token?: string;     // Optional GitHub token for higher rate limits
    verbose?: boolean;  // Verbose console logging (default false)
    onProgress?: (update: ProgressUpdate) => void; // Callback for progress updates during analysis
  }
): Promise<AnalysisResult>;
```

Example usage:

```typescript
import { analyzeGitRepository } from 'git-repo-analyzer';

const report = await analyzeGitRepository('facebook/docusaurus');
```

## Project Structure

```shell
git-repo-analyzer/
├── apps/
│   ├── web/               # Web app (Vite + React + Tailwind)
│   ├── extension/         # Chrome Extension (Vite + CRXJS)
│   ├── cli/               # CLI + TypeScript library (bunup)
│   └── ladle/             # Component stories (ladle)
├── packages/
│   ├── ui/                # Shared React components (shadcn/ui style)
│   ├── core/              # analyzeGitRepository function
│   ├── store/             # State management + persistance (zustand)
│   ├── mocks/             # Mock data & test utilities
│   └── typescript-config/ # Shared tsconfig files
├── .oxfmtrc.json          # oxfmt configuration
├── .oxlintrc.json         # oxlint configuration
├── package.json           # root package.json
└── turbo.json             # turborepo configuration
```

## Key Features

- **Turborepo** for monorepo orchestration with task caching
- **Bun** as package manager and test runner
- **Tailwind CSS v4** with `@tailwindcss/vite` plugin (CSS-first config)
- **shadcn/ui** base components
- **Zustand** with persist middleware for state management
- **CRXJS** for Chrome extension with hot reload support
- **Bunup** for building the CLI/library package
- **Ladle** for component documentation/stories
- **oxfmt + oxlint** for formatting and linting

## Notes

- **Runs locally** - All analysis is performed client-side in the browser or via the CLI. No repository data is sent to external servers. The tool fetches data directly from the GitHub API.
- **GitHub only** — Only public GitHub repositories are supported out of the box. Private repos require a [Personal Access Token](https://github.com/settings/tokens). GitLab, Bitbucket and other hosts are not supported.
- **API rate limits** — GitHub rate limits are 60/hr unauthenticated, 5k/hr with token
- **Sampled data** — To keep requests fast, the tool fetches a limited window of data: up to 300 commits, 100 pull requests and 100 contributors. Metrics are therefore representative rather than exhaustive for very large repositories.
- **Health score is heuristic** — The overall score (out of 100) is computed from five weighted categories (Maintenance, Documentation, Community, Code Quality, Security) using simple heuristics. It is a useful indicator, not a definitive quality measure.
- **No code analysis** — The tool inspects metadata, file names and config files via the GitHub API. It does not clone the repository or perform static analysis on source code.

## Contributing

- `bun install` - Install dependencies
- `bun dev` - Start all dev servers
- `bun run build` - Build all packages
- `bun run test` - Run tests with bun test
- `bun fix` - Format, lint and type check all files (and autofix where possible)
- `bun lint:fix` - Lint with oxlint
- `bun fmt:fix` - Format with oxfmt

## Resources

- [Turborepo](https://turborepo.dev)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)
- [CRXJS Vite Plugin](https://crxjs.dev)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter)
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter)
- [Bunup](https://bunup.dev)
- [Ladle](https://ladle.dev)
- [shadcn/ui Monorepo](https://ui.shadcn.com/docs/monorepo)
