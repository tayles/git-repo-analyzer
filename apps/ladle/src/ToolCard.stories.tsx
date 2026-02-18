import { TOOL_REGISTRY, type ToolMetaWithFileMatches } from '@git-repo-analyzer/core';
import { ToolCard } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const toolsByCategory = Object.values(TOOL_REGISTRY).reduce(
  (acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    const toolWithPaths = { ...tool, paths: tool.globs };
    acc[tool.category].push(toolWithPaths);
    return acc;
  },
  {} as Record<string, ToolMetaWithFileMatches[]>,
);

export const ToolCards: Story = () => (
  <div className="flex flex-col gap-4">
    {Object.entries(toolsByCategory).map(([category, tools]) => (
      <div key={category}>
        <h2 className="mb-2 text-lg font-bold">{category}</h2>
        <div className="flex flex-wrap gap-4">
          {tools.map(tool => (
            <ToolCard key={tool.name} repo="foo/bar" tool={tool} />
          ))}
        </div>
      </div>
    ))}
  </div>
);
