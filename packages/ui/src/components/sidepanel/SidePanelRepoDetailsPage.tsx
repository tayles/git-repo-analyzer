import type { AnalysisResult } from '@git-repo-analyzer/core';

import { RepoDetailsLayout } from '../RepoDetailsLayout';

interface SidePanelRepoDetailsPageProps {
  report: AnalysisResult;
  onBack: () => void;
  onRefresh: () => void;
}

export function SidePanelRepoDetailsPage({
  report,
  onBack,
  onRefresh,
}: SidePanelRepoDetailsPageProps) {
  return (
    <div className="flex h-full flex-col justify-start gap-2 p-2">
      <RepoDetailsLayout report={report} onBack={onBack} onRefresh={onRefresh} />
    </div>
  );
}
