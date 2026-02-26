import { afterEach, describe, expect, it, mock } from 'bun:test';

import { cleanup, render, screen } from '@testing-library/react';

import { SidePanelHomePage } from './SidePanelHomePage';

describe('SidePanelHomePage', () => {
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

  it('renders the title', () => {
    render(<SidePanelHomePage {...defaultProps} />);

    expect(screen.getByText('Git Repo Analyzer')).toBeDefined();
  });

  it('renders the description', () => {
    render(<SidePanelHomePage {...defaultProps} />);

    expect(
      screen.getByText('View the tech stack, health and other insights of any GitHub repository'),
    ).toBeDefined();
  });

  it('renders the input form', () => {
    render(<SidePanelHomePage {...defaultProps} />);

    expect(screen.getByText('Analyze Now')).toBeDefined();
  });

  it('renders error when errorMsg is provided', () => {
    render(<SidePanelHomePage {...defaultProps} errorMsg="API error" />);

    expect(screen.getByText('Analysis Failed')).toBeDefined();
    expect(screen.getByText('API error')).toBeDefined();
  });
});
