import { LoadingLayout } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const LoadingLayouts: Story = () => (
  <LoadingLayout
    repo="facebook/react"
    progressMessage="Completed 3 of 6: Commits"
    progressValue={50}
    onCancel={() => {}}
  />
);
