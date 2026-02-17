import { afterAll, beforeAll, describe, expect, it } from 'bun:test';

import type { ProgressUpdate } from './types';

import { analyzeGitRepository } from './index';
import { installMockFetch, restoreFetch } from './test-utils';

beforeAll(() => {
  installMockFetch();
});

afterAll(() => {
  restoreFetch();
});

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

    await analyzeGitRepository('facebook/react', {
      onProgress: update => {
        progressUpdates.push(update);
      },
    });

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

  it('should compute a health score with categories', async () => {
    const result = await analyzeGitRepository('facebook/react');

    expect(result.healthScore).toBeDefined();
    expect(result.healthScore.overall).toBeGreaterThanOrEqual(0);
    expect(result.healthScore.overall).toBeLessThanOrEqual(100);

    const categories = Object.keys(result.healthScore.categories);
    expect(categories).toContain('Maintenance');
    expect(categories).toContain('Documentation');
    expect(categories).toContain('Community');
    expect(categories).toContain('Code Quality');
    expect(categories).toContain('Security');

    // Each category should have a score, maxScore, and details
    for (const key of categories) {
      const cat = result.healthScore.categories[key as keyof typeof result.healthScore.categories];
      expect(cat.score).toBeGreaterThanOrEqual(0);
      expect(cat.maxScore).toBeGreaterThan(0);
      expect(cat.details).toBeInstanceOf(Array);
    }
  });

  it('should detect tooling from the file tree', async () => {
    const result = await analyzeGitRepository('facebook/react');

    expect(result.tooling).toBeDefined();
    expect(result.tooling.tools).toBeInstanceOf(Array);
    expect(result.tooling.tools.length).toBeGreaterThan(0);
    expect(result.tooling.categories).toBeInstanceOf(Array);
    expect(result.tooling.categories.length).toBeGreaterThan(0);

    // Each tool should have expected properties
    for (const tool of result.tooling.tools) {
      expect(tool.name).toBeDefined();
      expect(typeof tool.name).toBe('string');
    }
  });
});
