import { TZDate } from '@date-fns/tz';

import type { GitHubCommit } from '../client/github-types';
import type {
  ActivityHeatmap,
  BucketByWeek,
  CommitAnalysis,
  CommitConventionsAnalysis,
  ContributorAnalysis,
  WorkPatterns,
} from '../types';
import { weekStart } from '../utils/date-utils';

export function processCommits(
  commits: GitHubCommit[],
  contributors: ContributorAnalysis,
): CommitAnalysis {
  // const mergeStrategy = detectMergeStrategy(commits);
  const conventions = detectConventions(commits);
  const activityHeatmap = analyzeTimeOfDayWeek(commits, contributors);
  const workPatterns = analyzeWorkPatterns(activityHeatmap);
  const byWeek = commits.reduce((acc, commit) => {
    const weekStartDate = weekStart(commit.commit.author.date);
    acc[weekStartDate] = (acc[weekStartDate] || 0) + 1;
    return acc;
  }, {} as BucketByWeek);

  return {
    totalCommits: commits.length,
    firstCommitDate: commits[commits.length - 1]?.commit.author.date ?? null,
    lastCommitDate: commits[0]?.commit.author.date ?? null,
    conventions,
    workPatterns,
    activityHeatmap,
    byWeek,
  };
}

/**
 * Classify commit timestamps into a 7x24 heatmap to analyze time-of-day and day-of-week patterns.
 * This can help identify if the project is primarily worked on during traditional work hours,
 * evenings, or weekends, which can be a signal of professional vs hobbyist maintenance.
 * Uses the contributors timezone if available to convert commit times to local time for more accurate analysis
 */
export function analyzeTimeOfDayWeek(
  commits: GitHubCommit[],
  contributors: ContributorAnalysis,
): ActivityHeatmap {
  return commits.reduce(
    (heatmap, commit) => {
      const dateStr = commit.commit.author.date;
      if (!dateStr || typeof dateStr !== 'string') {
        console.warn('[Commit Analysis] Skipping commit with invalid date:', dateStr);
        return heatmap;
      }

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        console.warn('[Commit Analysis] Skipping commit with unparseable date:', dateStr);
        return heatmap;
      }

      const author = commit.author?.login;
      const contributor = contributors.topContributors.find(c => c.login === author);
      const timezone = contributor?.timezone ?? contributors.primaryTimezone;

      // Convert to contributor's local time using TZDate for correct DST handling
      let day: number;
      let hour: number;
      if (timezone) {
        const localDate = new TZDate(date.getTime(), timezone);
        day = localDate.getDay();
        hour = localDate.getHours();
      } else {
        day = date.getUTCDay();
        hour = date.getUTCHours();
      }
      heatmap.grid[day]![hour]!++;
      if (heatmap.grid[day]![hour]! > heatmap.maxValue) {
        heatmap.maxValue = heatmap.grid[day]![hour]!;
      }

      return heatmap;
    },
    {
      grid: Array.from({ length: 7 }, () => Array.from<number>({ length: 24 }).fill(0)),
      maxValue: 0,
    } as ActivityHeatmap,
  );
}

export function analyzeWorkPatterns(heatmap: ActivityHeatmap): WorkPatterns {
  let workHours = 0;
  let evenings = 0;
  let weekends = 0;
  let total = 0;

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const count = heatmap.grid[day]![hour]!;
      total += count;

      const isWeekend = day === 0 || day === 6;
      const isWorkHour = hour >= 9 && hour < 17;
      const isEvening = hour >= 17 || hour < 9;

      if (isWeekend) {
        weekends += count;
      } else if (isWorkHour) {
        workHours += count;
      } else if (isEvening) {
        evenings += count;
      }
    }
  }

  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

  const workHoursPercent = pct(workHours);
  const eveningsPercent = pct(evenings);
  const weekendsPercent = pct(weekends);

  let classification: WorkPatterns['classification'];
  if (workHoursPercent >= 60) {
    classification = 'professional';
  } else if (weekendsPercent + eveningsPercent >= 60) {
    classification = 'hobbyist';
  } else {
    classification = 'mixed';
  }

  return { classification, workHoursPercent, eveningsPercent, weekendsPercent };
}

/**
 * Count prefixes in commit messages to detect usage of Conventional Commits, Gitmoji, and Commitizen.
 */
export function detectConventions(commits: GitHubCommit[]): CommitConventionsAnalysis {
  const prefixes: Record<string, number> = {};
  let hasConventionalCommits = false;
  let hasGitmoji = false;

  for (const commit of commits) {
    const message = commit.commit.message.split('\n')[0] || '';
    // TODO: handle reverts which may have a "Revert " prefix
    const conventionalPrefix = message.match(/^([A-Za-z]+)[:(]/)?.[1];
    const emojiPrefix = message.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u)?.[0];
    if (conventionalPrefix) {
      const lowerCasePrefix = conventionalPrefix.toLowerCase();
      prefixes[lowerCasePrefix] = (prefixes[lowerCasePrefix] || 0) + 1;
      hasConventionalCommits = true;
    }
    if (emojiPrefix) {
      prefixes[emojiPrefix] = (prefixes[emojiPrefix] || 0) + 1;
      hasGitmoji = true;
    }
  }

  return {
    conventionalCommits: hasConventionalCommits,
    gitmoji: hasGitmoji,
    prefixes,
  };
}
