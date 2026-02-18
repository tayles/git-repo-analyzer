import type { AnalysisResult } from '@git-repo-analyzer/core';
import pc from 'picocolors';

export function heading(text: string): string {
  return `\n${pc.bold(pc.cyan(`━━━ ${text} ━━━`))}\n`;
}

export function metric(label: string, value: string | number): string {
  return `  ${pc.dim(label + ':')} ${pc.bold(String(value))}`;
}

export function barChart(items: { label: string; value: number }[], maxWidth = 30): string {
  const maxVal = Math.max(...items.map(i => i.value), 1);
  const maxLabel = Math.max(...items.map(i => i.label.length));

  return items
    .map(item => {
      const barLen = Math.round((item.value / maxVal) * maxWidth);
      const bar = pc.green('█'.repeat(barLen)) + pc.dim('░'.repeat(maxWidth - barLen));
      const label = item.label.padEnd(maxLabel);
      return `  ${label} ${bar} ${item.value}`;
    })
    .join('\n');
}

export function progressBar(score: number, max: number, width = 20): string {
  const filled = Math.round((score / max) * width);
  const bar = pc.green('█'.repeat(filled)) + pc.dim('░'.repeat(width - filled));
  return `${bar} ${score}/${max}`;
}

export function badge(
  text: string,
  color: 'green' | 'yellow' | 'red' | 'blue' | 'cyan' | 'dim',
): string {
  const colorFn = pc[color];
  return colorFn(`[${text}]`);
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const INTENSITY = [' ', '░', '▒', '▓', '█'];

export function heatmapRow(day: number, hours: number[], maxValue: number): string {
  const dayLabel = (DAYS[day] ?? '???').padEnd(4);
  const cells = hours.map(v => {
    if (maxValue === 0) return INTENSITY[0];
    const level = Math.min(Math.round((v / maxValue) * 4), 4);
    return pc.green(INTENSITY[level] + INTENSITY[level]);
  });
  return `  ${pc.dim(dayLabel)} ${cells!.join('')}`;
}

export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

/**
 * Format an analysis result as JSON
 */
export function formatResultJson(result: AnalysisResult): string {
  return JSON.stringify(result, null, 2);
}
