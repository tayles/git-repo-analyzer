import { afterEach, describe, expect, it } from 'bun:test';

import { mockResult } from '@git-repo-analyzer/mocks';

import { printReport } from './cli-reporter';

const originalLog = console.log;

afterEach(() => {
  console.log = originalLog;
});

describe('printReport', () => {
  it('prints report sections and metrics without throwing', () => {
    const lines: string[] = [];
    console.log = (...args: unknown[]) => {
      lines.push(args.map(String).join(' '));
    };

    printReport(mockResult);

    const output = lines.join('\n');
    expect(output).toContain('Analysis:');
    expect(output).toContain('Repository Stats');
    expect(output).toContain('Contributors');
    expect(output).toContain('Commit Activity');
    expect(output).toContain('Pull Requests');
    expect(output).toContain('Health Score');
  });

  it('handles minimal/no-tooling-like data without crashing', () => {
    const lines: string[] = [];
    console.log = (...args: unknown[]) => {
      lines.push(args.map(String).join(' '));
    };

    printReport({
      ...mockResult,
      basicStats: {
        ...mockResult.basicStats,
        description: null,
        topics: [],
      },
      tooling: {
        ...mockResult.tooling,
        tools: [],
        categories: [],
      },
      languages: {
        ...mockResult.languages,
        langs: [],
      },
      contributors: {
        ...mockResult.contributors,
        recentContributors: [],
      },
      commits: {
        ...mockResult.commits,
        commits: [],
      },
      pullRequests: {
        ...mockResult.pullRequests,
        pulls: [],
      },
    });

    expect(lines.length).toBeGreaterThan(0);
    expect(lines.join('\n')).toContain('Health Score');
  });
});
