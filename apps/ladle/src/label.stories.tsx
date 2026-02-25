import { Input, Label } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const Labels: Story = () => (
  <div className="grid w-full max-w-sm items-center gap-4">
    <div className="grid gap-1.5">
      <Label htmlFor="repo">Repository</Label>
      <Input id="repo" placeholder="owner/repo" />
    </div>
    <div className="grid gap-1.5">
      <Label htmlFor="token">GitHub Token (optional)</Label>
      <Input id="token" type="password" placeholder="ghp_..." />
    </div>
  </div>
);
