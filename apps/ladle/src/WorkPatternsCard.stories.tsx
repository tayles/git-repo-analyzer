import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { WorkPatternsCard } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/react');

export const WorkPatterns: Story = () => (
  <div className="max-w-2xl p-4">
    <WorkPatternsCard data={report.commits.workPatterns} />
  </div>
);
