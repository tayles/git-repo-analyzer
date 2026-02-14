import { useState, useEffect } from 'react';
import { analyzeGitRepository } from '@git-repo-analyzer/core';
import { useAnalysisStore } from '@git-repo-analyzer/store';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@git-repo-analyzer/ui';

function Popup() {
  const [repository, setRepository] = useState('');
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const {
    isLoading,
    result,
    progress,
    error,
    startAnalysis,
    updateProgress,
    completeAnalysis,
    setError,
  } = useAnalysisStore();

  useEffect(() => {
    // Get the current tab URL to auto-fill if on GitHub
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab?.url?.includes('github.com')) {
        const match = tab.url.match(/github\.com\/([^/]+\/[^/]+)/);
        if (match) {
          setRepository(match[1]);
          setCurrentTab(match[1]);
        }
      }
    });
  }, []);

  const handleAnalyze = async () => {
    if (!repository.trim()) return;

    startAnalysis(repository);

    try {
      const analysisResult = await analyzeGitRepository(
        repository,
        undefined,
        updateProgress
      );
      completeAnalysis(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 text-center">
        <h1 className="text-lg font-bold">Git Repo Analyzer</h1>
        {currentTab && (
          <p className="text-xs text-muted-foreground">
            Detected: {currentTab}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="owner/repo"
            value={repository}
            onChange={(e) => setRepository(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            disabled={isLoading}
            className="text-sm"
          />
          <Button onClick={handleAnalyze} disabled={isLoading} size="sm">
            {isLoading ? '...' : 'Go'}
          </Button>
        </div>

        {progress && (
          <div className="rounded-md bg-muted p-2 text-xs">
            <div className="flex items-center justify-between">
              <span>{progress.message}</span>
              <span>{progress.progress}%</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {result && (
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm">{result.repository}</CardTitle>
              <CardDescription className="text-xs">
                {result.stats.primaryLanguage}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Commits</p>
                  <p className="font-semibold">
                    {result.stats.totalCommits.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contributors</p>
                  <p className="font-semibold">
                    {result.stats.totalContributors.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Files</p>
                  <p className="font-semibold">
                    {result.stats.totalFiles.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Lines</p>
                  <p className="font-semibold">
                    {result.stats.totalLinesOfCode.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Popup;
