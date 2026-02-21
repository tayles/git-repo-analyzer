import type { AnalysisResult, ProgressUpdate } from '@git-repo-analyzer/core';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * State for the analysis store
 */
export interface AnalysisState {
  /** Currently analyzed repository (if any) */
  currentRepository: string | null;
  /** Current analysis result */
  result: AnalysisResult | null;
  /** Whether an analysis is in progress */
  isLoading: boolean;
  /** Current progress update */
  progress: ProgressUpdate | null;
  /** Error message if analysis failed */
  error: string | null;
  /** History of previously analyzed repositories */
  history: AnalysisResult[];
}

/**
 * Actions for the analysis store
 */
export interface AnalysisActions {
  /** Start analyzing a repository */
  startAnalysis: (repository: string, useCache?: boolean) => boolean;
  /** Update progress during analysis */
  updateProgress: (progress: ProgressUpdate) => void;
  /** Complete analysis with result */
  completeAnalysis: (result: AnalysisResult) => void;
  /** Set error state */
  setError: (error: string) => void;
  /** Clear current analysis */
  clearAnalysis: () => void;
  /** Clear all history */
  clearHistory: () => void;
  /** Remove a specific item from history */
  removeFromHistory: (repository: string) => void;
}

export type AnalysisStore = AnalysisState & AnalysisActions;

/**
 * Initial state for the analysis store
 */
const initialState: AnalysisState = {
  currentRepository: null,
  result: null,
  isLoading: false,
  progress: null,
  error: null,
  history: [],
};

/**
 * Create the analysis store with persistence
 */
export const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startAnalysis: (repository: string, useCache = true) => {
        if (useCache) {
          const { history } = get();
          const cached = history.find(item => item.basicStats.fullName === repository);
          if (cached) {
            const filteredHistory = history.filter(item => item.basicStats.fullName !== repository);
            set({
              currentRepository: repository,
              result: cached,
              isLoading: false,
              progress: null,
              error: null,
              history: [cached, ...filteredHistory].slice(0, 10),
            });
            return true;
          }
        }
        set({
          currentRepository: repository,
          result: null,
          isLoading: true,
          progress: null,
          error: null,
        });
        return false;
      },

      updateProgress: (progress: ProgressUpdate) => {
        set({ progress });
      },

      completeAnalysis: (result: AnalysisResult) => {
        const { history } = get();
        // Remove existing entry for same repository if exists
        const filteredHistory = history.filter(
          item => item.basicStats.fullName !== result.basicStats.fullName,
        );

        // Add new result to beginning of history
        set({
          result,
          isLoading: false,
          progress: null,
          history: [result, ...filteredHistory].slice(0, 10), // Keep last 10
        });
      },

      setError: (error: string) => {
        set({
          error,
          isLoading: false,
          progress: null,
        });
      },

      clearAnalysis: () => {
        set({
          currentRepository: null,
          result: null,
          isLoading: false,
          progress: null,
          error: null,
        });
      },

      clearHistory: () => {
        set({ history: [] });
      },

      removeFromHistory: (repository: string) => {
        const { history } = get();
        set({
          history: history.filter(item => item.basicStats.fullName !== repository),
        });
      },
    }),
    {
      name: 'git-repo-analyzer-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        history: state.history,
      }),
    },
  ),
);

/**
 * Selector for getting loading state
 */
export const selectIsLoading = (state: AnalysisStore) => state.isLoading;

/**
 * Selector for getting current result
 */
export const selectResult = (state: AnalysisStore) => state.result;

/**
 * Selector for getting error
 */
export const selectError = (state: AnalysisStore) => state.error;

/**
 * Selector for getting progress
 */
export const selectProgress = (state: AnalysisStore) => state.progress;

/**
 * Selector for getting history
 */
export const selectHistory = (state: AnalysisStore) => state.history;
