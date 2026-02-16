import type { AnalysisResult } from '@git-repo-analyzer/core';

import { AnalysisReportCard } from '../AnalysisReportCard';
import { InputForm } from '../InputForm';
import { Button } from '../ui/button';

interface SidePanelHomeProps {
  repo: string;
  errorMsg: string | null;
  history: AnalysisResult[];
  onAnalyze: (repo: string) => void;
  onDeleteReport: (repo: string) => void;
  onDeleteAllReports: () => void;
}

export function SidePanelHome({
  repo,
  errorMsg,
  history = [],
  onAnalyze,
  onDeleteReport,
  onDeleteAllReports,
}: SidePanelHomeProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
      <div>
        <h1 className="text-lg font-bold">Git Repo Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze your GitHub repository with AI-powered insights
        </p>
      </div>

      <InputForm onAnalyze={onAnalyze} />

      {errorMsg && <div className="text-destructive text-sm">{errorMsg}</div>}

      <section>
        <h2 className="text-md font-semibold">Previous Reports</h2>

        {history.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            No reports generated yet for {repo}. Start by analyzing your repository to see insights
            and recommendations here.
          </div>
        ) : (
          <div>
            <Button variant="destructive" size="sm" onClick={onDeleteAllReports} className="mb-4">
              Delete All Reports
            </Button>
            {history.map((result, index) => (
              <AnalysisReportCard
                key={index}
                report={result}
                onClick={() => onAnalyze(result.basicStats.fullName)}
                onDelete={onDeleteReport}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
