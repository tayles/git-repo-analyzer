import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { ActivityHeatmapChart } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/react');

export const ActivityHeatmap: Story = () => (
  <div className="max-w-2xl p-4">
    <ActivityHeatmapChart data={report.commits.activityHeatmap} />
  </div>
);
