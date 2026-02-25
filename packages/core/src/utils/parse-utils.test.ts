import { describe, expect, it } from 'bun:test';

import { parseRepository } from './parse-utils';

describe('parseRepository', () => {
  it('parses owner/repo format', () => {
    expect(parseRepository('owner/repo')).toBe('owner/repo');
  });

  it('parses GitHub URL format', () => {
    expect(parseRepository('https://github.com/owner/repo')).toBe('owner/repo');
  });

  it('strips .git suffix from URL', () => {
    expect(parseRepository('https://github.com/owner/repo.git')).toBe('owner/repo');
  });

  it('throws on invalid repository value', () => {
    expect(() => parseRepository('invalid')).toThrow('Invalid repository format');
  });
});
