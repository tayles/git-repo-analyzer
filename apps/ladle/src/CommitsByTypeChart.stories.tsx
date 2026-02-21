import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { CommitsByTypeChart } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/docusaurus');
const topContributor = report.contributors.topContributors[0] ?? null;

const emptyCommits = {
  ...report.commits,
  conventions: { prefixes: {}, conventionalCommits: false, gitmoji: false },
  commits: [],
};

export const CommitsByType: Story = () => (
  <div className="max-w-sm p-4">
    <CommitsByTypeChart commits={report.commits} selectedContributor={null} />
  </div>
);

export const CommitsByTypeFiltered: Story = () => (
  <div className="max-w-sm p-4">
    <p className="text-muted-foreground mb-2 text-xs">
      Filtered to: {topContributor?.login ?? 'n/a'}
    </p>
    <CommitsByTypeChart commits={report.commits} selectedContributor={topContributor} />
  </div>
);

export const CommitsByTypeEmpty: Story = () => (
  <div className="max-w-sm p-4">
    <p className="text-muted-foreground mb-2 text-xs">(nothing rendered — no commits)</p>
    <CommitsByTypeChart commits={emptyCommits} selectedContributor={null} />
  </div>
);
