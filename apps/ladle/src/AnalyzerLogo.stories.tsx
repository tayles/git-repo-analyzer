import { AnalyzerLogo } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const AnalyzerLogos: Story = () => (
  <div className="flex items-center gap-6">
    <div className="flex items-center gap-2">
      <AnalyzerLogo />
      <span>Default</span>
    </div>
    <div className="flex items-center gap-2">
      <AnalyzerLogo className="size-120" />
      <span>Large</span>
    </div>
  </div>
);
