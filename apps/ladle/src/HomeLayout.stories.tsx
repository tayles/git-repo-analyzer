import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { HomeLayout } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const history = [
  createMockAnalysisResult('facebook/docusaurus'),
  createMockAnalysisResult('oven-sh/bun'),
];

export const HomeLayouts: Story = () => (
  <HomeLayout
    repo="facebook/docusaurus"
    errorMsg={null}
    history={history}
    token=""
    isTokenSectionOpen={false}
    onAnalyze={() => {}}
    onDeleteReport={() => {}}
    onDeleteAllReports={() => {}}
    onTokenChange={() => {}}
    onTokenSectionOpenChange={() => {}}
  />
);
