import type { LanguageAnalysis } from '@git-repo-analyzer/core';
import { Cell, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';

interface LanguageChartProps {
  data: LanguageAnalysis;
}

export function LanguageChart({ data }: LanguageChartProps) {
  if (data.langs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No language data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartConfig: ChartConfig = Object.fromEntries(
    data.langs.map(lang => [lang.name, { label: lang.name, color: lang.color }]),
  );

  const chartData = data.langs.slice(0, 8).map(lang => ({
    name: lang.name,
    value: lang.percent,
    fill: lang.color,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Languages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <ChartContainer config={chartConfig} className="h-48 w-48">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
              >
                {chartData.map(entry => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex flex-wrap gap-3">
            {data.langs.slice(0, 8).map(lang => (
              <div key={lang.name} className="flex items-center gap-1.5 text-sm">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: lang.color }} />
                <span>{lang.name}</span>
                <span className="text-muted-foreground">{lang.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
