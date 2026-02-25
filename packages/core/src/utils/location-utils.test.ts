import { describe, expect, it } from 'bun:test';

import { countryCodeToEmojiFlag, parseLocation } from './location-utils';

function assertLocations(locations: string[], expected: (string | null)[]) {
  expect(
    locations
      .map(parseLocation)
      .map(loc => (loc ? `${loc.iso2} - ${loc.city} - ${loc.timezone}` : null)),
    JSON.stringify(locations, null, 2),
  ).toEqual(expected);
}

describe('location-utils', () => {
  it('returns null for empty location', () => {
    expect(parseLocation(null)).toBeNull();
  });

  it('handles city names', () => {
    const locations = ['Los Angeles', 'New York', 'Québec', 'London', 'Prague', 'Munich'];
    const expected = [
      'US - Los Angeles - America/Los_Angeles',
      'US - New York - America/New_York',
      'CA - Montréal - America/Montreal',
      'GB - London - Europe/London',
      'CZ - Prague - Europe/Prague',
      'DE - Munich - Europe/Berlin',
    ];

    assertLocations(locations, expected);
  });

  it('handles state names', () => {
    const locations = [
      'California',
      'New York',
      'Québec',
      'Cambridge',
      'New Jersey',
      'New South Wales',
    ];
    const expected = [
      'US - Los Angeles - America/Los_Angeles',
      'US - New York - America/New_York',
      'CA - Montréal - America/Montreal',
      'GB - Cambridge - Europe/London',
      'US - Newark - America/New_York',
      'AU - Sydney - Australia/Sydney',
    ];

    assertLocations(locations, expected);
  });

  it('handles country names', () => {
    const locations = [
      'USA',
      'United States',
      'UK',
      'England',
      'Wales',
      'Scotland',
      'Hong Kong',
      'Sweden',
    ];
    const expected = [
      'US - New York - America/New_York',
      'US - New York - America/New_York',
      'GB - London - Europe/London',
      'GB - London - Europe/London',
      'GB - London - Europe/London',
      'GB - London - Europe/London',
      'HK - Hong Kong - Asia/Hong_Kong',
      'SE - Stockholm - Europe/Stockholm',
    ];

    assertLocations(locations, expected);
  });

  it('handles complex cases', () => {
    const locations = [
      'USA',
      'US',
      'U.S.A.',
      'United States of America',
      'NJ',
      'HK',
      'NSW',
      'NYC',
      'L.A.',
      'Quebec',
      'London, UK',
      'SF Bay Area, CA',
      'San Francisco Bay Area',
      'Mountain View, CA',
      'East Palo Alto, California',
      'Baltimore, MD (Remote)',
    ];
    const expected = [
      'US - New York - America/New_York',
      'US - New York - America/New_York',
      'US - New York - America/New_York',
      'US - New York - America/New_York',
      'US - Newark - America/New_York',
      'HK - Hong Kong - Asia/Hong_Kong',
      'AU - Sydney - Australia/Sydney',
      'US - New York - America/New_York',
      'US - Los Angeles - America/Los_Angeles',
      'CA - Montréal - America/Montreal',
      null, // 'GB - London - Europe/London',
      null, // 'US - San Francisco - America/Los_Angeles',
      null, // 'US - San Francisco - America/Los_Angeles',
      null, // 'US - San Francisco - America/Los_Angeles',
      null, // 'US - Mountain View - America/Los_Angeles',
      'US - Baltimore - America/New_York',
    ];

    assertLocations(locations, expected);
  });

  it('converts country code to emoji flag', () => {
    expect(countryCodeToEmojiFlag('US')).toBe('🇺🇸');
  });

  it('returns empty flag for invalid code', () => {
    expect(countryCodeToEmojiFlag('USA')).toBe('');
  });
});
