import type { Story } from '@ladle/react';

import { TOOL_REGISTRY } from '@git-repo-analyzer/core';
import { ToolCard } from '@git-repo-analyzer/ui';

export default {
  title: 'Components',
};

const toolsByCategory = Object.values(TOOL_REGISTRY).reduce(
  (acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  },
  {} as Record<string, (typeof TOOL_REGISTRY)[keyof typeof TOOL_REGISTRY][]>,
);

export const ToolCards: Story = () => (
  <div className="flex flex-col gap-4">
    {Object.entries(toolsByCategory).map(([category, tools]) => (
      <div key={category}>
        <h2 className="mb-2 text-lg font-bold">{category}</h2>
        <div className="flex flex-wrap gap-4">
          {tools.map(tool => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </div>
    ))}
  </div>
);
