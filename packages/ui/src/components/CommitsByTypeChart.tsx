import { detectConventions, type CommitAnalysis, type Contributor } from '@git-repo-analyzer/core';
import { useMemo } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import { HorizontalBarChart } from './HorizontalBarChart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';

interface CommitsByTypeChartProps {
  commits: CommitAnalysis;
  selectedContributor: Contributor | null;
}

const chartConfig = {
  count: { label: 'Commits', color: 'var(--chart-1)' },
} satisfies ChartConfig;

export function CommitsByTypeChart({ commits, selectedContributor }: CommitsByTypeChartProps) {
  if (Object.keys(commits.conventions.prefixes).length === 0) return null;

  const data = useMemo(
    () =>
      selectedContributor
        ? detectConventions(
            commits.commits.filter(c => c.author === selectedContributor.login).map(c => c.message),
          )
        : commits.conventions,
    [selectedContributor, commits],
  );

  const entries = Object.entries(data.prefixes)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  const typeBreakdown = Object.fromEntries(entries);

  const chartData = Object.entries(commits.conventions.prefixes).map(([type]) => ({
    type,
    count: data.prefixes[type] ?? 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="select-text">Commit Types</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <HorizontalBarChart data={typeBreakdown} className="w-full" />

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
      </CardContent>
    </Card>
  );
}
