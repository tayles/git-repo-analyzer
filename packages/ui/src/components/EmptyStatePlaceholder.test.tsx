import { describe, expect, it } from 'bun:test';

import { render, screen } from '@testing-library/react';

import { EmptyStatePlaceholder } from './EmptyStatePlaceholder';

describe('EmptyStatePlaceholder', () => {
  it('renders children', () => {
    render(
      <EmptyStatePlaceholder>
        <p>No data available</p>
      </EmptyStatePlaceholder>,
    );

    expect(screen.getByText('No data available')).toBeDefined();
  });

  it('renders multiple children', () => {
    render(
      <EmptyStatePlaceholder>
        <h2>Empty</h2>
        <p>Nothing to show</p>
      </EmptyStatePlaceholder>,
    );

    expect(screen.getByText('Empty')).toBeDefined();
    expect(screen.getByText('Nothing to show')).toBeDefined();
  });
});
