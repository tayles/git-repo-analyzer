import { computeActivityHeatmap } from '@git-repo-analyzer/core';
import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { ActivityHeatmapChart } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/docusaurus');

const activityHeatmap = computeActivityHeatmap(report.commits.commits);
const contributors = report.contributors;
const userProfiles = report.userProfiles;
const selectedContributor = contributors.recentContributors[0] ?? null;

export const AllVariants: Story = () => (
  <div className="max-w-2xl space-y-4 p-4">
    <h3 className="text-sm font-medium">Default (all contributors)</h3>
    <ActivityHeatmapChart
      data={activityHeatmap}
      contributors={contributors}
      userProfiles={userProfiles}
      selectedContributor={null}
      onContributorChange={() => {}}
      primaryTimezone={null}
    />

    <h3 className="text-sm font-medium">Filtered by contributor (with timezone)</h3>
    <ActivityHeatmapChart
      data={activityHeatmap}
      contributors={contributors}
      userProfiles={userProfiles}
      selectedContributor={selectedContributor}
      primaryTimezone={null}
      onContributorChange={() => {}}
    />

    <h3 className="text-sm font-medium">Filtered by contributor (UTC fallback)</h3>
    <ActivityHeatmapChart
      data={activityHeatmap}
      contributors={contributors}
      userProfiles={userProfiles}
      selectedContributor={selectedContributor}
      onContributorChange={() => {}}
      primaryTimezone={null}
    />
  </div>
);
