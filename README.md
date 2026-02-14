# Git Repo Analyzer

A Chrome Extension, CLI, TypeScript library and online tool for analyzing Git repositories.

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
- **shadcn/ui** components (Button, Card, Input) in the ui package
- **Zustand v5** with persist middleware for state management
- **CRXJS** for Chrome extension with hot reload support
- **Bunup** for building the CLI/library package
- **Ladle** for component documentation/stories
- **oxfmt + oxlint** for formatting and linting

## CLI

Install with:

```shell
npm install -g git-repo-analyzer
```

Run with:

```shell
git-repo-analyzer 'facebook/react'
```

Export in structured JSON format:

```shell
git-repo-analyzer 'facebook/react' --json
```

## TypeScript API

The `git-repo-analyzer` package exports:

```typescript
export async function analyzeGitRepository(
  repo: string, // "owner/repo" or full GitHub URL
  token?: string, // Optional GitHub token
  callback?: (result: ProgressUpdate) => void,
): Promise<AnalysisResult>;
```

Example usage:

```typescript
import { analyzeGitRepository } from 'git-repo-analyzer';

const report = await analyzeGitRepository('facebook/react');
```

## Contributing

- `bun install` - Install dependencies
- `bun run dev` - Start all dev servers
- `bun run build` - Build all packages
- `bun run test` - Run tests with bun test
- `bun run typecheck` - Type check all packages
- `bun run lint` - Lint with oxlint
- `bun run format` - Format with oxfmt

## Resources

- [Turborepo docs](https://turborepo.dev/docs/crafting-your-repository/structuring-a-repository)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)
- [CRXJS Vite Plugin](https://github.com/crxjs/chrome-extension-tools)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter)
- [Bunup](https://bunup.dev/)
- [Ladle](https://ladle.dev/)
- [shadcn/ui Monorepo](https://ui.shadcn.com/docs/monorepo)
