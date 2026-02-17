import { analyzeGitRepository } from '@git-repo-analyzer/core';
import { useAnalysisStore } from '@git-repo-analyzer/store';
import {
  AppHomePage,
  AppLoadingPage,
  AppRepoDetailsPage,
  ThemeToggle,
} from '@git-repo-analyzer/ui';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useRef } from 'react';

import { useUrlSync } from './hooks';

function App() {
  const currentRepository = useAnalysisStore(state => state.currentRepository);
  const result = useAnalysisStore(state => state.result);
  const isLoading = useAnalysisStore(state => state.isLoading);
  const progress = useAnalysisStore(state => state.progress);
  const error = useAnalysisStore(state => state.error);
  const history = useAnalysisStore(state => state.history);
  const startAnalysis = useAnalysisStore(state => state.startAnalysis);
  const updateProgress = useAnalysisStore(state => state.updateProgress);
  const completeAnalysis = useAnalysisStore(state => state.completeAnalysis);
  const setError = useAnalysisStore(state => state.setError);
  const clearAnalysis = useAnalysisStore(state => state.clearAnalysis);
  const clearHistory = useAnalysisStore(state => state.clearHistory);
  const removeFromHistory = useAnalysisStore(state => state.removeFromHistory);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleAnalyze = useCallback(
    async (repo: string, useCache = true) => {
      if (!repo.trim()) return;

      abortControllerRef.current?.abort();

      const usedCache = startAnalysis(repo, useCache);
      if (usedCache) return;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const analysisResult = await analyzeGitRepository(repo, {
          signal: controller.signal,
          onProgress: updateProgress,
        });
        completeAnalysis(analysisResult);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Analysis failed');
      }
    },
    [startAnalysis, updateProgress, completeAnalysis, setError],
  );

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    clearAnalysis();
  }, [clearAnalysis]);

  const handleBack = useCallback(() => {
    clearAnalysis();
  }, [clearAnalysis]);

  const handleRefresh = useCallback(() => {
    if (result) {
      void handleAnalyze(result.basicStats.fullName, false);
    }
  }, [result, handleAnalyze]);

  const handleDeleteReport = useCallback(
    (repo: string) => {
      removeFromHistory(repo);
      if (result?.basicStats.fullName === repo) {
        handleBack();
      }
    },
    [result, handleBack, removeFromHistory],
  );

  // Sync URL with state
  useUrlSync({ currentRepository, onAnalyze: handleAnalyze });

  return (
    <main className="bg-background min-h-screen">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <AppLoadingPage
              repo={currentRepository || ''}
              progressMessage={progress?.message || 'Starting analysis...'}
              progressValue={progress?.progress ?? 0}
              onCancel={handleCancel}
            />
          </motion.div>
        ) : result ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <AppRepoDetailsPage report={result} onBack={handleBack} onRefresh={handleRefresh} />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <AppHomePage
              repo={currentRepository || ''}
              errorMsg={error}
              history={history}
              onAnalyze={handleAnalyze}
              onDeleteReport={handleDeleteReport}
              onDeleteAllReports={clearHistory}
              onCancel={handleCancel}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <ThemeToggle />
    </main>
  );
}

export default App;
