import { ThemeToggle } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const ThemeToggles: Story = () => (
  <div className="p-4">
    <ThemeToggle />
  </div>
);
