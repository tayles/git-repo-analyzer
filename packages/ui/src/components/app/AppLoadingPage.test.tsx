import { afterEach, describe, expect, it, mock } from 'bun:test';

import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import { AppLoadingPage } from './AppLoadingPage';

describe('AppLoadingPage', () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    repo: 'vercel/next.js',
    progressMessage: 'Collecting stats...',
    progressValue: 65,
    onCancel: mock(() => {}),
  };

  it('renders the repo name', () => {
    render(<AppLoadingPage {...defaultProps} />);

    expect(screen.getByText('Analyzing vercel/next.js...')).toBeDefined();
  });

  it('renders the progress message', () => {
    render(<AppLoadingPage {...defaultProps} />);

    expect(screen.getByText('Collecting stats...')).toBeDefined();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = mock(() => {});
    render(<AppLoadingPage {...defaultProps} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Cancel Analysis'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
