import type { Story } from '@ladle/react';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { AnalysisReportCard } from '@git-repo-analyzer/ui';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('example/repo');

export const AnalysisReportCards: Story = () => (
  <AnalysisReportCard report={report} onClick={() => {}} onDelete={() => {}} />
);
