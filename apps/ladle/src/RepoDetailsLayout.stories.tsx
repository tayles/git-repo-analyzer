import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { RepoDetailsLayout } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/docusaurus');

export const RepoDetailsLayouts: Story = () => (
  <RepoDetailsLayout report={report} onBack={() => {}} onRefresh={() => {}} />
);
