import type { AnalysisResult } from '@git-repo-analyzer/core';
import { useEffect, useRef } from 'react';

interface UseUrlSyncOptions {
  currentRepository: string | null;
  result: AnalysisResult | null;
  isLoading: boolean;
  onAnalyze: (repo: string) => void;
}

export function useUrlSync(options: UseUrlSyncOptions): void {
  const { onAnalyze } = options;
  const hasReadInitialUrl = useRef(false);

  // Read URL param on mount
  useEffect(() => {
    if (hasReadInitialUrl.current) return;
    hasReadInitialUrl.current = true;

    const params = new URLSearchParams(window.location.search);
    const repoParam = params.get('repo');

    if (repoParam && repoParam.trim()) {
      const decodedRepo = decodeURIComponent(repoParam);
      onAnalyze(decodedRepo);
    }
  }, [onAnalyze]);
}
