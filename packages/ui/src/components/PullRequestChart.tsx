import {
  formatWeekLabel,
  PR_FETCH_LIMIT,
  type PullAnalysis,
  type PullsPerWeek,
} from '@git-repo-analyzer/core';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { DataLimitNotice } from './DataLimitNotice';
import { InfoButton } from './InfoButton';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from './ui/chart';

interface PullRequestChartProps {
  pulls: PullAnalysis;
  data: PullsPerWeek;
}

export function PullRequestChart({ pulls, data }: PullRequestChartProps) {
  const isCapped = pulls.pulls.length >= PR_FETCH_LIMIT;
  const displayData = Object.entries(data)
    .slice(-12)
    .map(([week, v]) => ({
      week: formatWeekLabel(week),
      ...v.byStatus,
    }));

  const STATUS_KEYS = ['open', 'merged', 'closed'] as const;

  const chartConfig = {
    open: { label: 'Opened' },
    merged: { label: 'Merged' },
    closed: { label: 'Closed' },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 select-text">
          <span>Pull Requests</span>
          <span className="text-muted-foreground ml-2 text-xs font-normal">
            {pulls.counts.open} open / {pulls.counts.merged} merged / {pulls.counts.closed} closed
          </span>
        </CardTitle>
        <CardAction>
          <InfoButton warning={isCapped} title="Pull Requests">
            <p className="text-muted-foreground">
              Shows the number of pull requests opened, merged, and closed each week.
            </p>
            <DataLimitNotice>Showing last {PR_FETCH_LIMIT} pull requests only</DataLimitNotice>
          </InfoButton>
        </CardAction>
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
              {STATUS_KEYS.map((status, i) => (
                <Bar
                  key={status}
                  dataKey={status}
                  stackId="a"
                  fill={`var(--chart-${i + 1})`}
                  radius={i === STATUS_KEYS.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
