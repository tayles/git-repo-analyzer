import type { Story } from '@ladle/react';
import type { StoryDefault } from '@ladle/react';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { SidePanelRepoDetails } from '@git-repo-analyzer/ui';

import { ChromeExtensionSidePanel } from './wrappers/ChromeExtensionSidePanel';

export default {
  title: 'Side Panel / Repo Details',
  decorators: [
    Component => (
      <ChromeExtensionSidePanel>
        <Component />
      </ChromeExtensionSidePanel>
    ),
  ],
} satisfies StoryDefault;

const report = createMockAnalysisResult('facebook/react');

export const Default: Story = () => <SidePanelRepoDetails report={report} />;
