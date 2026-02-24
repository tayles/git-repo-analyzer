import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { WorkPatternsCard } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/docusaurus');

const selectedUserProfile = report.userProfiles[0] ?? null;

export const WorkPatterns: Story = () => (
  <div className="max-w-2xl space-y-4 p-4">
    <h3 className="text-sm font-medium">With timezone warning</h3>
    <WorkPatternsCard
      data={report.commits.workPatterns}
      selectedUserProfile={selectedUserProfile}
      contributorsMissingTimezone={4}
    />

    <h3 className="text-sm font-medium">No warning</h3>
    <WorkPatternsCard
      data={report.commits.workPatterns}
      selectedUserProfile={selectedUserProfile}
      contributorsMissingTimezone={0}
    />
  </div>
);
