import picomatch from 'picomatch';

import type { GitHubFile, GitHubFileTree } from '../client/github-types';
import { type ToolMetaWithFileMatches, TOOL_REGISTRY } from '../tool-registry';
import type { ToolAnalysis } from '../types';

export function processTechStack(files: GitHubFileTree): ToolAnalysis {
  const tools = detectFromTree(files.tree);
  const categories = Array.from(new Set(tools.map(t => t.category)));

  return {
    tools,
    categories,
  };
}

interface CompiledTool {
  matcher: picomatch.Matcher;
  meta: Omit<ToolMetaWithFileMatches, 'paths'>;
}

// Pre-compile all glob patterns once at module load
const COMPILED_TOOLS: CompiledTool[] = Object.values(TOOL_REGISTRY).map(({ globs, ...rest }) => ({
  matcher: picomatch(globs),
  meta: rest,
}));

function detectFromTree(files: GitHubFile[]): ToolMetaWithFileMatches[] {
  // Build a map: tool index -> matched paths
  const matchesByTool = new Map<number, string[]>();

  for (const file of files) {
    for (let i = 0; i < COMPILED_TOOLS.length; i++) {
      if (COMPILED_TOOLS[i]!.matcher(file.path)) {
        let paths = matchesByTool.get(i);
        if (!paths) {
          paths = [];
          matchesByTool.set(i, paths);
        }
        paths.push(file.path);
      }
    }
  }

  const results: ToolMetaWithFileMatches[] = [];
  for (const [i, paths] of matchesByTool) {
    results.push({ ...COMPILED_TOOLS[i]!.meta, paths });
  }
  return results;
}
