import { Input } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const Inputs: Story = () => (
  <div className="grid w-full max-w-sm items-center gap-4">
    <div className="grid w-full items-center gap-1.5">
      <label htmlFor="default" className="text-sm font-medium">
        Default
      </label>
      <Input id="default" placeholder="Enter text..." />
    </div>
    <div className="grid w-full items-center gap-1.5">
      <label htmlFor="with-label" className="text-sm font-medium">
        With Label
      </label>
      <Input id="with-label" placeholder="Input with label" />
    </div>
    <div className="grid w-full items-center gap-1.5">
      <label htmlFor="disabled" className="text-sm font-medium">
        Disabled
      </label>
      <Input id="disabled" disabled placeholder="Disabled input" />
    </div>
    <div className="grid w-full items-center gap-1.5">
      <label htmlFor="with-value" className="text-sm font-medium">
        With Value
      </label>
      <Input id="with-value" defaultValue="facebook/react" />
    </div>
    <div className="grid w-full items-center gap-1.5">
      <label htmlFor="repository" className="text-sm font-medium">
        Repository
      </label>
      <Input id="repository" placeholder="owner/repo or GitHub URL" />
      <p className="text-muted-foreground text-xs">Enter a GitHub repository to analyze</p>
    </div>
  </div>
);
