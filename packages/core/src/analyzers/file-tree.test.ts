import { describe, expect, it } from 'bun:test';

import type { GitHubFileTree } from '../client/github-types';
import { processFileTree } from './file-tree';

function makeFileTree(
  entries: Array<{ path: string; size: number; type?: 'blob' | 'tree' }>,
): GitHubFileTree {
  return {
    tree: entries.map(entry => ({
      path: entry.path,
      mode: '100644',
      type: entry.type ?? 'blob',
      sha: 'x',
      size: entry.size,
      url: '',
    })),
  };
}

describe('processFileTree', () => {
  it('aggregates top-level directory sizes and file counts', () => {
    const files = makeFileTree([
      { path: 'src/index.ts', size: 120 },
      { path: 'src/app.ts', size: 80 },
      { path: 'docs/readme.md', size: 50 },
      { path: 'README.md', size: 20 },
    ]);

    const result = processFileTree(files);

    expect(result.totalBytes).toBe(270);
    expect(result.totalFiles).toBe(4);
    expect(result.directories[0]).toMatchObject({ path: 'src', bytes: 200, fileCount: 2 });
    expect(result.directories[1]).toMatchObject({ path: 'docs', bytes: 50, fileCount: 1 });
    expect(result.directories[2]).toMatchObject({ path: '.', bytes: 20, fileCount: 1 });
  });

  it('ignores tree entries', () => {
    const files = makeFileTree([
      { path: 'src', size: 0, type: 'tree' },
      { path: 'src/index.ts', size: 100 },
    ]);

    const result = processFileTree(files);

    expect(result.totalFiles).toBe(1);
    expect(result.totalBytes).toBe(100);
    expect(result.directories).toHaveLength(1);
    expect(result.directories[0]).toMatchObject({ path: 'src', bytes: 100, fileCount: 1 });
  });
});
