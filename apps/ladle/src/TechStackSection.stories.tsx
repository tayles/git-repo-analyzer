import { TOOL_REGISTRY, type ToolMetaWithFileMatches } from '@git-repo-analyzer/core';
import { TechStackSection } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const allTools: ToolMetaWithFileMatches[] = Object.values(TOOL_REGISTRY).map(tool => ({
  ...tool,
  paths: tool.globs,
}));

export const TechStackSections: Story = () => <TechStackSection repo="foo/bar" tools={allTools} />;
