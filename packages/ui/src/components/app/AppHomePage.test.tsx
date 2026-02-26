import { afterEach, describe, expect, it, mock } from 'bun:test';

import { cleanup, render, screen } from '@testing-library/react';

import { AppHomePage } from './AppHomePage';

describe('AppHomePage', () => {
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
    onCancel: mock(() => {}),
    onTokenChange: mock(() => {}),
    onTokenSectionOpenChange: mock(() => {}),
  };

  it('renders the app header', () => {
    render(<AppHomePage {...defaultProps} />);

    expect(screen.getByText('Git Repo Analyzer')).toBeDefined();
  });

  it('renders the description text', () => {
    render(<AppHomePage {...defaultProps} />);

    expect(
      screen.getByText('View the tech stack, health and other insights of any GitHub repository'),
    ).toBeDefined();
  });

  it('renders the input form', () => {
    render(<AppHomePage {...defaultProps} />);

    expect(screen.getByText('Analyze Now')).toBeDefined();
  });

  it('renders error when errorMsg is provided', () => {
    render(<AppHomePage {...defaultProps} errorMsg="Not found" />);

    expect(screen.getByText('Analysis Failed')).toBeDefined();
    expect(screen.getByText('Not found')).toBeDefined();
  });
});
