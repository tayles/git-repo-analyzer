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
const selectedUserProfile = userProfiles[0] ?? null;

export const ActivityHeatmapCharts: Story = () => (
  <div className="max-w-2xl space-y-4 p-4">
    <h3 className="text-sm font-medium">Default (all contributors)</h3>
    <ActivityHeatmapChart
      data={activityHeatmap}
      contributors={contributors}
      userProfiles={userProfiles}
      selectedUserProfile={null}
      onSelectUserProfile={() => {}}
      onHoverUserProfile={() => {}}
      primaryTimezone={null}
      contributorsMissingTimezone={4}
    />

    <h3 className="text-sm font-medium">Filtered by contributor (with timezone)</h3>
    <ActivityHeatmapChart
      data={activityHeatmap}
      contributors={contributors}
      userProfiles={userProfiles}
      selectedUserProfile={null}
      onSelectUserProfile={() => {}}
      onHoverUserProfile={() => {}}
      primaryTimezone={null}
      contributorsMissingTimezone={0}
    />

    <h3 className="text-sm font-medium">Filtered by contributor (UTC fallback, no warning)</h3>
    <ActivityHeatmapChart
      data={activityHeatmap}
      contributors={contributors}
      userProfiles={userProfiles}
      selectedUserProfile={selectedUserProfile}
      onSelectUserProfile={() => {}}
      onHoverUserProfile={() => {}}
      primaryTimezone={null}
      contributorsMissingTimezone={0}
    />
  </div>
);
