import { StatCard } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const StatCards: Story = () => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 p-4">
    <StatCard label="Stars" value={231456} href="https://github.com" />
    <StatCard label="Forks" value={48200} href="https://github.com" />
    <StatCard label="Watchers" value={6700} />
    <StatCard label="Language" value="TypeScript" />
    <StatCard label="License" value="MIT" />
    <StatCard label="Size" value={245000} />
    <StatCard label="Created" value="2013-05-24" />
    <StatCard label="No Value" value={null} />
  </div>
);
