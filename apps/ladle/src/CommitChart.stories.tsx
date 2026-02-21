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
  <div className="max-w-2xl p-4">
    <CommitChart data={data} />
  </div>
);
