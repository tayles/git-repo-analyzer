import { analyzeGitRepository } from '@git-repo-analyzer/core';
import { useAnalysisStore } from '@git-repo-analyzer/store';
import {
  AppHomePage,
  AppLoadingPage,
  AppRepoDetailsPage,
} from '@git-repo-analyzer/ui';
import { useCallback } from 'react';

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

  const handleAnalyze = useCallback(async (repo: string) => {
    if (!repo.trim()) return;

    startAnalysis(repo);

    try {
      const analysisResult = await analyzeGitRepository(repo, undefined, updateProgress);
      completeAnalysis(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    }
  }, [startAnalysis, updateProgress, completeAnalysis, setError]);

  const handleCancel = useCallback(() => {
    clearAnalysis();
  }, [clearAnalysis]);

  const handleBack = useCallback(() => {
    clearAnalysis();
  }, [clearAnalysis]);

  const handleRefresh = useCallback(() => {
    if (result) {
      void handleAnalyze(result.basicStats.fullName);
    }
  }, [result, handleAnalyze]);

  const handleDeleteReport = useCallback((repo: string) => {
    removeFromHistory(repo);
    if (result?.basicStats.fullName === repo) {
      handleBack();
    }
  }, [result, handleBack, removeFromHistory]);

  return (
    <main className="bg-background min-h-screen">
      {isLoading ? (
        <AppLoadingPage
          repo={currentRepository || ''}
          progress={progress?.message || 'Starting analysis...'}
          onCancel={handleCancel}
        />
      ) : result ? (
        <AppRepoDetailsPage
          report={result}
          onBack={handleBack}
          onRefresh={handleRefresh}
        />
      ) : (
        <AppHomePage
          repo={currentRepository || ''}
          errorMsg={error}
          history={history}
          onAnalyze={handleAnalyze}
          onDeleteReport={handleDeleteReport}
          onDeleteAllReports={clearHistory}
        />
      )}
    </main>
  );
}

export default App;
