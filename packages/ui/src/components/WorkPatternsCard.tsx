import type { UserProfile, WorkPatterns } from '@git-repo-analyzer/core';

import { DataLimitNotice } from './DataLimitNotice';
import { InfoButton } from './InfoButton';
import { Badge } from './ui/badge';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

const CLASSIFICATION_LABELS = {
  professional: { label: 'Professional', variant: 'default' as const },
  mixed: { label: 'Mixed', variant: 'secondary' as const },
  hobbyist: { label: 'Hobbyist', variant: 'outline' as const },
} as const;

interface WorkPatternsCardProps {
  data: WorkPatterns;
  selectedUserProfile: UserProfile | null;
  /** Number of recent contributors missing timezone data */
  contributorsMissingTimezone: number;
}

export function WorkPatternsCard({
  data,
  selectedUserProfile,
  contributorsMissingTimezone,
}: WorkPatternsCardProps) {
  const config = CLASSIFICATION_LABELS[data.classification];

  const showTimezoneWarning = contributorsMissingTimezone > 0 && !selectedUserProfile?.timezone;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 select-text">
          <span>Work Patterns</span>
          <Badge variant={config.variant}>{config.label}</Badge>
        </CardTitle>
        <CardAction>
          <InfoButton title="Work Patterns" warning={showTimezoneWarning}>
            <p className="text-muted-foreground">
              Analyzes commit times to classify the project as Professional (mostly 9-5), Hobbyist
              (evenings/weekends), or Mixed. Helps understand the development culture of a project.
            </p>
            {showTimezoneWarning && (
              <DataLimitNotice>
                {contributorsMissingTimezone} contributor
                {contributorsMissingTimezone !== 1 ? 's' : ''} without timezone data — patterns may
                be approximate
              </DataLimitNotice>
            )}
          </InfoButton>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3 select-text">
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
