import type { Story } from '@ladle/react';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { CommitChart } from '@git-repo-analyzer/ui';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/react');

export const CommitCharts: Story = () => (
  <div className="max-w-2xl p-4">
    <CommitChart data={report.commits.byWeek} />
  </div>
);
