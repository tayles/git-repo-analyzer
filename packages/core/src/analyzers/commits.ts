import type { GitHubCommit } from '../client/github-types';
import type {
  ActivityHeatmap,
  CommitAnalysis,
  CommitConventionsAnalysis,
  CommitMessageAnalysis,
  CommitsPerWeek,
  DecoratedCommit,
  TimeOfDay,
  UserProfile,
  WorkPatternClassification,
  WorkPatterns,
} from '../types';
import { parseDate } from '../utils/date-utils';

export function processCommits(
  commits: GitHubCommit[],
  userProfiles: UserProfile[],
): CommitAnalysis {
  // calculate local times
  const decoratedCommits = decorateCommits(commits, userProfiles);

  // const mergeStrategy = detectMergeStrategy(commits);
  const conventions = detectConventions(decoratedCommits.map(c => c.message));
  const workPatterns = analyzeWorkPatterns(decoratedCommits);

  return {
    totalCommits: commits.length,
    firstCommitDate: commits[commits.length - 1]?.commit.author.date ?? null,
    lastCommitDate: commits[0]?.commit.author.date ?? null,
    conventions,
    commits: decoratedCommits,
    workPatterns,
  };
}

export function analyzeWorkPatterns(
  commits: DecoratedCommit[],
  filterByLogin?: string,
): WorkPatterns {
  // group by timeOfDay
  const totals = commits.reduce(
    (acc, commit) => {
      if (!filterByLogin || commit.author === filterByLogin) {
        acc[commit.date.timeOfDay] = (acc[commit.date.timeOfDay] ?? 0) + 1;
        acc.total = (acc.total ?? 0) + 1;
      }
      return acc;
    },
    { total: 0, workday: 0, offHours: 0, weekend: 0 } as Record<TimeOfDay | 'total', number>,
  );

  const total = totals.total;

  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

  const workHoursPercent = pct(totals.workday);
  const eveningsPercent = pct(totals.offHours);
  const weekendsPercent = pct(totals.weekend);

  const classification: WorkPatternClassification =
    workHoursPercent >= 60
      ? 'professional'
      : eveningsPercent + weekendsPercent >= 60
        ? 'hobbyist'
        : 'mixed';

  return { classification, workHoursPercent, eveningsPercent, weekendsPercent };
}

/**
 * Count prefixes in commit messages to detect usage of Conventional Commits, Gitmoji, and Commitizen.
 */
export function detectConventions(arr: CommitMessageAnalysis[]): CommitConventionsAnalysis {
  let gitmoji = false;
  let conventionalCommits = false;

  const prefixes = arr.reduce(
    (acc, c) => {
      if (c.type) {
        acc[c.type] = (acc[c.type] ?? 0) + 1;
      }

      if (c.convention === 'gitmoji') {
        gitmoji = true;
      }
      if (c.convention === 'conventional') {
        conventionalCommits = true;
      }

      return acc;
    },
    {} as Record<string, number>,
  );

  // sort prefixes by count desc
  const sortedPrefixes = Object.fromEntries(Object.entries(prefixes).sort(([, a], [, b]) => b - a));

  return { conventionalCommits, gitmoji, prefixes: sortedPrefixes };
}

export function decorateCommits(
  commits: GitHubCommit[],
  userProfiles: UserProfile[],
): DecoratedCommit[] {
  return commits.map(commit => parseCommit(commit, userProfiles));
}

export function parseCommit(commit: GitHubCommit, userProfiles: UserProfile[]): DecoratedCommit {
  const sha = commit.sha;

  const author = commit.author?.login ?? null;

  const u = author ? userProfiles.find(u => u.login === author) : null;

  const date = parseDate(commit.commit.author.date, u?.timezone);

  const message = parseMessage(commit.commit.message);

  return {
    sha,
    author,
    message,
    date,
  };
}

export function parseMessage(message: string): CommitMessageAnalysis {
  const firstLine = message.split('\n')[0] || '';
  const raw = firstLine;
  // TODO: handle reverts which may have a "Revert " prefix
  const conventionalPrefix = firstLine.match(/^([A-Za-z]+)[:(]/)?.[1];
  const emojiPrefix = firstLine.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u)?.[0];
  const type = conventionalPrefix?.toLowerCase() ?? emojiPrefix ?? null;
  const scope = null;
  const convention = conventionalPrefix ? 'conventional' : emojiPrefix ? 'gitmoji' : null;

  return { raw, type, scope, convention };
}

/**
 * Classify commit timestamps into a 7x24 heatmap to analyze time-of-day and day-of-week patterns.
 * This can help identify if the project is primarily worked on during traditional work hours,
 * evenings, or weekends, which can be a signal of professional vs hobbyist maintenance.
 * Uses the contributors timezone if available to convert commit times to local time for more accurate analysis
 */
export function computeActivityHeatmap(
  commits: DecoratedCommit[],
  filterByLogin?: string,
): ActivityHeatmap {
  return commits.reduce(
    (heatmap, commit) => {
      if (!filterByLogin || commit.author === filterByLogin) {
        const day = commit.date.dayOfWeek;
        const hour = commit.date.hourOfDay;

        heatmap.grid[day]![hour]!++;
        if (heatmap.grid[day]![hour]! > heatmap.maxValue) {
          heatmap.maxValue = heatmap.grid[day]![hour]!;
        }
      }

      return heatmap;
    },
    {
      grid: Array.from({ length: 7 }, () => Array.from<number>({ length: 24 }).fill(0)),
      maxValue: 0,
    } as ActivityHeatmap,
  );
}

export function computeCommitsPerWeek(
  commits: DecoratedCommit[],
  filterByLogin?: string,
): CommitsPerWeek {
  return commits.reduce((acc, commit) => {
    if (!filterByLogin || commit.author === filterByLogin) {
      const bucket = commit.date.weekStart;
      const author = commit.author ?? 'unknown';
      const type = commit.message.type ?? 'other';
      if (!acc[bucket]) {
        acc[bucket] = { total: 0, byAuthor: {}, byType: {} };
      }
      acc[bucket].total++;
      acc[bucket].byAuthor[author] = (acc[bucket].byAuthor[author] ?? 0) + 1;
      acc[bucket].byType[type] = (acc[bucket].byType[type] ?? 0) + 1;
    }
    return acc;
  }, {} as CommitsPerWeek);
}
