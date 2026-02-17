import type { AnalysisResult } from '@git-repo-analyzer/core';

import { Trash } from 'lucide-react';

import { AnalysisReportCard } from './AnalysisReportCard';
import { GettingStartedPlaceholder } from './GettingStartedPlaceholder';
import { InputForm } from './InputForm';
import { Button } from './ui/button';
import { ErrorAlert } from './ErrorAlert';

interface HomeLayoutProps {
  repo: string;
  errorMsg: string | null;
  history: AnalysisResult[];
  onAnalyze: (repo: string) => void;
  onDeleteReport: (repo: string) => void;
  onDeleteAllReports: () => void;
}

export function HomeLayout({
  repo,
  errorMsg,
  history = [],
  onAnalyze,
  onDeleteReport,
  onDeleteAllReports,
}: HomeLayoutProps) {
  return (
    <div className="flex flex-col items-stretch justify-start gap-12">
      <InputForm repo={repo} onAnalyze={onAnalyze} />

      {errorMsg && <ErrorAlert message={errorMsg} />}

      <GettingStartedPlaceholder onSelectExample={repo => onAnalyze(repo)} />

      {history.length > 0 && (
        <section className="flex flex-col gap-4  max-w-5xl mx-auto">
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
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
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
