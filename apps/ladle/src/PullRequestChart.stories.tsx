import { computePullsPerWeek } from '@git-repo-analyzer/core';
import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { PullRequestChart } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/docusaurus');

const data = computePullsPerWeek(report.pullRequests.pulls);

export const PullRequestCharts: Story = () => (
  <div className="max-w-2xl p-4">
    <PullRequestChart data={data} />
  </div>
);
