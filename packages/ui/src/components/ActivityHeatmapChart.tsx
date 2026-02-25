import {
  type ActivityHeatmap,
  type ContributorAnalysis,
  type UserProfile,
} from '@git-repo-analyzer/core';
import { Fragment } from 'react';

import { useTheme } from '../hooks/use-theme';
import { cn } from '../lib/utils';
import { ContributorCombobox } from './ContributorCombobox';
import { DataLimitNotice } from './DataLimitNotice';
import { InfoButton } from './InfoButton';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TIME_PERIODS = [
  { label: 'Morning', start: 0, end: 8 },
  { label: 'Daytime', start: 9, end: 17 },
  { label: 'Evening', start: 18, end: 23 },
] as const;

function getIntensityColor(value: number, max: number, theme: 'light' | 'dark'): string {
  const ratio = value / max;

  switch (theme) {
    case 'light':
      if (max === 0 || value === 0) return 'oklch(0.96 0.01 0)';
      // oklch green scale
      if (ratio < 0.25) return 'oklch(0.89 0.1 151.09)';
      if (ratio < 0.5) return 'oklch(0.73 0.16 149.44)';
      if (ratio < 0.75) return 'oklch(0.63 0.16 148.38)';
      else return 'oklch(0.44 0.12 148.06)';
    case 'dark':
      if (max === 0 || value === 0) return 'oklch(0.3 0 0)';
      if (ratio < 0.25) return 'oklch(0.45 0.12 145)';
      if (ratio < 0.5) return 'oklch(0.55 0.16 145)';
      if (ratio < 0.75) return 'oklch(0.65 0.2 145)';
      return 'oklch(0.75 0.22 145)';
  }
}

interface ActivityHeatmapChartProps {
  data: ActivityHeatmap;
  contributors: ContributorAnalysis;
  userProfiles: UserProfile[];
  primaryTimezone: string | null;
  /** When set, indicates the heatmap is filtered for a specific user profile */
  selectedUserProfile: UserProfile | null;
  onUserProfileChange: (userProfile: UserProfile | null) => void;
  /** Number of recent contributors missing timezone data */
  contributorsMissingTimezone: number;
}

export function ActivityHeatmapChart({
  data,
  contributors,
  userProfiles,
  selectedUserProfile,
  primaryTimezone: _primaryTimezone,
  onUserProfileChange,
  contributorsMissingTimezone,
}: ActivityHeatmapChartProps) {
  const theme = useTheme();

  const showTimezoneWarning = contributorsMissingTimezone > 0 && !selectedUserProfile?.timezone;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 select-text">
          <span className="flex-1">Activity Heatmap</span>
          {contributors.recentContributors.length > 1 && (
            <ContributorCombobox
              contributors={contributors.recentContributors}
              userProfiles={userProfiles}
              selectedUserProfile={selectedUserProfile}
              onUserProfileChange={onUserProfileChange}
            />
          )}

          <InfoButton title="Activity Heatmap" warning={showTimezoneWarning}>
            <p className="text-muted-foreground">
              Shows when commits happen throughout the week. Each cell represents an hour of a day,
              with darker colors indicating more commit activity during that time.
            </p>
            {showTimezoneWarning && (
              <DataLimitNotice>
                {contributorsMissingTimezone} contributor
                {contributorsMissingTimezone !== 1 ? 's' : ''} without timezone data - some activity
                times shown as UTC
              </DataLimitNotice>
            )}
          </InfoButton>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div>
          <div
            className="inline-grid gap-[2px]"
            style={{ gridTemplateColumns: `auto repeat(24, 1fr)` }}
          >
            {/* Hour labels */}
            <div />
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
                          style={{
                            backgroundColor: getIntensityColor(value, data.maxValue, theme),
                          }}
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

            <div />
            {TIME_PERIODS.map(period => (
              <div
                key={period.label}
                className={cn(
                  'text-muted-foreground text-center text-[10px]',
                  period.label === 'Daytime' && 'border-x',
                )}
                role="note"
                style={{
                  gridColumn: `${period.start + 2} / span ${period.end - period.start + 1}`,
                }}
              >
                {period.label}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground">Less</span>
            {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
              <div
                key={ratio}
                className="h-3 w-3 rounded-sm"
                style={{
                  backgroundColor: getIntensityColor(
                    ratio * (data.maxValue || 1),
                    data.maxValue || 1,
                    theme,
                  ),
                }}
              />
            ))}
            <span className="text-muted-foreground">More</span>

            {selectedUserProfile?.timezone && (
              <span className="text-muted-foreground flex-1 text-right text-xs text-nowrap">
                Timezone: {selectedUserProfile.timezone}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
