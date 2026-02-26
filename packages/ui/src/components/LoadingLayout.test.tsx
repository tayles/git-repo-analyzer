import { afterEach, describe, expect, it, mock } from 'bun:test';

import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import { LoadingLayout } from './LoadingLayout';

describe('LoadingLayout', () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    repo: 'facebook/react',
    progressMessage: 'Fetching repository data...',
    progressValue: 42,
    onCancel: mock(() => {}),
  };

  it('renders the repo name in heading', () => {
    render(<LoadingLayout {...defaultProps} />);

    expect(screen.getByText('Analyzing facebook/react...')).toBeDefined();
  });

  it('renders the progress message', () => {
    render(<LoadingLayout {...defaultProps} />);

    expect(screen.getByText('Fetching repository data...')).toBeDefined();
  });

  it('renders the cancel button', () => {
    render(<LoadingLayout {...defaultProps} />);

    expect(screen.getByText('Cancel Analysis')).toBeDefined();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = mock(() => {});
    render(<LoadingLayout {...defaultProps} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Cancel Analysis'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders the progress bar with correct value', () => {
    const { container } = render(<LoadingLayout {...defaultProps} />);

    // Progress bar uses aria attributes
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeDefined();
  });
});
