import { renderHook } from '@testing-library/react';
import { describe, expect, it, beforeEach, mock } from 'bun:test';

describe('useUrlSync', () => {
  beforeEach(() => {
    // Reset URL
    window.history.replaceState(null, '', '/');
  });

  it('should be defined', () => {
    // Initial placeholder test
    expect(true).toBe(true);
  });

  it('should call onAnalyze when repo param exists on mount', async () => {
    // Set URL with repo param
    window.history.replaceState(null, '', '/?repo=facebook/react');

    const onAnalyze = mock(() => {});
    const options = {
      currentRepository: null,
      onAnalyze,
    };

    // Import will happen after we create the hook
    const { useUrlSync } = await import('./useUrlSync');
    renderHook(() => useUrlSync(options));

    expect(onAnalyze).toHaveBeenCalledTimes(1);
    expect(onAnalyze).toHaveBeenCalledWith('facebook/react');
  });

  it('should not call onAnalyze when no repo param on mount', async () => {
    const onAnalyze = mock(() => {});
    const options = {
      currentRepository: null,
      onAnalyze,
    };

    const { useUrlSync } = await import('./useUrlSync');
    renderHook(() => useUrlSync(options));

    expect(onAnalyze).not.toHaveBeenCalled();
  });

  it('should decode URI component in repo param', async () => {
    window.history.replaceState(null, '', '/?repo=facebook%2Freact');

    const onAnalyze = mock(() => {});
    const options = {
      currentRepository: null,
      onAnalyze,
    };

    const { useUrlSync } = await import('./useUrlSync');
    renderHook(() => useUrlSync(options));

    expect(onAnalyze).toHaveBeenCalledWith('facebook/react');
  });

  it('should clear URL when returning to home', async () => {
    window.history.replaceState(null, '', '/?repo=facebook/react');

    const onAnalyze = mock(() => {});

    const { useUrlSync } = await import('./useUrlSync');
    const { rerender } = renderHook(props => useUrlSync(props), {
      initialProps: {
        currentRepository: 'facebook/react' as string | null,
        onAnalyze,
      },
    });

    rerender({
      currentRepository: null,
      onAnalyze,
    });

    expect(window.location.search).toBe('');
  });

  it('should not trigger onAnalyze when URL is updated by the hook itself', async () => {
    const onAnalyze = mock(() => {});

    const { useUrlSync } = await import('./useUrlSync');
    renderHook(props => useUrlSync(props), {
      initialProps: {
        currentRepository: 'facebook/react',
        onAnalyze,
      },
    });

    expect(onAnalyze).toHaveBeenCalledTimes(0);
  });
});
