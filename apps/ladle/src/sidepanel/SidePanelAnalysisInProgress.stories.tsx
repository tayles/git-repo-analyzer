import type { Story } from '@ladle/react';
import type { StoryDefault } from '@ladle/react';

import { SidePanelAnalysisInProgress } from '@git-repo-analyzer/ui';

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

export const AnalysisInProgress: Story = () => (
  <SidePanelAnalysisInProgress repo="facebook/react" onCancel={() => {}} progress={progress} />
);
