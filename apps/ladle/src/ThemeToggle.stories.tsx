import type { Story } from '@ladle/react';

import { ThemeToggle } from '@git-repo-analyzer/ui';

export default {
  title: 'Components',
};

export const ThemeToggles: Story = () => (
  <div className="p-4">
    <ThemeToggle />
  </div>
);
