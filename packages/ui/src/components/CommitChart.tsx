import { COMMIT_FETCH_LIMIT, formatWeekLabel, type CommitsPerWeek } from '@git-repo-analyzer/core';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { DataLimitNotice } from './DataLimitNotice';
import { InfoButton } from './InfoButton';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';

interface CommitChartProps {
  data: CommitsPerWeek;
  /** Total number of commits fetched (used to detect pagination limit) */
  totalCommits: number;
}

export function CommitChart({ data, totalCommits }: CommitChartProps) {
  const isCapped = totalCommits != null && totalCommits >= COMMIT_FETCH_LIMIT;
  // Show last 12 weeks for readability
  const entries = Object.entries(data).slice(-12);

  const displayData = entries.map(([week, v]) => ({ week: formatWeekLabel(week), total: v.total }));

  const chartConfig = {} satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="select-text">Commit Activity</CardTitle>
        <CardAction>
          <InfoButton warning={isCapped} title="Commits">
            <p className="text-muted-foreground">Shows the number of commits per week.</p>
            <DataLimitNotice>Showing last {COMMIT_FETCH_LIMIT} commits only</DataLimitNotice>
          </InfoButton>
        </CardAction>
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
              <Bar dataKey="total" stackId="a" fill={`var(--chart-1)`} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
