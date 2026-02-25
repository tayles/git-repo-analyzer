import { Badge } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const Badges: Story = () => (
  <div className="flex flex-wrap gap-2">
    <Badge>Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="destructive">Destructive</Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge variant="ghost">Ghost</Badge>
    <Badge variant="link">Link</Badge>
  </div>
);
