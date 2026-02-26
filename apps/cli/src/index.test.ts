import { describe, expect, it } from 'bun:test';

import { analyzeGitRepository } from './index';

describe('TypeScript library', () => {
  it('should export a function', () => {
    expect(typeof analyzeGitRepository).toBe('function');
  });

  it('should throw an error when no repository is provided', async () => {
    expect(analyzeGitRepository(null as any)).rejects.toThrow('No repository provided');
  });
});
