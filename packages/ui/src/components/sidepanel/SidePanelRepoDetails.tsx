import type { AnalysisResult } from '@git-repo-analyzer/core';

import { ChevronLeft, RefreshCw } from 'lucide-react';

import { Button } from '../ui/button';

interface SidePanelRepoDetailsProps {
  report: AnalysisResult;
  onBack: () => void;
  onRefresh: () => void;
}

export function SidePanelRepoDetails({ report, onBack, onRefresh }: SidePanelRepoDetailsProps) {
  return (
    <div className="p-4">
      <Button size="icon" variant="ghost" onClick={onBack}>
        <ChevronLeft />
      </Button>
      <Button size="icon" variant="ghost" onClick={onRefresh}>
        <RefreshCw />
      </Button>
      <h2 className="mb-2 text-lg font-semibold">Repository Details</h2>
      <div>
        <p>
          <strong>Name:</strong> {report.basicStats.fullName}
        </p>
        <p>
          <strong>Primary Language:</strong> {report.languages.primaryLanguage}
        </p>
        <p>
          <strong>Total Commits:</strong> {report.commits.totalCommits}
        </p>
        <p>
          <strong>Total Contributors:</strong> {report.contributors.totalContributors}
        </p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
}
