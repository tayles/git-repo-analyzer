import type { ActivityHeatmap } from '@git-repo-analyzer/core';

import { Fragment } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getIntensityColor(value: number, max: number): string {
  if (max === 0 || value === 0) return 'oklch(0.96 0.01 0)';
  const ratio = value / max;
  // oklch green scale
  if (ratio < 0.25) return 'oklch(0.89 0.1 151.09)';
  if (ratio < 0.5) return 'oklch(0.73 0.16 149.44)';
  if (ratio < 0.75) return 'oklch(0.63 0.16 148.38)';
  return 'oklch(0.44 0.12 148.06)';
}

interface ActivityHeatmapChartProps {
  data: ActivityHeatmap;
}

export function ActivityHeatmapChart({ data }: ActivityHeatmapChartProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="mx-auto">
        <TooltipProvider>
          <div className="overflow-x-auto">
            <div
              className="inline-grid gap-[2px]"
              style={{ gridTemplateColumns: `auto repeat(24, 1fr)` }}
            >
              {/* Hour labels */}
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="text-muted-foreground text-center text-[10px]">
                  {h % 3 === 0 ? h : ''}
                </div>
              ))}

              {/* Grid rows */}
              {DAYS.map((day, dayIdx) => (
                <Fragment key={day}>
                  <div className="text-muted-foreground pr-2 text-right text-xs leading-none">
                    {day}
                  </div>
                  {Array.from({ length: 24 }, (_, hour) => {
                    const value = data.grid[dayIdx]![hour]!;
                    return (
                      <Tooltip key={`${dayIdx}-${hour}`}>
                        <TooltipTrigger asChild>
                          <div
                            className="h-4 w-4 rounded-sm"
                            style={{ backgroundColor: getIntensityColor(value, data.maxValue) }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {day} {hour}:00 — {value} commit{value !== 1 ? 's' : ''}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </Fragment>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Less</span>
              {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
                <div
                  key={ratio}
                  className="h-3 w-3 rounded-sm"
                  style={{
                    backgroundColor: getIntensityColor(
                      ratio * (data.maxValue || 1),
                      data.maxValue || 1,
                    ),
                  }}
                />
              ))}
              <span className="text-muted-foreground">More</span>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
