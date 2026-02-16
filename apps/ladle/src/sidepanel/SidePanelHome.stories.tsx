import type { Story } from '@ladle/react';
import type { StoryDefault } from '@ladle/react';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { SidePanelHome } from '@git-repo-analyzer/ui';

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

const history = [createMockAnalysisResult('facebook/react')];

export const Home: Story = () => (
  <SidePanelHome
    repo="facebook/react"
    errorMsg={null}
    history={history}
    onAnalyze={() => {}}
    onDeleteReport={() => {}}
    onDeleteAllReports={() => {}}
  />
);
