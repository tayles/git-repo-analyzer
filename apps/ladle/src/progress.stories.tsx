import { Progress } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const Progresses: Story = () => (
  <div className="grid max-w-md gap-4">
    <Progress value={20} />
    <Progress value={60} />
    <Progress value={90} />
  </div>
);
