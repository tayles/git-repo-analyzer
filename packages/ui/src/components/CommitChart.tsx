import { formatWeekLabel, type BucketByWeek } from '@git-repo-analyzer/core';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';

const chartConfig = {
  count: {
    label: 'Commits',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

interface CommitChartProps {
  data: BucketByWeek;
}

export function CommitChart({ data }: CommitChartProps) {
  // Show last 12 weeks for readability
  const displayData = Object.entries(data)
    .slice(-12)
    .map(([week, count]) => ({
      week: formatWeekLabel(week),
      count,
    }));

  if (displayData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commit Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No commit data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Commit Activity
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            {data.totalCommits} total
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            <Bar dataKey="count" fill="var(--color-count)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
