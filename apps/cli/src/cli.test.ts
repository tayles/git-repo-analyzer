import { describe, expect, it } from 'bun:test';

describe('CLI', () => {
  const cliPath = `${import.meta.dirname}/cli.ts`;

  it('should display help text with --help flag', () => {
    const { spawnSync } = require('child_process');
    const result = spawnSync('bun', ['run', cliPath, '--help'], {
      encoding: 'utf-8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Usage:');
    expect(result.stdout).toContain('Options:');
  });

  it('should display version with --version flag', () => {
    const { spawnSync } = require('child_process');
    const result = spawnSync('bun', ['run', cliPath, '--version'], {
      encoding: 'utf-8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/); // Simple regex to check for version format
  });

  it('should error when no repository is provided', () => {
    const { spawnSync } = require('child_process');
    const result = spawnSync('bun', ['run', cliPath], {
      encoding: 'utf-8',
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Error: Repository argument is required');
  });

  it('should error when invalid repository format is provided', () => {
    const { spawnSync } = require('child_process');
    const result = spawnSync('bun', ['run', cliPath, 'invalid-repo-format'], {
      encoding: 'utf-8',
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Error: Invalid repository format');
  });
});
