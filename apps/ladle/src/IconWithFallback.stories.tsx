import { IconWithFallback } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const IconWithFallbacks: Story = () => (
  <div className="grid grid-cols-3 gap-4">
    <IconWithFallback url="https://avatars.githubusercontent.com/u/69631?v=4" alt="ok" />
    <IconWithFallback url="https://example.invalid/missing.png" alt="missing" />
    <IconWithFallback url={null} alt="none" hideOnError />
  </div>
);
