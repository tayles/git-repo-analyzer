import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { SidePanelRepoDetailsPage } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';
import type { StoryDefault } from '@ladle/react';

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

const report = createMockAnalysisResult('facebook/docusaurus');

export const RepoDetailsPage: Story = () => (
  <SidePanelRepoDetailsPage report={report} onBack={() => {}} onRefresh={() => {}} />
);
