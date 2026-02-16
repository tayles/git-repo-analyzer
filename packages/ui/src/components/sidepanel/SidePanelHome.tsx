import type { AnalysisResult } from '@git-repo-analyzer/core';

import { Trash } from 'lucide-react';

import { AnalysisReportCard } from '../AnalysisReportCard';
import { GettingStartedPlaceholder } from '../GettingStartedPlaceholder';
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
    <div className="flex h-full flex-col items-stretch justify-start gap-12 p-4 pt-12">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">Git Repo Analyzer</h1>
        <p className="text-muted-foreground text-sm">
          Analyze your GitHub repository with AI-powered insights
        </p>
      </div>

      <InputForm repo={repo} onAnalyze={onAnalyze} />

      {errorMsg && <div className="text-destructive text-sm">{errorMsg}</div>}

      {history.length === 0 ? (
        <GettingStartedPlaceholder onSelectExample={repo => onAnalyze(repo)} />
      ) : (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-md font-semibold">Previous Reports</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:bg-red-100 hover:text-red-600"
              onClick={onDeleteAllReports}
            >
              <Trash />
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {history.map((result, index) => (
              <AnalysisReportCard
                key={index}
                report={result}
                onClick={() => onAnalyze(result.basicStats.fullName)}
                onDelete={onDeleteReport}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
