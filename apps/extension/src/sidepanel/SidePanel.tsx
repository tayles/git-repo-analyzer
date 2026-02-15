import { analyzeGitRepository } from '@git-repo-analyzer/core';
import { useAnalysisStore } from '@git-repo-analyzer/store';
import {
  SidePanelHome,
  SidePanelAnalysisInProgress,
  SidePanelRepoDetails,
} from '@git-repo-analyzer/ui';
import { useEffect } from 'react';

export default function SidePanel() {
  const {
    currentRepository,
    result,
    isLoading,
    progress,
    error,
    history,
    startAnalysis,
    updateProgress,
    completeAnalysis,
    setError,
    clearAnalysis,
    clearHistory,
    removeFromHistory,
  } = useAnalysisStore();

  // Auto-detect GitHub repository from active tab on mount
  useEffect(() => {
    console.log('SidePanel mounted, detecting active tab...');
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      console.log('Active tabs:', tabs);
      const tab = tabs[0];
      if (tab?.url) {
        // Extract repo: match github.com/owner/repo pattern
        const match = tab.url.match(/github\.com\/([^/]+\/[^/]+)/);
        if (match) {
          const repo = match[1].split('/').slice(0, 2).join('/');
          void handleAnalyze(repo);
        } else {
          // Not on GitHub - autofocus input
          setTimeout(() => {
            const input = document.getElementById('repo-input') as HTMLInputElement;
            input?.focus();
          }, 100);
        }
      }
    });
    // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount

  const handleAnalyze = async (repo: string) => {
    try {
      startAnalysis(repo);
      const result = await analyzeGitRepository(repo, undefined, updateProgress);
      completeAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    }
  };

  const handleCancel = () => {
    clearAnalysis();
  };

  const handleBack = () => {
    clearAnalysis();
  };

  const handleRefresh = () => {
    if (currentRepository) {
      void handleAnalyze(currentRepository);
    }
  };

  const handleDeleteReport = (repo: string) => {
    removeFromHistory(repo);
  };

  const handleClearHistory = () => {
    clearHistory();
  };

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
      history={history}
      onAnalyze={handleAnalyze}
      onDeleteReport={handleDeleteReport}
      onDeleteAllReports={handleClearHistory}
    />
  );
}
