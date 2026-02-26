import { afterEach, describe, expect, it, mock } from 'bun:test';

import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import { GettingStartedPlaceholder } from './GettingStartedPlaceholder';

describe('GettingStartedPlaceholder', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the getting started text', () => {
    render(<GettingStartedPlaceholder onSelectExample={() => {}} />);

    expect(screen.getByText(/to get started, enter a repository URL above/i)).toBeDefined();
  });

  it('renders example repositories', () => {
    render(<GettingStartedPlaceholder onSelectExample={() => {}} />);

    expect(screen.getByText('facebook/react')).toBeDefined();
    expect(screen.getByText('microsoft/vscode')).toBeDefined();
    expect(screen.getByText('torvalds/linux')).toBeDefined();
    expect(screen.getByText('rust-lang/rust')).toBeDefined();
  });

  it('calls onSelectExample when an example is clicked', () => {
    const onSelectExample = mock(() => {});
    render(<GettingStartedPlaceholder onSelectExample={onSelectExample} />);

    fireEvent.click(screen.getByText('facebook/react'));
    expect(onSelectExample).toHaveBeenCalledWith('facebook/react');
  });

  it('renders all 10 examples', () => {
    const { container } = render(<GettingStartedPlaceholder onSelectExample={() => {}} />);

    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(10);
  });
});
