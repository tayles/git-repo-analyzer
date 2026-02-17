import type { AnalysisResult } from '@git-repo-analyzer/core';

import { HomeLayout } from '../HomeLayout';
import { AppHeader } from './AppHeader';

interface AppHomePageProps {
  repo: string;
  errorMsg: string | null;
  history: AnalysisResult[];
  onAnalyze: (repo: string) => void;
  onDeleteReport: (repo: string) => void;
  onDeleteAllReports: () => void;
}

export function AppHomePage({
  repo,
  errorMsg,
  history = [],
  onAnalyze,
  onDeleteReport,
  onDeleteAllReports,
}: AppHomePageProps) {
  return (
    <div className="container mx-auto flex h-full flex-col items-stretch justify-start gap-12 p-4 pt-12">
      <AppHeader />
      <div className="flex flex-col gap-2 text-center">
        <p className="text-muted-foreground text-md">
          View the tech stack, health and other insights of any GitHub repository
        </p>
      </div>

      <HomeLayout
        repo={repo}
        errorMsg={errorMsg}
        history={history}
        onAnalyze={onAnalyze}
        onDeleteReport={onDeleteReport}
        onDeleteAllReports={onDeleteAllReports}
      />
    </div>
  );
}
