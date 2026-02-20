import type { AnalysisResult } from '@git-repo-analyzer/core';
import { Trash } from 'lucide-react';
import { motion } from 'motion/react';

import { AnalysisReportCard } from './AnalysisReportCard';
import { ErrorAlert } from './ErrorAlert';
import { GettingStartedPlaceholder } from './GettingStartedPlaceholder';
import { InputForm } from './InputForm';
import { Button } from './ui/button';

interface HomeLayoutProps {
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

export function HomeLayout({
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
}: HomeLayoutProps) {
  const hasErrorThatMayRequireToken = errorMsg?.includes('Access Token') ?? false;

  const expandedTokenSection = isTokenSectionOpen || hasErrorThatMayRequireToken;

  return (
    <div className="flex flex-col items-stretch justify-start gap-12">
      {errorMsg && <ErrorAlert message={errorMsg} />}

      <InputForm
        repo={repo}
        token={token}
        isTokenSectionOpen={expandedTokenSection}
        onAnalyze={onAnalyze}
        onTokenChange={onTokenChange}
        onTokenSectionOpenChange={onTokenSectionOpenChange}
      />

      <GettingStartedPlaceholder onSelectExample={repo => onAnalyze(repo)} />

      {history.length > 0 && (
        <section className="mx-auto flex max-w-5xl flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-md font-semibold select-text">Previous Reports</h2>
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
              <motion.div
                key={result.basicStats.fullName}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <AnalysisReportCard
                  report={result}
                  onClick={() => onAnalyze(result.basicStats.fullName)}
                  onDelete={onDeleteReport}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
