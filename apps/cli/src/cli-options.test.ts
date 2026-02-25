import { describe, expect, it } from 'bun:test';

import { HELP_TEXT, VERSION, parseArgs } from './cli-options';

describe('cli-options', () => {
  it('parses repository and flags', () => {
    const parsed = parseArgs(['owner/repo', '--json', '--raw']);

    expect(parsed.repository).toBe('owner/repo');
    expect(parsed.json).toBe(true);
    expect(parsed.raw).toBe(true);
  });

  it('parses short token option', () => {
    const parsed = parseArgs(['owner/repo', '-t', 'abc123']);

    expect(parsed.token).toBe('abc123');
  });

  it('parses help and version flags', () => {
    expect(parseArgs(['--help']).help).toBe(true);
    expect(parseArgs(['-v']).version).toBe(true);
  });

  it('keeps first positional repository only', () => {
    const parsed = parseArgs(['owner/repo', 'other/repo']);
    expect(parsed.repository).toBe('owner/repo');
  });

  it('exports help text with current version', () => {
    expect(HELP_TEXT).toContain(VERSION);
    expect(HELP_TEXT).toContain('Usage:');
  });
});
