import type { Contributor } from '@git-repo-analyzer/core';
import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { ContributorsSection } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';
import { useState } from 'react';

export default {
  title: 'Components',
};

const report = createMockAnalysisResult('facebook/react');

export const Contributors: Story = () => {
  const [selected, setSelected] = useState<Contributor | null>(null);

  return (
    <div className="max-w-2xl space-y-4 p-4">
      <h3 className="text-sm font-medium">Without selection (default)</h3>
      <ContributorsSection
        data={report.contributors}
        selectedContributor={null}
        onSelectContributor={() => {}}
        onHoverContributor={() => {}}
      />

      <h3 className="text-sm font-medium">With click-to-select</h3>
      <ContributorsSection
        data={report.contributors}
        selectedContributor={selected}
        onSelectContributor={setSelected}
        onHoverContributor={() => {}}
      />
      {selected && <p className="text-muted-foreground text-sm">Selected: {selected.login}</p>}
    </div>
  );
};
