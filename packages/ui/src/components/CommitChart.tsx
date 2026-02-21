import { formatWeekLabel, type CommitsPerWeek } from '@git-repo-analyzer/core';
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

interface CommitChartProps {
  data: CommitsPerWeek;
}

export function CommitChart({ data }: CommitChartProps) {
  // Show last 12 weeks for readability
  const entries = Object.entries(data).slice(-12);

  // Collect all unique commit types across visible weeks
  const allTypes = Array.from(new Set(entries.flatMap(([, v]) => Object.keys(v.byType)))).sort();

  const displayData = entries.map(([week, v]) => {
    const row: Record<string, string | number> = { week: formatWeekLabel(week) };
    for (const type of allTypes) {
      row[type] = v.byType[type] ?? 0;
    }
    return row;
  });

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
          <span>Commit Activity</span>
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
