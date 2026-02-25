import { describe, expect, it } from 'bun:test';

import { formatDate, formatWeekLabel, parseDate, relativeDateLabel, weekStart } from './date-utils';

describe('date-utils', () => {
  const iso = '2025-01-08T10:30:00.000Z';

  it('returns a relative label', () => {
    const label = relativeDateLabel(iso);
    expect(typeof label).toBe('string');
    expect(label.length).toBeGreaterThan(0);
  });

  it('calculates week start bucket', () => {
    expect(weekStart(iso)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('formats week label', () => {
    expect(formatWeekLabel(iso)).toBe('Jan 8');
  });

  it('formats date in long form', () => {
    const out = formatDate(iso);
    expect(out).toContain('2025');
  });

  it('parses date with timezone and classifies as workday', () => {
    const parsed = parseDate('2025-01-07T15:00:00.000Z', 'America/New_York');
    expect(parsed.local).not.toBeNull();
    expect(parsed.timeOfDay).toBe('workday');
  });

  it('parses date without timezone fallback', () => {
    const parsed = parseDate('2025-01-05T03:00:00.000Z', null);
    expect(parsed.local).toBeNull();
    expect(parsed.timeOfDay).toBe('weekend');
  });
});
