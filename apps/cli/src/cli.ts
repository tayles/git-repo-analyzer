#!/usr/bin/env bun

/**
 * Git Repo Analyzer CLI
 *
 * Command-line interface for analyzing GitHub repositories.
 *
 * Usage:
 *   git-repo-analyzer <repository> [options]
 *
 * Examples:
 *   git-repo-analyzer facebook/docusaurus
 *   git-repo-analyzer https://github.com/facebook/docusaurus --json
 *   git-repo-analyzer facebook/docusaurus --token $GITHUB_TOKEN
 */

import { analyzeGitRepository } from '@git-repo-analyzer/core';
import pc from 'picocolors';

import { formatResultJson } from './cli-formatter';
import { HELP_TEXT, VERSION, parseArgs } from './cli-options';
import { printReport } from './cli-reporter';

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  if (options.version) {
    console.log(VERSION);
    process.exit(0);
  }

  if (!options.repository) {
    console.error('Error: Repository argument is required');
    console.error('');
    console.error('Usage: git-repo-analyzer <repository> [options]');
    console.error('Run "git-repo-analyzer --help" for more information');
    process.exit(1);
  }

  try {
    console.error(`Analyzing ${options.repository}...`);

    const result = await analyzeGitRepository(options.repository, {
      token: options.token,
      verbose: false,
      includeRawData: options.raw,
      onProgress: progress => {
        if (!options.json) {
          process.stderr.write('\r' + ' '.repeat(60) + '\r');
          process.stderr.write(`\r${progress.message} (${progress.progress}%)`);
        }
      },
    });

    if (options.json) {
      console.log(formatResultJson(result));
    } else {
      process.stderr.write('\r' + ' '.repeat(60) + '\r');
      printReport(result);
    }
  } catch (error) {
    process.stderr.write('\r' + ' '.repeat(60) + '\r');
    console.error(pc.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}

await main();
