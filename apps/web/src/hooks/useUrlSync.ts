import { useEffect, useRef } from 'react';

export interface UseUrlSyncOptions {
  currentRepository: string | null;
  onAnalyze: (repo: string) => void;
}

export function useUrlSync(options: UseUrlSyncOptions): void {
  const { currentRepository, onAnalyze } = options;
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

  // Write URL when state changes
  useEffect(() => {
    // Skip if we're handling initial URL read
    if (!hasReadInitialUrl.current) return;

    let newUrl = '/';

    // Determine what URL should be based on state
    if (currentRepository) {
      // Loading
      const repo = encodeURIComponent(currentRepository);
      newUrl = `/?repo=${repo}`;
    }
    // else: home page, newUrl = '/'

    // Only update if URL actually changed
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [currentRepository]);
}
