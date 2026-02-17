import { describe, expect, it } from 'bun:test';

import { getTimezoneOffset } from './timezone-utils';

describe('getTimezoneOffset', () => {
  it('should return null for null timezone', () => {
    expect(getTimezoneOffset(null)).toBeNull();
  });

  it('should return a number for valid timezone (America/New_York)', () => {
    const offset = getTimezoneOffset('America/New_York');
    expect(offset).not.toBeNull();
    // Between -5 (EST) and -4 (EDT) depending on time of year
    expect(offset).toBeGreaterThanOrEqual(-5);
    expect(offset).toBeLessThanOrEqual(-4);
  });

  it('should return null for invalid timezone', () => {
    expect(getTimezoneOffset('Not/A/Timezone')).toBeNull();
  });

  it('should handle half-hour offset (Asia/Kolkata)', () => {
    const offset = getTimezoneOffset('Asia/Kolkata');
    expect(offset).toBe(5.5);
  });

  it('should handle UTC (expect 0)', () => {
    const offset = getTimezoneOffset('UTC');
    expect(offset).toBe(0);
  });
});
