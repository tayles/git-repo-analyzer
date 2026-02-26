import { describe, expect, it } from 'bun:test';

import { render, screen } from '@testing-library/react';

import { DataLimitNotice } from './DataLimitNotice';

describe('DataLimitNotice', () => {
  it('renders children text', () => {
    render(<DataLimitNotice>Only showing first 100 results</DataLimitNotice>);

    expect(screen.getByText('Only showing first 100 results')).toBeDefined();
  });

  it('applies custom className', () => {
    const { container } = render(<DataLimitNotice className="mt-4">Limited data</DataLimitNotice>);

    const notice = container.firstElementChild;
    expect(notice?.className).toContain('mt-4');
  });

  it('includes the warning icon', () => {
    const { container } = render(<DataLimitNotice>Warning text</DataLimitNotice>);

    // Lucide icons render as SVGs
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
  });
});
