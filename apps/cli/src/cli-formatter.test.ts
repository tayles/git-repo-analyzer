import { describe, test, expect } from 'bun:test';

import { mockResult } from '@git-repo-analyzer/mocks';

import { badge, formatResultJson, heading, metric } from './cli-formatter';

describe('CLI Formatter', () => {
  test('should format result as JSON', () => {
    expect(formatResultJson(mockResult)).toContain('"fullName": "facebook/docusaurus"');
  });

  test('should produce valid parseable JSON with correct fullName', () => {
    const json = formatResultJson(mockResult);
    const parsed = JSON.parse(json);
    expect(parsed.basicStats.fullName).toBe('facebook/docusaurus');
  });

  test('heading should include the provided text', () => {
    const result = heading('Test Section');
    expect(result).toContain('Test Section');
  });

  test('metric should include label and value', () => {
    const result = metric('Stars', 1000);
    expect(result).toContain('Stars');
    expect(result).toContain('1000');
  });

  test('badge should wrap text in brackets', () => {
    const result = badge('healthy', 'green');
    expect(result).toContain('[healthy]');
  });
});
