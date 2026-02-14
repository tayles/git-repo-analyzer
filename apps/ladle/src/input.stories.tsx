import type { Story } from '@ladle/react';

import { Input } from '@git-repo-analyzer/ui';

export default {
  title: 'Components/Input',
};

export const Default: Story = () => <Input placeholder="Enter text..." />;

export const WithLabel: Story = () => (
  <div className="grid w-full max-w-sm items-center gap-1.5">
    <label htmlFor="email" className="text-sm font-medium">
      Email
    </label>
    <Input type="email" id="email" placeholder="Enter your email" />
  </div>
);

export const Disabled: Story = () => <Input disabled placeholder="Disabled input" />;

export const WithValue: Story = () => <Input defaultValue="facebook/react" />;

export const Repository: Story = () => (
  <div className="grid w-full max-w-sm items-center gap-1.5">
    <label htmlFor="repo" className="text-sm font-medium">
      Repository
    </label>
    <Input id="repo" placeholder="owner/repo or GitHub URL" />
    <p className="text-muted-foreground text-xs">Enter a GitHub repository to analyze</p>
  </div>
);
