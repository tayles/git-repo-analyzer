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
  for (const tool of Object.values(TOOL_REGISTRY)) {
    for (const pattern of tool.files) {
      if (pattern.endsWith('/')) {
        // directory prefix match
        const prefix = pattern.slice(0, -1);
        for (const f of files) {
          if (f.path === prefix || f.path.startsWith(pattern)) {
            found.add({ ...tool, paths: [f.path] });
            break;
          }
        }
      }
    }
  }
  return [...found];
}
