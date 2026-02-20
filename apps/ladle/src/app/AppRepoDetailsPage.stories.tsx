import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { AppRepoDetailsPage } from '@git-repo-analyzer/ui';
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

const report = createMockAnalysisResult('facebook/docusaurus');

export const RepoDetailsPage: Story = () => (
  <AppRepoDetailsPage report={report} onBack={() => {}} onRefresh={() => {}} />
);
