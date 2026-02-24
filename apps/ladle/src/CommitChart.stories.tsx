import { computeCommitsPerWeek } from '@git-repo-analyzer/core';
import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { CommitChart } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/docusaurus');

const data = computeCommitsPerWeek(report.commits.commits);

export const CommitCharts: Story = () => (
  <div className="max-w-2xl space-y-4 p-4">
    <h3 className="text-sm font-medium">Default (at pagination limit)</h3>
    <CommitChart data={data} totalCommits={300} />

    <h3 className="text-sm font-medium">Under limit (no warning)</h3>
    <CommitChart data={data} totalCommits={42} />
  </div>
);
