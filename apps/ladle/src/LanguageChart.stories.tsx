import type { Story } from '@ladle/react';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { LanguageChart } from '@git-repo-analyzer/ui';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/react');

export const LanguageCharts: Story = () => (
  <div className="max-w-2xl p-4">
    <LanguageChart data={report.languages} />
  </div>
);
