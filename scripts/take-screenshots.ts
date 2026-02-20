/**
 * This script is used to take screenshots of the CLI and website in action, for use in the README.
 */

import { $ } from 'bun';

const repo = 'facebook/docusaurus';

const cliScreenshotPath = 'docs/screenshots/git-repo-analyzer-cli-screenshot.png';

// Use https://github.com/homeport/termshot to take screenshots of the CLI in action
await $`termshot --filename ${cliScreenshotPath} -- bun run apps/cli/src/cli.ts ${repo}`;

// Use playwright to take screenshots of the website in action
// TODO
