import { describe, expect, it, beforeEach } from 'bun:test';

import type { AnalysisResult, ProgressUpdate } from '@git-repo-analyzer/core';
import { mockResult } from '@git-repo-analyzer/mocks';

import { useAnalysisStore } from './analysis-store';

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
    const result: AnalysisResult = mockResult;

    startAnalysis('facebook/react');
    completeAnalysis(result);

    const state = useAnalysisStore.getState();
    expect(state.result).toEqual(result);
    expect(state.isLoading).toBe(false);
    expect(state.history).toHaveLength(1);
    expect(state.history[0].basicStats.fullName).toBe('facebook/react');
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
    const result: AnalysisResult = mockResult;

    completeAnalysis(result);
    expect(useAnalysisStore.getState().history).toHaveLength(1);

    clearHistory();
    expect(useAnalysisStore.getState().history).toHaveLength(0);
  });

  it('should remove specific item from history', () => {
    const { completeAnalysis, removeFromHistory } = useAnalysisStore.getState();

    const result1: AnalysisResult = mockResult;

    const result2: AnalysisResult = {
      ...result1,
      basicStats: {
        ...result1.basicStats,
        fullName: 'repo/two',
      },
    };

    completeAnalysis(result1);
    completeAnalysis(result2);

    expect(useAnalysisStore.getState().history).toHaveLength(2);

    removeFromHistory('facebook/react');

    const state = useAnalysisStore.getState();
    expect(state.history).toHaveLength(1);
    expect(state.history[0].basicStats.fullName).toBe('repo/two');
  });
});
