import { describe, expect, it, beforeEach } from 'bun:test';
import { useAnalysisStore } from './analysis-store';
import type { AnalysisResult, ProgressUpdate } from '@git-repo-analyzer/core';

describe('useAnalysisStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAnalysisStore.setState({
      currentRepository: null,
      result: null,
      isLoading: false,
      progress: null,
      error: null,
      history: [],
    });
  });

  it('should have correct initial state', () => {
    const state = useAnalysisStore.getState();

    expect(state.currentRepository).toBeNull();
    expect(state.result).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.progress).toBeNull();
    expect(state.error).toBeNull();
    expect(state.history).toEqual([]);
  });

  it('should start analysis correctly', () => {
    const { startAnalysis } = useAnalysisStore.getState();

    startAnalysis('facebook/react');

    const state = useAnalysisStore.getState();
    expect(state.currentRepository).toBe('facebook/react');
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update progress correctly', () => {
    const { updateProgress } = useAnalysisStore.getState();
    const progress: ProgressUpdate = {
      phase: 'fetching',
      progress: 50,
      message: 'Fetching data...',
    };

    updateProgress(progress);

    const state = useAnalysisStore.getState();
    expect(state.progress).toEqual(progress);
  });

  it('should complete analysis and add to history', () => {
    const { startAnalysis, completeAnalysis } = useAnalysisStore.getState();
    const result: AnalysisResult = {
      repository: 'facebook/react',
      analyzedAt: new Date(),
      stats: {
        totalCommits: 1000,
        totalContributors: 100,
        totalFiles: 500,
        totalLinesOfCode: 50000,
        primaryLanguage: 'JavaScript',
        firstCommitDate: new Date(),
        lastCommitDate: new Date(),
      },
      contributors: [],
      languages: [],
      durationMs: 1000,
    };

    startAnalysis('facebook/react');
    completeAnalysis(result);

    const state = useAnalysisStore.getState();
    expect(state.result).toEqual(result);
    expect(state.isLoading).toBe(false);
    expect(state.history).toHaveLength(1);
    expect(state.history[0].repository).toBe('facebook/react');
  });

  it('should set error correctly', () => {
    const { startAnalysis, setError } = useAnalysisStore.getState();

    startAnalysis('invalid/repo');
    setError('Repository not found');

    const state = useAnalysisStore.getState();
    expect(state.error).toBe('Repository not found');
    expect(state.isLoading).toBe(false);
  });

  it('should clear analysis correctly', () => {
    const { startAnalysis, clearAnalysis } = useAnalysisStore.getState();

    startAnalysis('facebook/react');
    clearAnalysis();

    const state = useAnalysisStore.getState();
    expect(state.currentRepository).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('should clear history correctly', () => {
    const { completeAnalysis, clearHistory } = useAnalysisStore.getState();
    const result: AnalysisResult = {
      repository: 'test/repo',
      analyzedAt: new Date(),
      stats: {
        totalCommits: 10,
        totalContributors: 1,
        totalFiles: 5,
        totalLinesOfCode: 500,
        primaryLanguage: 'TypeScript',
        firstCommitDate: new Date(),
        lastCommitDate: new Date(),
      },
      contributors: [],
      languages: [],
      durationMs: 100,
    };

    completeAnalysis(result);
    expect(useAnalysisStore.getState().history).toHaveLength(1);

    clearHistory();
    expect(useAnalysisStore.getState().history).toHaveLength(0);
  });

  it('should remove specific item from history', () => {
    const { completeAnalysis, removeFromHistory } = useAnalysisStore.getState();

    const result1: AnalysisResult = {
      repository: 'repo/one',
      analyzedAt: new Date(),
      stats: {
        totalCommits: 10,
        totalContributors: 1,
        totalFiles: 5,
        totalLinesOfCode: 500,
        primaryLanguage: 'TypeScript',
        firstCommitDate: new Date(),
        lastCommitDate: new Date(),
      },
      contributors: [],
      languages: [],
      durationMs: 100,
    };

    const result2: AnalysisResult = {
      ...result1,
      repository: 'repo/two',
    };

    completeAnalysis(result1);
    completeAnalysis(result2);

    expect(useAnalysisStore.getState().history).toHaveLength(2);

    removeFromHistory('repo/one');

    const state = useAnalysisStore.getState();
    expect(state.history).toHaveLength(1);
    expect(state.history[0].repository).toBe('repo/two');
  });
});
