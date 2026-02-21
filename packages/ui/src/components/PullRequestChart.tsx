import { formatWeekLabel, type PullAnalysis, type PullsPerWeek } from '@git-repo-analyzer/core';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from './ui/chart';

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

interface PullRequestChartProps {
  pulls: PullAnalysis;
  data: PullsPerWeek;
}

export function PullRequestChart({ pulls, data }: PullRequestChartProps) {
  const displayData = Object.entries(data)
    .slice(-12)
    .map(([week, v]) => ({
      week: formatWeekLabel(week),
      ...v.byType,
    }));

  // Collect all unique commit types across visible weeks
  const allTypes = Array.from(
    new Set(displayData.flatMap(v => Object.keys(v).filter(key => key !== 'week'))),
  ).sort();

  const chartConfig = Object.fromEntries(
    allTypes.map((type, i) => [
      type,
      { label: type, color: CHART_COLORS[i % CHART_COLORS.length] },
    ]),
  ) satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 select-text">
          <span>Pull Requests</span>
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            {pulls.counts.open} open / {pulls.counts.merged} merged / {pulls.counts.closed} closed
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden">
        {displayData.length === 0 ? (
          <div className="text-muted-foreground flex h-64 items-center justify-center text-sm select-text">
            No pull requests during this period
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={displayData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                fontSize={10}
                interval="preserveStartEnd"
              />
              <YAxis tickLine={false} axisLine={false} fontSize={10} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {allTypes.map((type, i) => (
                <Bar
                  key={type}
                  dataKey={type}
                  stackId="a"
                  fill={`var(--color-${type})`}
                  radius={i === allTypes.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
