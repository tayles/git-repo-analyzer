import type { AnalysisResult } from '@git-repo-analyzer/core';

interface SidePanelRepoDetailsProps {
  report: AnalysisResult;
}

export function SidePanelRepoDetails({ report }: SidePanelRepoDetailsProps) {
  return (
    <div className="p-4">
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
