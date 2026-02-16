import type { WorkPatterns } from '@git-repo-analyzer/core';

import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

const CLASSIFICATION_LABELS = {
  professional: { label: 'Professional', variant: 'default' as const },
  mixed: { label: 'Mixed', variant: 'secondary' as const },
  hobbyist: { label: 'Hobbyist', variant: 'outline' as const },
} as const;

interface WorkPatternsCardProps {
  data: WorkPatterns;
}

export function WorkPatternsCard({ data }: WorkPatternsCardProps) {
  const config = CLASSIFICATION_LABELS[data.classification];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span>Work Patterns</span>
          <Badge variant={config.variant}>{config.label}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>Work Hours (9-5 weekdays)</span>
            <span className="text-muted-foreground">{data.workHoursPercent}%</span>
          </div>
          <Progress value={data.workHoursPercent} className="h-2" />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>Evenings (weekday off-hours)</span>
            <span className="text-muted-foreground">{data.eveningsPercent}%</span>
          </div>
          <Progress value={data.eveningsPercent} className="h-2" />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>Weekends</span>
            <span className="text-muted-foreground">{data.weekendsPercent}%</span>
          </div>
          <Progress value={data.weekendsPercent} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
