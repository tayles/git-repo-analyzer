import type { Story } from '@ladle/react';

import { EmptyStatePlaceholder } from '@git-repo-analyzer/ui';

export default {
  title: 'Components',
};

export const EmptyStatePlaceholders: Story = () => (
  <EmptyStatePlaceholder>Empty State Placeholder Content</EmptyStatePlaceholder>
);
