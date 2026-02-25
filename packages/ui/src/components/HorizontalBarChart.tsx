import { cn } from '../lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

/** Minimum percentage width a segment must occupy to show an inline label. */
const LABEL_MIN_PCT = 8;

interface HorizontalBarChartProps {
  data: Record<string, number>;
  className?: string;
}

/**
 * A simple horizontal stacked bar that visualises a breakdown of labelled counts.
 * Labels are shown inline when the segment is wide enough; tooltips show label + %.
 * Renders nothing when there is no data.
 */
export function HorizontalBarChart({ data, className }: HorizontalBarChartProps) {
  const entries = Object.entries(data)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) return null;

  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  return (
    <div className={cn(className)}>
      <div className="flex h-5 w-full overflow-hidden rounded-full">
        {entries.map(([key, value], i) => {
          const pct = (value / total) * 100;
          const showLabel = pct >= LABEL_MIN_PCT;
          return (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <div
                  className="relative flex h-full cursor-default items-center justify-center overflow-hidden"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                  }}
                >
                  {showLabel && (
                    <span className="truncate px-1.5 text-[10px] leading-none font-medium text-white mix-blend-plus-lighter select-none">
                      {key}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {key}: {Math.round(pct)}%
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
