import { AppHeader } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';
import type { StoryDefault } from '@ladle/react';

export default {
  title: 'Components',
} satisfies StoryDefault;

export const AppHeaders: Story = () => <AppHeader onClick={() => {}} />;
