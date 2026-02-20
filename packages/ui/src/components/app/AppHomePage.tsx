import type { AnalysisResult } from '@git-repo-analyzer/core';

import { HomeLayout } from '../HomeLayout';
import { AppHeader } from './AppHeader';

interface AppHomePageProps {
  repo: string;
  errorMsg: string | null;
  history: AnalysisResult[];
  token: string;
  isTokenSectionOpen: boolean;
  onAnalyze: (repo: string) => void;
  onDeleteReport: (repo: string) => void;
  onDeleteAllReports: () => void;
  onCancel: () => void;
  onTokenChange: (token: string) => void;
  onTokenSectionOpenChange: (open: boolean) => void;
}

export function AppHomePage({
  repo,
  errorMsg,
  history = [],
  token,
  isTokenSectionOpen,
  onAnalyze,
  onDeleteReport,
  onDeleteAllReports,
  onCancel,
  onTokenChange,
  onTokenSectionOpenChange,
}: AppHomePageProps) {
  return (
    <div className="container mx-auto flex h-full flex-col items-stretch justify-start gap-12 p-4 pt-12">
      <AppHeader onClick={onCancel} />
      <div className="flex flex-col gap-2 text-center">
        <p className="text-muted-foreground text-md select-text">
          View the tech stack, health and other insights of any GitHub repository
        </p>
      </div>

      <HomeLayout
        repo={repo}
        errorMsg={errorMsg}
        history={history}
        token={token}
        isTokenSectionOpen={isTokenSectionOpen}
        onAnalyze={onAnalyze}
        onDeleteReport={onDeleteReport}
        onDeleteAllReports={onDeleteAllReports}
        onTokenChange={onTokenChange}
        onTokenSectionOpenChange={onTokenSectionOpenChange}
      />
    </div>
  );
}
