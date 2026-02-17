import type { HealthScore, HealthScoreAnalysis } from '@git-repo-analyzer/core';

import { Cell, Pie, PieChart } from 'recharts';

import { cn } from '../lib/utils';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';

function getScoreColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 70) return 'hsl(142, 76%, 36%)'; // green
  if (pct >= 40) return 'hsl(48, 96%, 53%)'; // yellow
  return 'hsl(0, 84%, 60%)'; // red
}

function getScoreColorClass(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 70) return 'text-green-600 dark:text-green-500';
  if (pct >= 40) return 'text-yellow-600 dark:text-yellow-500';
  return 'text-red-600 dark:text-red-500';
}

function CategoryDonut({
  name,
  score,
  maxScore,
  details,
}: HealthScore & {
  name: string;
}) {
  const percentage = Math.round((score / maxScore) * 100);
  const scoreColor = getScoreColor(score, maxScore);
  const scoreColorClass = getScoreColorClass(score, maxScore);

  const chartData = [
    { name: 'score', value: score, fill: scoreColor },
    { name: 'remaining', value: maxScore - score, fill: 'hsl(var(--muted))' },
  ];

  const config: ChartConfig = {
    score: { label: 'Score', color: scoreColor },
    remaining: { label: 'Remaining', color: 'hsl(var(--muted))' },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>{name}</span>
          <Badge variant="outline" className={`font-bold ${scoreColorClass}`}>
            {percentage}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-center">
          <ChartContainer config={config} className="h-32 w-32">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-2xl font-bold"
              >
                {score}
              </text>
              <text
                x="50%"
                y="50%"
                dy={20}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-xs"
              >
                / {maxScore}
              </text>
            </PieChart>
          </ChartContainer>
        </div>

        <div className="space-y-2">
          {details.map((detail, idx) => (
            <div
              key={idx}
              className={cn(
                'bg-muted/50 flex items-start gap-2 rounded-md px-3 py-2 text-sm leading-snug font-medium',
                detail.delta > 0 && 'text-green-700 dark:text-green-400',
                detail.delta < 0 && 'text-red-700 dark:text-red-400',
                detail.delta === 0 && 'text-muted-foreground',
              )}
            >
              <span className="w-3">{detail.delta > 0 ? '✓' : detail.delta < 0 ? '✗' : '•'}</span>
              <span>{detail.message}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface HealthScoreCardProps {
  health: HealthScoreAnalysis;
}
export function HealthScoreCard({ health }: HealthScoreCardProps) {
  const overallPercentage = Math.round((health.overall / 100) * 100);
  const overallColor = getScoreColor(health.overall, 100);
  const overallColorClass = getScoreColorClass(health.overall, 100);

  const chartData = [
    { name: 'score', value: health.overall, fill: overallColor },
    { name: 'remaining', value: 100 - health.overall, fill: 'hsl(var(--muted))' },
  ];

  const config: ChartConfig = {
    score: { label: 'Score', color: overallColor },
    remaining: { label: 'Remaining', color: 'hsl(var(--muted))' },
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Overall Health Score</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <ChartContainer config={config} className="h-48 w-48">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-5xl font-bold"
              >
                {health.overall}
              </text>
              <text
                x="50%"
                y="50%"
                dy={30}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-sm"
              >
                / 100
              </text>
            </PieChart>
          </ChartContainer>
          <Badge variant="outline" className={`text-lg font-bold ${overallColorClass}`}>
            {overallPercentage}% Health
          </Badge>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <section className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {Object.entries(health.categories).map(([category, cat]) => (
          <CategoryDonut
            key={category}
            name={category}
            score={cat.score}
            maxScore={cat.maxScore}
            details={cat.details}
          />
        ))}
      </section>
    </div>
  );
}
