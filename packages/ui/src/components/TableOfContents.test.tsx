import { describe, expect, it } from 'bun:test';

import { render, screen } from '@testing-library/react';

import type { TocItem } from './TableOfContents';
import { TableOfContents } from './TableOfContents';

describe('TableOfContents', () => {
  const items: TocItem[] = [
    { id: 'tech-stack', label: 'Tech Stack' },
    { id: 'activity', label: 'Activity' },
    { id: 'health', label: 'Health' },
  ];

  it('renders all items as buttons', () => {
    render(<TableOfContents items={items} />);

    expect(screen.getByText('Tech Stack')).toBeDefined();
    expect(screen.getByText('Activity')).toBeDefined();
    expect(screen.getByText('Health')).toBeDefined();
  });

  it('renders a nav element with aria label', () => {
    const { container } = render(<TableOfContents items={items} />);

    const nav = container.querySelector('nav[aria-label="Table of contents"]');
    expect(nav).toBeDefined();
  });

  it('renders correct number of buttons', () => {
    const { container } = render(<TableOfContents items={items} />);

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(3);
  });

  it('highlights the first item by default', () => {
    const { container } = render(<TableOfContents items={items} />);

    const buttons = container.querySelectorAll('button');
    // First item should have active styling
    expect(buttons[0]?.className).toContain('bg-muted');
  });

  it('renders empty when no items', () => {
    const { container } = render(<TableOfContents items={[]} />);

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(0);
  });
});
