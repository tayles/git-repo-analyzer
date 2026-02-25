import { describe, test, expect } from 'bun:test';

import { mockResult } from '@git-repo-analyzer/mocks';

import {
  badge,
  barChart,
  formatDuration,
  formatResultJson,
  heading,
  heatmapRow,
  metric,
  progressBar,
} from './cli-formatter';

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

  test('barChart should render labels and values', () => {
    const output = barChart([
      { label: 'TypeScript', value: 10 },
      { label: 'JavaScript', value: 5 },
    ]);

    expect(output).toContain('TypeScript');
    expect(output).toContain('JavaScript');
    expect(output).toContain('10');
    expect(output).toContain('5');
  });

  test('progressBar should include score and max', () => {
    const output = progressBar(7, 10, 10);
    expect(output).toContain('7/10');
  });

  test('heatmapRow should render day label and cells', () => {
    const output = heatmapRow(1, [0, 1, 2], 2);
    expect(output).toContain('Mon');
  });

  test('heatmapRow should support maxValue = 0', () => {
    const output = heatmapRow(8, [0, 0], 0);
    expect(output).toContain('???');
  });

  test('formatDuration should support minutes, hours, and days', () => {
    expect(formatDuration(0.5)).toBe('30m');
    expect(formatDuration(4)).toBe('4h');
    expect(formatDuration(48)).toBe('2d');
  });
});
