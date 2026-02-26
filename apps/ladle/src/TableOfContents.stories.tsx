import { TableOfContents, type TocItem } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const items: TocItem[] = [
  { id: 'toc-tech-stack', label: 'Tech Stack' },
  { id: 'toc-activity', label: 'Activity' },
  { id: 'toc-health', label: 'Health' },
  { id: 'toc-stats', label: 'Stats' },
];

export const TableOfContentss: Story = () => (
  <div className="w-full max-w-2xl">
    <TableOfContents items={items} />
  </div>
);
