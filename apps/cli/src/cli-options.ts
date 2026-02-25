export interface CliOptions {
  repository: string;
  token?: string;
  json: boolean;
  raw: boolean;
  help: boolean;
  version: boolean;
}

import PackageJson from '../package.json';

export const VERSION = PackageJson.version;

export const HELP_TEXT = `
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

export function parseArgs(args: string[]): CliOptions {
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
