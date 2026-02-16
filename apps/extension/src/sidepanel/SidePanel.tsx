import { analyzeGitRepository } from '@git-repo-analyzer/core';
import { useAnalysisStore } from '@git-repo-analyzer/store';
import {
  SidePanelHome,
  SidePanelAnalysisInProgress,
  SidePanelRepoDetails,
} from '@git-repo-analyzer/ui';
import { useCallback, useEffect } from 'react';

export default function SidePanel() {
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

  const handleAnalyze = useCallback(
    async (repo: string) => {
      try {
        startAnalysis(repo);
        const result = await analyzeGitRepository(repo, undefined, updateProgress);
        completeAnalysis(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Analysis failed');
      }
    },
    [startAnalysis, updateProgress, completeAnalysis, setError],
  );

  // Auto-detect GitHub repository from active tab on mount
  useEffect(() => {
    console.log('SidePanel mounted, detecting active tab...');
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      console.log('Active tabs:', tabs);
      const tab = tabs[0];
      if (tab?.url) {
        // Extract repo: match github.com/owner/repo pattern
        const match = tab.url.match(/github\.com\/([^/]+\/[^/]+)/);
        if (match) {
          const repo = match[1].split('/').slice(0, 2).join('/');
          void handleAnalyze(repo);
        }
      }
    });
  }, [handleAnalyze]); // Only run on mount

  useEffect(() => {
    // Listen for messages from background script (e.g., when side panel is opened)
    const handleMessage = (message: any) => {
      console.log('Received message in side panel:', message);
      if (message.url) {
        // Extract repo: match github.com/owner/repo pattern
        const match = message.url.match(/github\.com\/([^/]+\/[^/]+)/);
        if (match) {
          const repo = match[1].split('/').slice(0, 2).join('/');
          void handleAnalyze(repo);
        }
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [handleAnalyze]);

  const handleCancel = useCallback(() => {
    clearAnalysis();
  }, [clearAnalysis]);

  const handleBack = useCallback(() => {
    clearAnalysis();
  }, [clearAnalysis]);

  const handleRefresh = useCallback(() => {
    if (currentRepository) {
      void handleAnalyze(currentRepository);
    }
  }, [currentRepository, handleAnalyze]);

  const handleDeleteReport = useCallback(
    (repo: string) => {
      removeFromHistory(repo);
    },
    [removeFromHistory],
  );

  const handleClearHistory = useCallback(() => {
    clearHistory();
  }, [clearHistory]);

  // View routing based on store state
  if (isLoading) {
    return (
      <SidePanelAnalysisInProgress
        repo={currentRepository || ''}
        progress={progress?.message || 'Starting analysis...'}
        onCancel={handleCancel}
      />
    );
  }

  if (result && !error) {
    return <SidePanelRepoDetails report={result} onBack={handleBack} onRefresh={handleRefresh} />;
  }

  return (
    <SidePanelHome
      repo={currentRepository || ''}
      errorMsg={error}
      history={history}
      onAnalyze={handleAnalyze}
      onDeleteReport={handleDeleteReport}
      onDeleteAllReports={handleClearHistory}
    />
  );
}
