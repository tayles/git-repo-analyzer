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
