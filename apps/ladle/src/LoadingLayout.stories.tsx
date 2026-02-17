import type { Story } from '@ladle/react';

import { LoadingLayout } from '@git-repo-analyzer/ui';

export default {
  title: 'Components',
};

export const LoadingLayouts: Story = () => (
  <LoadingLayout repo="facebook/react" progress="Completed 3 of 6: Commits" onCancel={() => {}} />
);
