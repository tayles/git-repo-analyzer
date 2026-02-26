import { detectConventions, type CommitAnalysis, type UserProfile } from '@git-repo-analyzer/core';
import { useMemo } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import { HorizontalBarChart } from './HorizontalBarChart';
import { InfoButton } from './InfoButton';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';

interface CommitsByTypeChartProps {
  commits: CommitAnalysis;
  selectedUserProfile: UserProfile | null;
}

const chartConfig = {
  count: { label: 'Commits', color: 'var(--chart-1)' },
} satisfies ChartConfig;

export function CommitsByTypeChart({ commits, selectedUserProfile }: CommitsByTypeChartProps) {
  if (Object.keys(commits.conventions.prefixes).length === 0) return null;

  const data = useMemo(
    () =>
      selectedUserProfile
        ? detectConventions(
            commits.commits.filter(c => c.author === selectedUserProfile.login).map(c => c.message),
          )
        : commits.conventions,
    [selectedUserProfile, commits],
  );

  const entries = Object.entries(data.prefixes)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const typeBreakdown = Object.fromEntries(entries);

  const chartData = Object.entries(commits.conventions.prefixes)
    .slice(0, 10)
    .map(([type]) => ({
      type,
      count: data.prefixes[type] ?? 0,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="select-text">Commit Types</CardTitle>
        <CardAction>
          <InfoButton title="Commit Types">
            <p className="text-muted-foreground mt-1">
              Breakdown by conventional commits, i.e. commits with common prefixes (e.g. "fix:",
              "feat:"). Helps understand the focus of development efforts.
            </p>
          </InfoButton>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <ChartContainer config={chartConfig} className="h-64 w-full max-w-xs">
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="type" tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Radar
              dataKey="count"
              fill="var(--chart-1)"
              stroke="var(--chart-3)"
              strokeWidth={1.5}
            />
          </RadarChart>
        </ChartContainer>

        <section className="h-5 w-full">
          <HorizontalBarChart data={typeBreakdown} />
        </section>
      </CardContent>
    </Card>
  );
}
