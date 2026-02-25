import { describe, expect, it } from 'bun:test';

import { countryCodeToEmojiFlag, parseLocation } from './location-utils';

describe('location-utils', () => {
  it('returns null for empty location', () => {
    expect(parseLocation(null)).toBeNull();
  });

  it('handles normalized special-case city aliases', () => {
    const parsed = parseLocation('NYC');
    expect(parsed).not.toBeNull();
    expect(parsed?.timezone).toBeTruthy();
  });

  it('converts country code to emoji flag', () => {
    expect(countryCodeToEmojiFlag('US')).toBe('🇺🇸');
  });

  it('returns empty flag for invalid code', () => {
    expect(countryCodeToEmojiFlag('USA')).toBe('');
  });
});
