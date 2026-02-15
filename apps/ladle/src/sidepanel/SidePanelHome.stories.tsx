import type { Story } from '@ladle/react';
import type { StoryDefault } from '@ladle/react';

import { SidePanelHome } from '@git-repo-analyzer/ui';

import { ChromeExtensionSidePanel } from './wrappers/ChromeExtensionSidePanel';

export default {
  title: 'Side Panel / Home',
  decorators: [
    Component => (
      <ChromeExtensionSidePanel>
        <Component />
      </ChromeExtensionSidePanel>
    ),
  ],
} satisfies StoryDefault;

export const Default: Story = () => <SidePanelHome repo="facebook/react" />;
