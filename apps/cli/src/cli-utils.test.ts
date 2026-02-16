import { mockResult } from '@git-repo-analyzer/mocks';
import { describe, expect, it } from 'bun:test';

import { formatResult, formatResultJson } from './cli-utils';

describe('CLI utilities', () => {
  describe('formatResult', () => {
    it('should format result as human-readable string', () => {
      const output = formatResult(mockResult);

      expect(output).toContain('Repository: facebook/react');
      expect(output).toContain('Commits: 300');
      expect(output).toContain('Contributors: 300');
      expect(output).toContain('Primary Language: JavaScript');
      expect(output).toContain('44ms');
    });
  });

  describe('formatResultJson', () => {
    it('should format result as JSON string', () => {
      const output = formatResultJson(mockResult);
      const parsed = JSON.parse(output);

      expect(parsed.basicStats.fullName).toBe('facebook/react');
      expect(parsed.commits.totalCommits).toBe(300);
      expect(parsed.languages.langs).toHaveLength(6);
    });

    it('should produce valid JSON', () => {
      const output = formatResultJson(mockResult);

      expect(() => JSON.parse(output)).not.toThrow();
    });
  });
});
