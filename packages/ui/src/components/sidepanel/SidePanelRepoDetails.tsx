import type { AnalysisResult } from '@git-repo-analyzer/core';

import { Button } from '../ui/button';

interface SidePanelRepoDetailsProps {
  report: AnalysisResult;
  onBack: () => void;
  onRefresh: () => void;
}

export function SidePanelRepoDetails({ report, onBack, onRefresh }: SidePanelRepoDetailsProps) {
  return (
    <div className="p-4">
      <Button onClick={onBack}>Back</Button>
      <Button onClick={onRefresh}>Refresh</Button>
      <h2 className="mb-2 text-lg font-semibold">Repository Details</h2>
      <div>
        <p>
          <strong>Name:</strong> {report.repository}
        </p>
        <p>
          <strong>Primary Language:</strong> {report.stats.primaryLanguage}
        </p>
        <p>
          <strong>Total Commits:</strong> {report.stats.totalCommits}
        </p>
        <p>
          <strong>Total Contributors:</strong> {report.stats.totalContributors}
        </p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
}
