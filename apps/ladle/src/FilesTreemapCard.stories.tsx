import { mockResult } from '@git-repo-analyzer/mocks';
import { FilesTreemapCard } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const FilesTreemapCards: Story = () => (
  <div className="max-w-2xl p-4">
    <FilesTreemapCard data={mockResult.fileTree} />
  </div>
);
