import type { Story } from '@ladle/react';
import type { StoryDefault } from '@ladle/react';

import { SidePanelLoadingPage } from '@git-repo-analyzer/ui';

import { ChromeExtensionSidePanel } from './wrappers/ChromeExtensionSidePanel';

export default {
  title: 'Side Panel',
  decorators: [
    Component => (
      <ChromeExtensionSidePanel>
        <Component />
      </ChromeExtensionSidePanel>
    ),
  ],
} satisfies StoryDefault;

const progress = 'Analyzing code structure (1/4)';

export const LoadingPage: Story = () => (
  <SidePanelLoadingPage repo="facebook/react" onCancel={() => {}} progress={progress} />
);
