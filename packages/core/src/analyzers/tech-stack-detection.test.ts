import { describe, expect, it } from 'bun:test';

import type { GitHubFileTree } from '../client/github-types';
import { processTechStack } from './tech-stack-detection';

function makeFileTree(paths: string[]): GitHubFileTree {
  return {
    tree: paths.map(path => ({
      path,
      mode: '100644',
      type: 'blob' as const,
      sha: 'x',
      size: 0,
      url: '',
    })),
  };
}

describe('processTechStack', () => {
  it('should detect package-lock.json as npm', () => {
    const files = makeFileTree(['package-lock.json']);
    const result = processTechStack(files, null);

    const npm = result.tools.find(t => t.name === 'npm');
    expect(npm).toBeDefined();
    expect(npm!.category).toBe('Package Managers');
  });

  it('should detect multiple tools from config files', () => {
    const files = makeFileTree([
      'package-lock.json',
      '.eslintrc.js',
      'jest.config.ts',
      'tsconfig.json',
    ]);
    const result = processTechStack(files, null);

    expect(result.tools.length).toBeGreaterThanOrEqual(2);
    expect(result.categories.length).toBeGreaterThanOrEqual(1);
  });

  it('should return empty when no tools match', () => {
    const files = makeFileTree(['random-file.xyz', 'another-unknown.abc']);
    const result = processTechStack(files, null);

    expect(result.tools).toEqual([]);
    expect(result.categories).toEqual([]);
  });

  it('should include matched file paths per tool', () => {
    const files = makeFileTree(['package-lock.json']);
    const result = processTechStack(files, null);

    const npm = result.tools.find(t => t.name === 'npm');
    expect(npm).toBeDefined();
    expect(npm!.paths).toContain('package-lock.json');
  });

  it('should prepend the main language', () => {
    const files = makeFileTree(['package-lock.json']);
    const result = processTechStack(files, 'TypeScript');

    const first = result.tools[0];
    expect(first).toBeDefined();
    expect(first!.name).toBe('TypeScript');
    expect(first!.category).toBe('Languages');
  });
});
