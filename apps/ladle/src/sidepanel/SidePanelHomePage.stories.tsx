import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { SidePanelHomePage } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';
import type { StoryDefault } from '@ladle/react';

import { ChromeExtensionSidePanel } from './wrappers/ChromeExtensionSidePanel';

export default {
  title: 'Side Panel',
} satisfies StoryDefault;

const history = [createMockAnalysisResult('facebook/docusaurus')];

export const HomePage: Story = () => (
  <div className="flex h-full flex-wrap items-stretch gap-12">
    <ChromeExtensionSidePanel>
      <SidePanelHomePage
        repo=""
        errorMsg={null}
        history={[]}
        onAnalyze={() => {}}
        onDeleteReport={() => {}}
        onDeleteAllReports={() => {}}
        token=""
        isTokenSectionOpen={false}
        onTokenChange={() => {}}
        onTokenSectionOpenChange={() => {}}
      />
    </ChromeExtensionSidePanel>

    <ChromeExtensionSidePanel>
      <SidePanelHomePage
        repo="facebook/docusaurus"
        errorMsg={null}
        history={history}
        onAnalyze={() => {}}
        onDeleteReport={() => {}}
        onDeleteAllReports={() => {}}
        token=""
        isTokenSectionOpen={false}
        onTokenChange={() => {}}
        onTokenSectionOpenChange={() => {}}
      />
    </ChromeExtensionSidePanel>
  </div>
);
