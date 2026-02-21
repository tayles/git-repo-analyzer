import { formatWeekLabel, type CommitsPerWeek } from '@git-repo-analyzer/core';
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
  data: CommitsPerWeek;
}

export function CommitChart({ data }: CommitChartProps) {
  // Show last 12 weeks for readability
  const displayData = Object.entries(data)
    .slice(-12)
    .map(([week, v]) => ({
      week: formatWeekLabel(week),
      count: Object.values(v),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 select-text">
          <span>Commit Activity</span>
          {/* {displayData.length > 0 && (
            <span className="text-muted-foreground text-sm font-normal">
              {data.totalCommits} total
            </span>
          )} */}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        {displayData.length < 1 ? (
          <div className="text-muted-foreground flex h-64 items-center justify-center text-sm select-text">
            No commits during this period
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
              <Bar dataKey="count" fill="var(--color-count)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
