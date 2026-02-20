import { createMockAnalysisResult, mockContributors } from '@git-repo-analyzer/mocks';
import { ActivityHeatmapChart } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/react');

const selectedContributor = mockContributors[0];

export const AllVariants: Story = () => (
  <div className="max-w-2xl space-y-4 p-4">
    <h3 className="text-sm font-medium">Default (all contributors)</h3>
    <ActivityHeatmapChart
      data={report.commits.activityHeatmap}
      contributors={mockContributors}
      selectedContributor={null}
      onContributorChange={() => {}}
      primaryTimezone={null}
    />

    <h3 className="text-sm font-medium">Filtered by contributor (with timezone)</h3>
    <ActivityHeatmapChart
      data={report.commits.activityHeatmap}
      contributors={mockContributors}
      selectedContributor={selectedContributor}
      primaryTimezone={selectedContributor.timezone}
      onContributorChange={() => {}}
    />

    <h3 className="text-sm font-medium">Filtered by contributor (UTC fallback)</h3>
    <ActivityHeatmapChart
      data={report.commits.activityHeatmap}
      contributors={mockContributors}
      selectedContributor={selectedContributor}
      onContributorChange={() => {}}
      primaryTimezone={null}
    />
  </div>
);
