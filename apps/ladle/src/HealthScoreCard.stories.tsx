import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { HealthScoreCard } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/react');

export const HealthScoreCards: Story = () => (
  <div className="max-w-2xl p-4">
    <HealthScoreCard health={report.healthScore} />
  </div>
);
