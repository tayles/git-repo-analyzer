import cityTimezones, { type CityData } from 'city-timezones';

const specialCases: Record<string, string> = {
  la: 'los angeles',
  us: 'united states',
  usa: 'united states',
  quebec: 'québec',
  uk: 'united kingdom',
  england: 'united kingdom',
  wales: 'united kingdom',
  scotland: 'united kingdom',
  nj: 'new jersey',
  hk: 'hong kong',
  nsw: 'new south wales',
  nyc: 'new york',
};

export function parseLocation(location: string | null): CityData | null {
  if (!location) return null;

  let normalizedLocation = location
    .toLowerCase()
    .replaceAll(/\s*\(.*\)$/g, '')
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^\w\s]+/g, '')
    .replaceAll(/\./g, '')
    .trim();

  // console.log(`Normalized location: "${normalizedLocation}"`);

  let place = lookupLocation(normalizedLocation);

  if (place) return place;

  // If no match, try splitting by comma
  if (normalizedLocation.includes(',')) {
    const parts = normalizedLocation.split(',');
    for (let part of parts) {
      place = lookupLocation(part);
      if (place) return place;
    }
  }

  return null;
}

export function lookupLocation(location: string): CityData | null {
  if (specialCases[location]) {
    location = specialCases[location]!;
  }

  const res = cityTimezones.findFromCityStateProvince(location);

  if (res?.length) {
    // sort by population, descending
    res.sort((a, b) => (b.pop || 0) - (a.pop || 0));
    return res[0]!;
  }

  return null;
}

/**
 * Convert ISO 3166-1 alpha-2 country code to emoji flag
 * @param countryCode Two-letter country code (e.g., 'US', 'GB', 'JP')
 * @returns Emoji flag string
 */
export function countryCodeToEmojiFlag(countryCode: string | null): string {
  if (!countryCode || countryCode.length !== 2) return '';

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}
