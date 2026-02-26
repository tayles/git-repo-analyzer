import { describe, expect, it, beforeEach } from 'bun:test';

import { useAnalysisStore } from '@git-repo-analyzer/store';
import { render, screen } from '@testing-library/react';

import App from './App';

// Reset the store before each test
beforeEach(() => {
  useAnalysisStore.setState({
    currentRepository: null,
    result: null,
    isLoading: false,
    progress: null,
    error: null,
    history: [],
  });
  // Reset the URL
  window.history.replaceState(null, '', '/');
});

describe('App', () => {
  it('renders the home page by default', () => {
    render(<App />);

    expect(screen.getByText('Git Repo Analyzer')).toBeDefined();
    expect(screen.getByText('Analyze Now')).toBeDefined();
  });

  it('renders the loading page when isLoading is true', () => {
    useAnalysisStore.setState({
      isLoading: true,
      currentRepository: 'facebook/react',
      progress: { message: 'Fetching data...', progress: 50, phase: 'fetching' },
    });

    render(<App />);

    expect(screen.getByText('Analyzing facebook/react...')).toBeDefined();
    expect(screen.getByText('Fetching data...')).toBeDefined();
  });

  it('renders the loading page with default message when no progress', () => {
    useAnalysisStore.setState({
      isLoading: true,
      currentRepository: 'facebook/react',
      progress: null,
    });

    render(<App />);

    expect(screen.getByText('Starting analysis...')).toBeDefined();
  });

  it('shows error on home page when error is set', () => {
    useAnalysisStore.setState({
      error: 'Repository not found',
    });

    render(<App />);

    expect(screen.getByText('Analysis Failed')).toBeDefined();
    expect(screen.getByText('Repository not found')).toBeDefined();
  });

  it('renders the getting started examples', () => {
    render(<App />);

    expect(screen.getByText('facebook/react')).toBeDefined();
    expect(screen.getByText('microsoft/vscode')).toBeDefined();
  });
});
