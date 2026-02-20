import { formatWeekLabel, type PullAnalysis } from '@git-repo-analyzer/core';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';

const chartConfig = {
  opened: {
    label: 'Opened',
    color: 'var(--chart-1)',
  },
  merged: {
    label: 'Merged',
    color: 'var(--chart-2)',
  },
  closed: {
    label: 'Closed',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

interface PullRequestChartProps {
  data: PullAnalysis;
}

export function PullRequestChart({ data }: PullRequestChartProps) {
  const displayData = Object.entries(data.byWeek)
    .slice(-12)
    .map(([week, count]) => ({
      week: formatWeekLabel(week),
      count,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 select-text">
          <span>Pull Requests</span>
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            {data.totalOpen} open / {data.totalMerged} merged
            {data.avgMergeTimeHours != null &&
              ` / avg merge: ${formatDuration(data.avgMergeTimeHours)}`}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden">
        {Object.keys(data.byWeek).length === 0 ? (
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
              <Bar dataKey="count" fill="var(--color-opened)" radius={[2, 2, 0, 0]} stackId="a" />
              {/* <Bar dataKey="merged" fill="var(--color-merged)" radius={[2, 2, 0, 0]} stackId="b" />
              <Bar dataKey="closed" fill="var(--color-closed)" radius={[2, 2, 0, 0]} stackId="c" /> */}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
