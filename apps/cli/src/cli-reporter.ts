import {
  countryCodeToEmojiFlag,
  relativeDateLabel,
  type AnalysisResult,
  type ToolMetaWithFileMatches,
} from '@git-repo-analyzer/core';
import pc from 'picocolors';

import {
  badge,
  barChart,
  formatDuration,
  formatNumber,
  heading,
  heatmapRow,
  metric,
  progressBar,
} from './cli-formatter';

export function printReport(result: AnalysisResult): void {
  const { basicStats: s } = result;

  // Header
  console.log(pc.bold(pc.white(`\n🔍 Analysis: ${s.fullName}`)));
  if (s.description) console.log(pc.dim(`   ${s.description}`));
  console.log();

  // Basic Stats
  console.log(heading('Repository Stats'));
  console.log(metric('Stars', formatNumber(s.stars)));
  console.log(metric('Forks', formatNumber(s.forks)));
  console.log(metric('Open Issues', formatNumber(s.openIssues)));
  console.log(metric('Watchers', formatNumber(s.watchers)));
  console.log(metric('Language', s.language ?? 'N/A'));
  console.log(metric('License', s.license ?? 'None'));
  console.log(
    metric('Created', s.createdAt.slice(0, 10)) + pc.dim(` (${relativeDateLabel(s.createdAt)})`),
  );
  console.log(
    metric('Last Push', s.pushedAt.slice(0, 10)) + pc.dim(` (${relativeDateLabel(s.pushedAt)})`),
  );
  if (s.archived) console.log(metric('Status', pc.yellow('ARCHIVED')));
  if (s.topics.length > 0) console.log(metric('Topics', s.topics.join(', ')));

  // Languages
  if (result.languages.langs.length > 0) {
    console.log(heading('Languages'));
    console.log(
      barChart(result.languages.langs.slice(0, 8).map(l => ({ label: l.name, value: l.percent }))),
    );
  }

  // Contributors
  console.log(heading('Contributors'));
  console.log(metric('Total', result.contributors.totalContributors));
  console.log(metric('Team Size', result.contributors.teamSize));
  console.log(metric('Bus Factor', result.contributors.busFactor));
  if (result.contributors.primaryCountry) {
    console.log(
      metric(
        'Primary Country',
        `${countryCodeToEmojiFlag(result.contributors.primaryCountryCode)} ${result.contributors.primaryCountry}`,
      ),
    );
  }
  if (result.contributors.topContributors.length > 0) {
    console.log();
    for (const c of result.contributors.topContributors.slice(0, 5)) {
      const flag = c.flag ? `${c.flag} ` : '';
      const location = c.location ? ` ${pc.dim(`${flag}(${c.location})`)}` : '';
      console.log(
        `  ${c.login.padEnd(20)} ${pc.dim(String(c.contributions) + ' commits')}${location}`,
      );
    }
  }

  // Activity Heatmap
  console.log(heading('Activity Heatmap'));
  console.log(pc.dim('       0   2   4   6   8   10  12  14  16  18  20  22   '));
  for (let day = 0; day < 7; day++) {
    console.log(
      heatmapRow(
        day,
        result.commits.activityHeatmap.grid[day]!,
        result.commits.activityHeatmap.maxValue,
      ),
    );
  }
  console.log(pc.dim('      ╰──── morning ────╯╰──── daytime ───╯╰─ evening ─╯'));

  // Work Patterns (recalculate with timezone-adjusted heatmap)
  console.log(heading(`Work Patterns`));
  const wpColor =
    result.commits.workPatterns.classification === 'professional'
      ? 'blue'
      : result.commits.workPatterns.classification === 'hobbyist'
        ? 'cyan'
        : 'yellow';
  console.log(`  Classification: ${badge(result.commits.workPatterns.classification, wpColor)}`);
  console.log(
    metric('Work Hours (9-5 weekdays)', `${result.commits.workPatterns.workHoursPercent}%`),
  );
  console.log(
    metric('Evenings (weekday off-hours)', `${result.commits.workPatterns.eveningsPercent}%`),
  );
  console.log(metric('Weekends', `${result.commits.workPatterns.weekendsPercent}%`));

  // Commits
  console.log(heading('Commit Activity'));
  console.log(metric('Total', result.commits.totalCommits));
  const recentCommitBuckets = Object.entries(result.commits.byWeek)
    .slice(-12)
    .map(b => ({ label: b[0], value: b[1] }));
  if (recentCommitBuckets.length > 0) {
    console.log(barChart(recentCommitBuckets));
  }

  // // Commit Conventions
  // if (result.commitConventions) {
  //   console.log(heading('Commit Conventions'));
  //   console.log(
  //     metric(
  //       'Conventional Commits',
  //       `${result.commitConventions.conventionalCommits}% ${result.commitConventions.detectedPatterns.length > 0 ? pc.dim(`(${result.commitConventions.detectedPatterns.join(', ')})`) : ''}`,
  //     ),
  //   );
  //   console.log(metric('Gitmoji', `${result.commitConventions.gitmoji}%`));
  //   if (result.commitConventions.hasCommitizen) {
  //     console.log(metric('Commitizen', pc.green('✓ Detected')));
  //   }
  // }

  // // Merge Strategy
  // if (result.mergeStrategy) {
  //   console.log(heading('Merge Strategy'));
  //   const strategyLabels: Record<typeof result.mergeStrategy.primary, string> = {
  //     squash: 'Squash Merge',
  //     merge: 'Merge Commits',
  //     rebase: 'Rebase',
  //     mixed: 'Mixed',
  //     unknown: 'Unknown',
  //   };
  //   const strategyColor =
  //     result.mergeStrategy.primary === 'unknown'
  //       ? 'dim'
  //       : result.mergeStrategy.primary === 'mixed'
  //         ? 'yellow'
  //         : 'blue';
  //   console.log(`  Primary: ${badge(strategyLabels[result.mergeStrategy.primary], strategyColor)}`);
  //   if (result.mergeStrategy.primary !== 'unknown') {
  //     console.log(metric('  Squash', `${result.mergeStrategy.squashPercent}%`));
  //     console.log(metric('  Merge Commits', `${result.mergeStrategy.mergePercent}%`));
  //     console.log(metric('  Rebase/Direct', `${result.mergeStrategy.rebasePercent}%`));
  //   }
  // }

  // Pull Requests
  console.log(heading('Pull Requests'));
  console.log(metric('Open', result.pullRequests.totalOpen));
  console.log(metric('Merged', result.pullRequests.totalMerged));
  console.log(metric('Closed (unmerged)', result.pullRequests.totalClosed));
  if (result.pullRequests.avgMergeTimeHours != null) {
    console.log(metric('Avg Merge Time', formatDuration(result.pullRequests.avgMergeTimeHours)));
  }

  const recentPullBuckets = Object.entries(result.pullRequests.byWeek)
    .slice(-12)
    .map(b => ({ label: b[0], value: b[1] }));
  if (recentPullBuckets.length > 0) {
    console.log(barChart(recentPullBuckets));
  }

  // // Bot Activity
  // if (result.pullRequests.botStats.length > 0) {
  //   console.log(heading('Bot Activity'));
  //   for (const bot of result.pullRequests.botStats) {
  //     const botIcon = bot.botName === 'dependabot' ? '🤖' : '🔧';
  //     const displayName = bot.botName.charAt(0).toUpperCase() + bot.botName.slice(1);
  //     console.log(`  ${botIcon} ${pc.bold(displayName)}`);
  //     console.log(
  //       `     Total: ${bot.totalPRs} PRs (${pc.blue(String(bot.openPRs))} open, ${pc.green(String(bot.mergedPRs))} merged, ${pc.red(String(bot.closedPRs))} closed)`,
  //     );
  //     if (bot.avgAgeHours != null) {
  //       console.log(`     Avg Age: ${formatDuration(bot.avgAgeHours)}`);
  //     }
  //     if (bot.oldestOpenPR) {
  //       console.log(
  //         `     Oldest Open: ${pc.yellow(formatDuration(bot.oldestOpenPR.ageHours))} - ${pc.dim(bot.oldestOpenPR.title.slice(0, 60))}`,
  //       );
  //     }
  //     console.log();
  //   }
  // }

  // Tooling
  if (result.tooling.tools.length > 0) {
    console.log(heading('Tooling'));
    const byCategory: Record<string, ToolMetaWithFileMatches[]> = result.tooling.tools.reduce(
      (acc, tool) => {
        acc[tool.category] = acc[tool.category] || [];
        acc[tool.category].push(tool);
        return acc;
      },
      {} as Record<string, ToolMetaWithFileMatches[]>,
    );

    // for (const tool of result.tooling.tools) {
    //   console.log(`  ${pc.bold(tool.category)}: ${tool.name}`);
    // }
    for (const [category, tools] of Object.entries(byCategory)) {
      console.log(`  ${pc.dim(category)}`);
      for (const tool of tools) {
        console.log(`   ${pc.dim('-')} ${tool.name}`);
      }
    }
  }

  // Health Score
  console.log(heading('Health Score'));
  const scoreColor =
    result.healthScore.overall >= 70
      ? 'green'
      : result.healthScore.overall >= 40
        ? 'yellow'
        : 'red';
  console.log(`  Overall: ${badge(`${result.healthScore.overall}/100`, scoreColor)}`);
  for (const [catName, score] of Object.entries(result.healthScore.categories)) {
    console.log(`  ${catName.padEnd(15)} ${progressBar(score.score, score.maxScore)}`);
    for (const detail of score.details) {
      const color = detail.delta > 0 ? 'green' : detail.delta < 0 ? 'red' : 'dim';
      const symbol = detail.delta > 0 ? '✓' : detail.delta < 0 ? '✗' : '-';
      console.log(pc[color](`    ${pc.dim(symbol)} ${detail.message}`));
    }
  }

  console.log(pc.dim(`\n  Analyzed at ${result.generator.analyzedAt}\n`));
}
