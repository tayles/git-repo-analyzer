import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { CommitsByTypeChart } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/docusaurus');
const topContributor = report.userProfiles[0] ?? null;

const emptyCommits = {
  ...report.commits,
  conventions: { prefixes: {}, conventionalCommits: false, gitmoji: false },
  commits: [],
};

export const CommitsByType: Story = () => (
  <div className="max-w-sm p-4">
    <CommitsByTypeChart commits={report.commits} selectedUserProfile={null} />
  </div>
);

export const CommitsByTypeFiltered: Story = () => (
  <div className="max-w-sm p-4">
    <p className="text-muted-foreground mb-2 text-xs">
      Filtered to: {topContributor?.login ?? 'n/a'}
    </p>
    <CommitsByTypeChart commits={report.commits} selectedUserProfile={topContributor} />
  </div>
);

export const CommitsByTypeEmpty: Story = () => (
  <div className="max-w-sm p-4">
    <p className="text-muted-foreground mb-2 text-xs">(nothing rendered — no commits)</p>
    <CommitsByTypeChart commits={emptyCommits} selectedUserProfile={null} />
  </div>
);
