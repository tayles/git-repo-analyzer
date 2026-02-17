import { analyzeGitRepository } from '@git-repo-analyzer/core';
import { useAnalysisStore } from '@git-repo-analyzer/store';
import {
  SidePanelHomePage,
  SidePanelLoadingPage,
  SidePanelRepoDetailsPage,
  ThemeToggle,
} from '@git-repo-analyzer/ui';
import { useCallback, useEffect, useRef } from 'react';

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

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleAnalyze = useCallback(
    async (repo: string) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        startAnalysis(repo);
        const result = await analyzeGitRepository(repo, {
          signal: controller.signal,
          onProgress: updateProgress,
        });
        completeAnalysis(result);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
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
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
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
      <SidePanelLoadingPage
        repo={currentRepository || ''}
        progress={progress?.message || 'Starting analysis...'}
        onCancel={handleCancel}
      />
    );
  }

  if (result && !error) {
    return (
      <SidePanelRepoDetailsPage report={result} onBack={handleBack} onRefresh={handleRefresh} />
    );
  }

  return (
    <main className="bg-background min-h-screen">
      {isLoading ? (
        <SidePanelLoadingPage
          repo={currentRepository || ''}
          progress={progress?.message || 'Starting analysis...'}
          onCancel={handleCancel}
        />
      ) : result ? (
        <SidePanelRepoDetailsPage report={result} onBack={handleBack} onRefresh={handleRefresh} />
      ) : (
        <SidePanelHomePage
          repo={currentRepository || ''}
          errorMsg={error}
          history={history}
          onAnalyze={handleAnalyze}
          onDeleteReport={handleDeleteReport}
          onDeleteAllReports={handleClearHistory}
        />
      )}

      <ThemeToggle />
    </main>
  );
}
