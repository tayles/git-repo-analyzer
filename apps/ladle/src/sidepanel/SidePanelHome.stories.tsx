import type { Story } from '@ladle/react';
import type { StoryDefault } from '@ladle/react';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { SidePanelHome } from '@git-repo-analyzer/ui';

import { ChromeExtensionSidePanel } from './wrappers/ChromeExtensionSidePanel';

export default {
  title: 'Side Panel',
} satisfies StoryDefault;

const history = [createMockAnalysisResult('facebook/react')];

export const Home: Story = () => (
  <div className="flex h-full flex-wrap items-stretch gap-12">
    <ChromeExtensionSidePanel>
      <SidePanelHome
        repo=""
        errorMsg={null}
        history={[]}
        onAnalyze={() => {}}
        onDeleteReport={() => {}}
        onDeleteAllReports={() => {}}
      />
    </ChromeExtensionSidePanel>

    <ChromeExtensionSidePanel>
      <SidePanelHome
        repo="facebook/react"
        errorMsg={null}
        history={history}
        onAnalyze={() => {}}
        onDeleteReport={() => {}}
        onDeleteAllReports={() => {}}
      />
    </ChromeExtensionSidePanel>
  </div>
);
