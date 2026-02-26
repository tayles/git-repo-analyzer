import { afterEach, describe, expect, it, mock } from 'bun:test';

import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import { SidePanelLoadingPage } from './SidePanelLoadingPage';

describe('SidePanelLoadingPage', () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    repo: 'facebook/docusaurus',
    progressMessage: 'Analyzing commits...',
    progressValue: 30,
    onCancel: mock(() => {}),
  };

  it('renders the repo name', () => {
    render(<SidePanelLoadingPage {...defaultProps} />);

    expect(screen.getByText('Analyzing facebook/docusaurus...')).toBeDefined();
  });

  it('renders the progress message', () => {
    render(<SidePanelLoadingPage {...defaultProps} />);

    expect(screen.getByText('Analyzing commits...')).toBeDefined();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = mock(() => {});
    render(<SidePanelLoadingPage {...defaultProps} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Cancel Analysis'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
