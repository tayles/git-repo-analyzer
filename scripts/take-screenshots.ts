import { $ } from 'bun';

const repo = 'facebook/docusaurus';

// Use https://github.com/homeport/termshot to take screenshots of the CLI in action
await $`termshot -- bun run apps/cli/src/cli.ts ${repo}`;

// Use playwright to take screenshots of the website in action

// TODO
