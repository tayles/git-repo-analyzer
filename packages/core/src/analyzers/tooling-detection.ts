import { minimatch } from 'minimatch';

import type { GitHubFile, GitHubFileTree } from '../client/github-types';
import type { ToolAnalysis } from '../types';

import { type ToolMetaWithFileMatches, TOOL_REGISTRY } from '../tool-registry';

export function processTooling(files: GitHubFileTree): ToolAnalysis {
  const tools = detectFromTree(files.tree);
  const categories = Array.from(new Set(tools.map(t => t.category)));

  return {
    tools,
    categories,
  };
}

function detectFromTree(files: GitHubFile[]): ToolMetaWithFileMatches[] {
  const found = new Set<ToolMetaWithFileMatches>();
  const filePaths = files.map(f => f.path);

  for (const tool of Object.values(TOOL_REGISTRY)) {
    const { globs, ...rest } = tool;

    // TODO: improve performance by pre-compiling globs and using a more efficient matching algorithm if needed
    const matches = globs
      .flatMap(glob => filePaths.filter(minimatch.filter(glob)))
      .filter((v, i, arr) => arr.indexOf(v) === i);

    if (matches.length > 0) {
      found.add({
        ...rest,
        paths: matches,
      });
    }
  }
  return [...found];
}
