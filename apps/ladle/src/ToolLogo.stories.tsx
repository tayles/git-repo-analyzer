import type { Story } from '@ladle/react';

import { ToolLogo } from '@git-repo-analyzer/ui';
import { TOOL_REGISTRY } from '@git-repo-analyzer/core';

export default {
  title: 'Components / Tool Logo',
};

const toolsByCategory = Object.values(TOOL_REGISTRY).reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = [];
  }
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, typeof TOOL_REGISTRY[keyof typeof TOOL_REGISTRY][]>);

export const All: Story = () => (
  <div className="flex flex-col gap-4">
    {Object.entries(toolsByCategory).map(([category, tools]) => (
      <div key={category}>
        <h2 className="text-lg font-bold mb-2">{category}</h2>
        <div className="flex flex-wrap gap-4">
          {tools.map(tool => (
            <div key={tool.name} className="flex items-center gap-2">
              <ToolLogo logo={tool.logo} />
              <span>{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)
