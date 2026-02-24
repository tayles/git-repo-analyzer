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
  <div className="max-w-2xl space-y-4 p-4">
    <h3 className="text-sm font-medium">Default (at pagination limit)</h3>
    <PullRequestChart pulls={report.pullRequests} data={data} />

    <h3 className="text-sm font-medium">Under limit (no warning)</h3>
    <PullRequestChart
      pulls={{ ...report.pullRequests, pulls: report.pullRequests.pulls.slice(0, 10) }}
      data={data}
    />
  </div>
);
