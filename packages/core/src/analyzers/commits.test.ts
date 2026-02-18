import { describe, expect, it } from 'bun:test';

import type { GitHubCommit } from '../client/github-types';
import type { ContributorAnalysis } from '../types';
import { analyzeTimeOfDayWeek, detectConventions } from './commits';

function makeCommit(
  date: string,
  message: string = 'test commit',
  authorLogin?: string,
): GitHubCommit {
  return {
    commit: {
      author: { name: 'Test', email: 'test@test.com', date },
      committer: { name: 'Test', email: 'test@test.com', date },
      message,
    },
    author: authorLogin
      ? {
          login: authorLogin,
          id: 1,
          avatar_url: '',
          html_url: '',
          type: 'User',
          site_admin: false,
        }
      : undefined,
    parents: [{ sha: 'abc' }],
  };
}

function makeContributors(overrides: Partial<ContributorAnalysis> = {}): ContributorAnalysis {
  return {
    totalContributors: 1,
    teamSize: 'solo',
    busFactor: 1,
    primaryCountry: null,
    primaryCountryCode: null,
    primaryTimezone: null,
    topContributors: [],
    ...overrides,
  };
}

describe('analyzeTimeOfDayWeek', () => {
  it('should place a UTC commit at correct hour when no timezone', () => {
    // 2024-01-15 is a Monday, 14:00 UTC
    const commits = [makeCommit('2024-01-15T14:00:00Z')];
    const contributors = makeContributors();

    const result = analyzeTimeOfDayWeek(commits, contributors);

    // Monday = day 1, hour 14
    expect(result.grid[1]![14]).toBe(1);
    expect(result.maxValue).toBe(1);
  });

  it('should convert commit time to contributor timezone (America/New_York EST winter)', () => {
    // 2024-01-15 is winter (EST = UTC-5), 20:00 UTC = 15:00 EST
    const commits = [makeCommit('2024-01-15T20:00:00Z', 'test', 'alice')];
    const contributors = makeContributors({
      topContributors: [
        {
          login: 'alice',
          avatarUrl: '',
          contributions: 10,
          htmlUrl: '',
          location: null,
          country: null,
          countryCode: null,
          flag: null,
          timezone: 'America/New_York',
        },
      ],
    });

    const result = analyzeTimeOfDayWeek(commits, contributors);

    // Monday = day 1, 15:00 local
    expect(result.grid[1]![15]).toBe(1);
  });

  it('should handle DST: same UTC time maps to different local hours in summer vs winter', () => {
    // Winter: 2024-01-15 20:00 UTC = 15:00 EST (UTC-5)
    // Summer: 2024-07-15 20:00 UTC = 16:00 EDT (UTC-4)
    const winterCommit = makeCommit('2024-01-15T20:00:00Z', 'winter', 'alice');
    const summerCommit = makeCommit('2024-07-15T20:00:00Z', 'summer', 'alice');
    const contributors = makeContributors({
      topContributors: [
        {
          login: 'alice',
          avatarUrl: '',
          contributions: 10,
          htmlUrl: '',
          location: null,
          country: null,
          countryCode: null,
          flag: null,
          timezone: 'America/New_York',
        },
      ],
    });

    const winterResult = analyzeTimeOfDayWeek([winterCommit], contributors);
    const summerResult = analyzeTimeOfDayWeek([summerCommit], contributors);

    // Winter: Monday hour 15 (EST)
    expect(winterResult.grid[1]![15]).toBe(1);
    // Summer: Monday hour 16 (EDT)
    expect(summerResult.grid[1]![16]).toBe(1);
  });

  it('should handle half-hour offset timezone (Asia/Kolkata UTC+5:30)', () => {
    // 2024-01-15 00:00 UTC = 2024-01-15 05:30 IST
    const commits = [makeCommit('2024-01-15T00:00:00Z', 'test', 'bob')];
    const contributors = makeContributors({
      topContributors: [
        {
          login: 'bob',
          avatarUrl: '',
          contributions: 5,
          htmlUrl: '',
          location: null,
          country: null,
          countryCode: null,
          flag: null,
          timezone: 'Asia/Kolkata',
        },
      ],
    });

    const result = analyzeTimeOfDayWeek(commits, contributors);

    // Monday = day 1, hour 5 (05:30 rounds to hour 5 via getHours())
    expect(result.grid[1]![5]).toBe(1);
  });

  it('should track maxValue correctly with multiple commits at same time', () => {
    const commits = [
      makeCommit('2024-01-15T10:00:00Z'),
      makeCommit('2024-01-15T10:00:00Z'),
      makeCommit('2024-01-15T10:00:00Z'),
      makeCommit('2024-01-16T10:00:00Z'),
    ];
    const contributors = makeContributors();

    const result = analyzeTimeOfDayWeek(commits, contributors);

    // 3 commits on Monday hour 10
    expect(result.grid[1]![10]).toBe(3);
    // 1 commit on Tuesday hour 10
    expect(result.grid[2]![10]).toBe(1);
    expect(result.maxValue).toBe(3);
  });

  it('should skip commits with invalid dates', () => {
    const commits = [makeCommit('not-a-date'), makeCommit('2024-01-15T10:00:00Z')];
    const contributors = makeContributors();

    const result = analyzeTimeOfDayWeek(commits, contributors);

    // Only 1 valid commit should be counted
    expect(result.grid[1]![10]).toBe(1);
    expect(result.maxValue).toBe(1);
  });
});

describe('detectConventions', () => {
  it('should detect conventional commit prefixes', () => {
    const commits = [
      makeCommit('2024-01-01T00:00:00Z', 'feat: add new feature'),
      makeCommit('2024-01-02T00:00:00Z', 'fix: resolve bug'),
      makeCommit('2024-01-03T00:00:00Z', 'chore: update deps'),
      makeCommit('2024-01-04T00:00:00Z', 'feat: another feature'),
    ];

    const result = detectConventions(commits);

    expect(result.conventionalCommits).toBe(true);
    expect(result.prefixes['feat']).toBe(2);
    expect(result.prefixes['fix']).toBe(1);
    expect(result.prefixes['chore']).toBe(1);
  });

  it('should detect gitmoji', () => {
    const commits = [
      makeCommit('2024-01-01T00:00:00Z', '\u2728 add sparkle feature'),
      makeCommit('2024-01-02T00:00:00Z', '\uD83D\uDC1B fix bug'),
    ];

    const result = detectConventions(commits);

    expect(result.gitmoji).toBe(true);
  });

  it('should handle non-conventional messages', () => {
    const commits = [
      makeCommit('2024-01-01T00:00:00Z', 'Update README'),
      makeCommit('2024-01-02T00:00:00Z', 'Merge pull request #123'),
    ];

    const result = detectConventions(commits);

    // "Update" and "Merge" match the regex /^([A-Za-z]+)[:(]/ — they don't have : or ( though
    // Let's check: "Update README" — no colon or paren after "Update", so no match
    // "Merge pull request #123" — same, no colon or paren
    expect(result.conventionalCommits).toBe(false);
    expect(result.gitmoji).toBe(false);
  });
});
