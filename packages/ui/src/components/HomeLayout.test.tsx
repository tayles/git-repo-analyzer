import { afterEach, describe, expect, it, mock } from 'bun:test';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { cleanup, render, screen } from '@testing-library/react';

import { HomeLayout } from './HomeLayout';

describe('HomeLayout', () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    repo: '',
    errorMsg: null,
    history: [],
    token: '',
    isTokenSectionOpen: false,
    onAnalyze: mock(() => {}),
    onDeleteReport: mock(() => {}),
    onDeleteAllReports: mock(() => {}),
    onTokenChange: mock(() => {}),
    onTokenSectionOpenChange: mock(() => {}),
  };

  it('renders the input form', () => {
    render(<HomeLayout {...defaultProps} />);

    expect(screen.getByLabelText('Repo')).toBeDefined();
    expect(screen.getByText('Analyze Now')).toBeDefined();
  });

  it('renders the getting started placeholder', () => {
    render(<HomeLayout {...defaultProps} />);

    expect(screen.getByText(/to get started, enter a repository URL above/i)).toBeDefined();
  });

  it('renders error alert when errorMsg is provided', () => {
    render(<HomeLayout {...defaultProps} errorMsg="Rate limit exceeded" />);

    expect(screen.getByText('Analysis Failed')).toBeDefined();
    expect(screen.getByText('Rate limit exceeded')).toBeDefined();
  });

  it('does not render error alert when errorMsg is null', () => {
    render(<HomeLayout {...defaultProps} />);

    expect(screen.queryByText('Analysis Failed')).toBeNull();
  });

  it('renders history section when history has items', () => {
    const history = [createMockAnalysisResult()];
    render(<HomeLayout {...defaultProps} history={history} />);

    expect(screen.getByText('Previous Reports')).toBeDefined();
    expect(screen.getByText('Clear All')).toBeDefined();
  });

  it('does not render history section when history is empty', () => {
    render(<HomeLayout {...defaultProps} />);

    expect(screen.queryByText('Previous Reports')).toBeNull();
  });

  it('auto-expands token section when error mentions Access Token', () => {
    const { container } = render(
      <HomeLayout {...defaultProps} errorMsg="Please provide an Access Token to continue" />,
    );

    // The token section should be expanded
    const details = container.querySelector('details');
    expect(details?.open).toBe(true);
  });
});
