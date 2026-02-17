import { describe, expect, it } from 'bun:test';

import type { ProgressUpdate } from './types';

import { analyzeGitRepository } from './index';

describe('analyzeGitRepository', () => {
  it('should analyze a repository in owner/repo format', async () => {
    const result = await analyzeGitRepository('facebook/react');

    expect(result.basicStats.fullName).toBe('facebook/react');
    expect(result.basicStats).toBeDefined();
    expect(result.basicStats.stars).toBeGreaterThan(0);
    expect(result.contributors).toBeDefined();
    expect(result.contributors.totalContributors).toBeGreaterThan(0);
    expect(result.contributors.topContributors).toBeInstanceOf(Array);
    expect(result.languages).toBeDefined();
    expect(result.languages.langs).toBeInstanceOf(Array);
  });

  it('should analyze a repository from a full GitHub URL', async () => {
    const result = await analyzeGitRepository('https://github.com/facebook/react');

    expect(result.basicStats.fullName).toBe('facebook/react');
  });

  it('should handle URLs with .git suffix', async () => {
    const result = await analyzeGitRepository('https://github.com/facebook/react.git');

    expect(result.basicStats.fullName).toBe('facebook/react');
  });

  it('should call the progress callback with updates', async () => {
    const progressUpdates: ProgressUpdate[] = [];

    await analyzeGitRepository('facebook/react', { onProgress: (update) => {
      progressUpdates.push(update);
    } });

    expect(progressUpdates.length).toBeGreaterThan(0);
    expect(progressUpdates[0].phase).toBe('fetching');
    expect(progressUpdates[progressUpdates.length - 1].phase).toBe('complete');
    expect(progressUpdates[progressUpdates.length - 1].progress).toBe(100);
  });

  it('should accept an optional token', async () => {
    const result = await analyzeGitRepository('facebook/react', { token: 'test-token' });

    expect(result.basicStats.fullName).toBe('facebook/react');
  });

  it('should throw an error for invalid repository format', async () => {
    expect(analyzeGitRepository('invalid-format')).rejects.toThrow('Invalid repository format');
  });

  it('should include timing information in the result', async () => {
    const result = await analyzeGitRepository('facebook/react');

    expect(result.generator.durationMs).toBeGreaterThanOrEqual(0);
    expect(typeof result.generator.analyzedAt).toBe('string');
  });
});
