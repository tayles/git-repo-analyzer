// import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { AppHomePage } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';
import type { StoryDefault } from '@ladle/react';

import { WebBrowser } from './wrappers/WebBrowser';

export default {
  title: 'App',
  decorators: [
    Component => (
      <WebBrowser>
        <Component />
      </WebBrowser>
    ),
  ],
} satisfies StoryDefault;

// const history = [createMockAnalysisResult('facebook/react')];

export const HomePage: Story = () => (
  <AppHomePage
    repo=""
    errorMsg={null}
    history={[]}
    onAnalyze={() => {}}
    onDeleteReport={() => {}}
    onDeleteAllReports={() => {}}
    onCancel={() => {}}
  />
);
