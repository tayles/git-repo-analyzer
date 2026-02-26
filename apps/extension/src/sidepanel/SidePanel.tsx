import { analyzeGitRepository } from '@git-repo-analyzer/core';
import { useAnalysisStore } from '@git-repo-analyzer/store';
import {
  SidePanelHomePage,
  SidePanelLoadingPage,
  SidePanelRepoDetailsPage,
  ThemeToggle,
  TooltipProvider,
} from '@git-repo-analyzer/ui';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const [token, setToken] = useState('');
  const [isTokenSectionOpen, setIsTokenSectionOpen] = useState(false);

  const handleAnalyze = useCallback(
    async (repo: string, useCache = true) => {
      abortControllerRef.current?.abort();

      const usedCache = startAnalysis(repo, useCache);
      if (usedCache) return;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const result = await analyzeGitRepository(repo, {
          token,
          signal: controller.signal,
          onProgress: updateProgress,
        });
        completeAnalysis(result);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Analysis failed');
      }
    },
    [startAnalysis, updateProgress, completeAnalysis, setError, token],
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
      void handleAnalyze(currentRepository, false);
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

  // Scroll to top on page change
  const currentPage = isLoading ? 'loading' : result && !error ? 'details' : 'home';
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  // View routing based on store state
  if (isLoading) {
    return (
      <SidePanelLoadingPage
        repo={currentRepository || ''}
        progressMessage={progress?.message || 'Starting analysis...'}
        progressValue={progress?.progress ?? 0}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <TooltipProvider>
      <main className="bg-background min-h-screen">
        {isLoading ? (
          <SidePanelLoadingPage
            repo={currentRepository || ''}
            progressMessage={progress?.message || 'Starting analysis...'}
            progressValue={progress?.progress ?? 0}
            onCancel={handleCancel}
          />
        ) : result && !error ? (
          <SidePanelRepoDetailsPage report={result} onBack={handleBack} onRefresh={handleRefresh} />
        ) : (
          <SidePanelHomePage
            repo={currentRepository || ''}
            errorMsg={error}
            history={history}
            token={token}
            isTokenSectionOpen={isTokenSectionOpen}
            onAnalyze={handleAnalyze}
            onDeleteReport={handleDeleteReport}
            onDeleteAllReports={handleClearHistory}
            onTokenChange={setToken}
            onTokenSectionOpenChange={setIsTokenSectionOpen}
          />
        )}

        <ThemeToggle />
      </main>
    </TooltipProvider>
  );
}
