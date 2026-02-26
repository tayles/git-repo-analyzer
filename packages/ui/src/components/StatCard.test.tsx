import { describe, expect, it } from 'bun:test';

import { render, screen } from '@testing-library/react';

import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('renders label and string value', () => {
    render(<StatCard label="Language" value="TypeScript" />);

    expect(screen.getByText('Language')).toBeDefined();
    expect(screen.getByText('TypeScript')).toBeDefined();
  });

  it('formats numeric values', () => {
    render(<StatCard label="Stars" value={15234} />);

    expect(screen.getByText('Stars')).toBeDefined();
    // formatNumber formats large numbers with K suffix
    expect(screen.getByText('15.2K')).toBeDefined();
  });

  it('renders an icon when provided', () => {
    const icon = <span data-testid="test-icon">★</span>;
    render(<StatCard label="Rating" value="4.5" icon={icon} />);

    expect(screen.getByTestId('test-icon')).toBeDefined();
  });

  it('wraps in a link when href is provided', () => {
    const { container } = render(<StatCard label="Repo" value="test" href="https://github.com" />);

    const link = container.querySelector('a');
    expect(link).toBeDefined();
    expect(link?.href).toBe('https://github.com/');
    expect(link?.target).toBe('_blank');
  });

  it('does not wrap in a link when href is not provided', () => {
    const { container } = render(<StatCard label="Count" value="5" />);

    const link = container.querySelector('a');
    expect(link).toBeNull();
  });

  it('renders children alongside value', () => {
    render(
      <StatCard label="Score" value="100">
        <span data-testid="child">extra</span>
      </StatCard>,
    );

    expect(screen.getByTestId('child')).toBeDefined();
  });
});
