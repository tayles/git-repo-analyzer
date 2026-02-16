import type { Story } from '@ladle/react';

import { GettingStartedPlaceholder } from '@git-repo-analyzer/ui';

export default {
  title: 'Components',
};

export const GettingStartedPlaceholders: Story = () => (
  <GettingStartedPlaceholder onSelectExample={() => {}} />
);
