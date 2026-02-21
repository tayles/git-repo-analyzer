import { formatWeekLabel, type PullsPerWeek } from '@git-repo-analyzer/core';
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

interface PullRequestChartProps {
  data: PullsPerWeek;
}

export function PullRequestChart({ data }: PullRequestChartProps) {
  const displayData = Object.entries(data)
    .slice(-12)
    .map(([week, v]) => ({
      week: formatWeekLabel(week),
      count: v.byType['open'] ?? 0,
    }));

  const totalOpen = Object.values(data).reduce((sum, v) => sum + (v.byType['open'] ?? 0), 0);
  const totalMerged = Object.values(data).reduce((sum, v) => sum + (v.byType['merged'] ?? 0), 0);
  const totalClosed = Object.values(data).reduce((sum, v) => sum + (v.byType['closed'] ?? 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 select-text">
          <span>Pull Requests</span>
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            {totalOpen} open / {totalMerged} merged / {totalClosed} closed
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden">
        {Object.keys(displayData).length === 0 ? (
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
