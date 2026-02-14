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
  CardFooter,
  InputForm,
} from '@git-repo-analyzer/ui';
import { useState } from 'react';

function App() {
  const [repository, setRepository] = useState('');
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

  const handleAnalyze = async () => {
    if (!repository.trim()) return;

    startAnalysis(repository);

    try {
      const analysisResult = await analyzeGitRepository(repository, undefined, updateProgress);
      completeAnalysis(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    }
  };

  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Git Repo Analyzer</h1>
          <p className="text-muted-foreground mt-2">
            Analyze GitHub repositories and get comprehensive statistics
          </p>
        </div>

        <InputForm/>

        <Card>
          <CardHeader>
            <CardTitle>Analyze Repository</CardTitle>
            <CardDescription>Enter a GitHub repository URL or owner/repo format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., facebook/react or https://github.com/facebook/react"
                value={repository}
                onChange={e => setRepository(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                disabled={isLoading}
              />
              <Button onClick={handleAnalyze} disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>

            {progress && (
              <div className="bg-muted rounded-md p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>{progress.message}</span>
                  <span className="font-medium">{progress.progress}%</span>
                </div>
                <div className="bg-secondary mt-2 h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-4">{error}</div>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>{result.repository}</CardTitle>
              <CardDescription>Analyzed on {result.analyzedAt.toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Total Commits</p>
                  <p className="text-2xl font-bold">{result.stats.totalCommits.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Contributors</p>
                  <p className="text-2xl font-bold">
                    {result.stats.totalContributors.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Files</p>
                  <p className="text-2xl font-bold">{result.stats.totalFiles.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Lines of Code</p>
                  <p className="text-2xl font-bold">
                    {result.stats.totalLinesOfCode.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold">Languages</h3>
                <div className="mt-2 space-y-2">
                  {result.languages.map(lang => (
                    <div key={lang.language} className="flex items-center gap-2">
                      <div className="w-24 text-sm">{lang.language}</div>
                      <div className="flex-1">
                        <div className="bg-secondary h-2 overflow-hidden rounded-full">
                          <div
                            className="bg-primary h-full"
                            style={{ width: `${lang.percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-muted-foreground w-12 text-right text-sm">
                        {lang.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-muted-foreground text-sm">
              Analysis completed in {result.durationMs}ms
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;
