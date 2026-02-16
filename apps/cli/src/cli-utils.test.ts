import { mockResult } from '@git-repo-analyzer/mocks';
import { describe, expect, it } from 'bun:test';

import { formatResult, formatResultJson } from './cli-utils';

describe('CLI utilities', () => {
  describe('formatResult', () => {
    it('should format result as human-readable string', () => {
      const output = formatResult(mockResult);

      expect(output).toContain('Repository: test/repo');
      expect(output).toContain('Commits: 1,000');
      expect(output).toContain('Contributors: 50');
      expect(output).toContain('Primary Language: TypeScript');
      expect(output).toContain('TypeScript: 80%');
      expect(output).toContain('JavaScript: 20%');
      expect(output).toContain('500ms');
    });
  });

  describe('formatResultJson', () => {
    it('should format result as JSON string', () => {
      const output = formatResultJson(mockResult);
      const parsed = JSON.parse(output);

      expect(parsed.repository).toBe('test/repo');
      expect(parsed.stats.totalCommits).toBe(1000);
      expect(parsed.languages).toHaveLength(2);
    });

    it('should produce valid JSON', () => {
      const output = formatResultJson(mockResult);

      expect(() => JSON.parse(output)).not.toThrow();
    });
  });
});
