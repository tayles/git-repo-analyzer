import type { AnalysisResult } from '@git-repo-analyzer/core';

import { RepoDetailsLayout } from '../RepoDetailsLayout';
import { AppHeader } from './AppHeader';

interface AppRepoDetailsPageProps {
  report: AnalysisResult;
  onBack: () => void;
  onRefresh: () => void;
}

export function AppRepoDetailsPage({ report, onBack, onRefresh }: AppRepoDetailsPageProps) {
  return (
    <div className="container mx-auto flex h-full flex-col justify-start gap-2 p-2">
      <AppHeader />
      <RepoDetailsLayout report={report} onBack={onBack} onRefresh={onRefresh} />
    </div>
  );
}
