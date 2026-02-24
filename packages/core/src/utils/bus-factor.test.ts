import { describe, expect, it } from 'bun:test';

import type { Contributor } from '../types';
import { calculateBusFactor } from './bus-factor';

describe('calculateBusFactor', () => {
  it('calculates from contributor analysis top contributors', () => {
    const contributors: Contributor[] = [
      { login: 'a', contributions: 60 },
      { login: 'b', contributions: 25 },
      { login: 'c', contributions: 15 },
    ];

    expect(calculateBusFactor(contributors)).toBe(1);
  });

  it('calculates from raw contributors when present', () => {
    const contributors: Contributor[] = [
      { login: 'a', contributions: 40 },
      { login: 'b', contributions: 35 },
      { login: 'c', contributions: 25 },
    ];

    expect(calculateBusFactor(contributors)).toBe(2);
  });

  it('returns 0 when no contribution data is available', () => {
    const contributors: Contributor[] = [];

    expect(calculateBusFactor(contributors)).toBe(0);
  });
});
