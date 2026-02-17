import type { Story } from '@ladle/react';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { ContributorsSection } from '@git-repo-analyzer/ui';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/react');

export const Contributors: Story = () => (
  <div className="max-w-2xl p-4">
    <ContributorsSection data={report.contributors} />
  </div>
);
