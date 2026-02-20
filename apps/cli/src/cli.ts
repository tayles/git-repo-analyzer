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

import { formatResultJson } from './cli-formatter';
import { printReport } from './cli-reporter';

interface CliOptions {
  repository: string;
  token?: string;
  json: boolean;
  raw: boolean;
  help: boolean;
  version: boolean;
}

const VERSION = '0.0.1';

const HELP_TEXT = `
Git Repo Analyzer CLI v${VERSION}

Usage:
  git-repo-analyzer <repository> [options]

Arguments:
  repository    GitHub repository (owner/repo or full URL)

Options:
  --token, -t   GitHub token for authenticated requests
  --json, -j    Output result as JSON
  --raw, -r     Include raw data in JSON output
  --help, -h    Show this help message
  --version, -v Show version number

Examples:
  git-repo-analyzer facebook/docusaurus
  git-repo-analyzer https://github.com/facebook/docusaurus --json
  git-repo-analyzer facebook/docusaurus --token ghp_xxxx
`.trim();

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    repository: '',
    token: undefined,
    json: false,
    raw: false,
    help: false,
    version: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--version' || arg === '-v') {
      options.version = true;
    } else if (arg === '--json' || arg === '-j') {
      options.json = true;
    } else if (arg === '--raw' || arg === '-r') {
      options.raw = true;
    } else if (arg === '--token' || arg === '-t') {
      options.token = args[++i];
    } else if (!arg.startsWith('-') && !options.repository) {
      options.repository = arg;
    }
  }

  return options;
}

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
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

await main();
