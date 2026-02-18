import type { AnalysisResult } from '@git-repo-analyzer/core';

import { HomeLayout } from '../HomeLayout';

interface SidePanelHomePageProps {
  repo: string;
  errorMsg: string | null;
  history: AnalysisResult[];
  token: string;
  isTokenSectionOpen: boolean;
  onAnalyze: (repo: string) => void;
  onDeleteReport: (repo: string) => void;
  onDeleteAllReports: () => void;
  onTokenChange: (token: string) => void;
  onTokenSectionOpenChange: (open: boolean) => void;
}

export function SidePanelHomePage({
  repo,
  errorMsg,
  history = [],
  token,
  isTokenSectionOpen,
  onAnalyze,
  onDeleteReport,
  onDeleteAllReports,
  onTokenChange,
  onTokenSectionOpenChange,
}: SidePanelHomePageProps) {
  return (
    <div className="flex h-full flex-col items-stretch justify-start gap-12 p-4 pt-12">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">Git Repo Analyzer</h1>
        <p className="text-muted-foreground text-sm">
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
