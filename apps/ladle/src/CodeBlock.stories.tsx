import { CodeBlock } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const CodeBlocks: Story = () => (
  <div className="max-w-md">
    <CodeBlock code="bun add git-repo-analyzer" />
  </div>
);
