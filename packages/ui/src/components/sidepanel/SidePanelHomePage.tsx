import type { AnalysisResult } from '@git-repo-analyzer/core';

import { HomeLayout } from '../HomeLayout';

interface SidePanelHomePageProps {
  repo: string;
  errorMsg: string | null;
  history: AnalysisResult[];
  onAnalyze: (repo: string) => void;
  onDeleteReport: (repo: string) => void;
  onDeleteAllReports: () => void;
}

export function SidePanelHomePage({
  repo,
  errorMsg,
  history = [],
  onAnalyze,
  onDeleteReport,
  onDeleteAllReports,
}: SidePanelHomePageProps) {
  return (
    <div className="flex h-full flex-col items-stretch justify-start gap-12 p-4 pt-12">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">Git Repo Analyzer</h1>
        <p className="text-muted-foreground text-sm">
          Analyze your GitHub repository with AI-powered insights
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
