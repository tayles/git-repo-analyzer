import { mockResult } from '@git-repo-analyzer/mocks';
import { describe, test, expect } from 'bun:test';

import { formatResultJson } from './cli-formatter';

describe('CLI Formatter', () => {
  test('should format result as JSON', () => {
    expect(formatResultJson(mockResult)).toContain('"fullName": "facebook/react"');
  });
});
