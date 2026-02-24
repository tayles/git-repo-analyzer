import type { Contributor } from '../types';

export function calculateBusFactor(contributors: Contributor[]): number {
  if (contributors.length === 0) {
    return 0;
  }

  const sorted = contributors
    .map(item => item.contributions)
    .filter(contributions => contributions > 0)
    .sort((a, b) => b - a);

  if (sorted.length === 0) {
    return 0;
  }

  const total = sorted.reduce((sum, contributions) => sum + contributions, 0);
  let accumulated = 0;

  for (const [index, contributions] of sorted.entries()) {
    accumulated += contributions;
    if (accumulated / total >= 0.5) {
      return index + 1;
    }
  }

  return sorted.length;
}
