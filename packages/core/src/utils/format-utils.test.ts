import { describe, expect, it } from 'bun:test';

import { formatBytes, formatNumber } from './format-utils';

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

describe('formatBytes', () => {
  it('formats bytes with B suffix', () => {
    expect(formatBytes(500)).toBe('500 B');
  });

  it('formats kilobytes with KB suffix', () => {
    expect(formatBytes(1_500)).toBe('1.5 KB');
  });

  it('formats megabytes with MB suffix', () => {
    expect(formatBytes(2_500_000)).toBe('2.4 MB');
  });

  it('formats gigabytes with GB suffix', () => {
    expect(formatBytes(3_000_000_000)).toBe('2.8 GB');
  });
});
