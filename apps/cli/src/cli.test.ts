import { describe, expect, it } from 'bun:test';
import { formatResult, formatResultJson } from './index';
import type { AnalysisResult } from '@git-repo-analyzer/core';

describe('CLI utilities', () => {
  const mockResult: AnalysisResult = {
    repository: 'test/repo',
    analyzedAt: new Date('2024-01-15T10:30:00Z'),
    stats: {
      totalCommits: 1000,
      totalContributors: 50,
      totalFiles: 200,
      totalLinesOfCode: 50000,
      primaryLanguage: 'TypeScript',
      firstCommitDate: new Date('2020-01-01'),
      lastCommitDate: new Date('2024-01-15'),
    },
    contributors: [
      {
        name: 'Test User',
        commitCount: 100,
        linesAdded: 5000,
        linesDeleted: 2000,
      },
    ],
    languages: [
      {
        language: 'TypeScript',
        fileCount: 150,
        linesOfCode: 40000,
        percentage: 80,
      },
      {
        language: 'JavaScript',
        fileCount: 50,
        linesOfCode: 10000,
        percentage: 20,
      },
    ],
    durationMs: 500,
  };

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
