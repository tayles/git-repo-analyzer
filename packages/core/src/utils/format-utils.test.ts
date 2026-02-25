import { describe, expect, it } from 'bun:test';

import { formatNumber } from './format-utils';

describe('formatNumber', () => {
  it('formats numbers below one thousand unchanged', () => {
    expect(formatNumber(999)).toBe('999');
  });

  it('formats thousands with K suffix', () => {
    expect(formatNumber(1_500)).toBe('1.5K');
  });

  it('formats millions with M suffix', () => {
    expect(formatNumber(2_500_000)).toBe('2.5M');
  });
});
