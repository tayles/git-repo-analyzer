/**
 * This script is used to seed mock data for testing and development purposes.
 * It uses the CLI interface to fetch data from the GitHub API for a specified
 * repository and saves it as a JSON file in the mocks package.
 */

import { $ } from 'bun';

const repo = `facebook/docusaurus`;

await $`bun run apps/cli/src/cli.ts ${repo} --json > packages/mocks/data/${repo.replace('/', '__')}.json`;
