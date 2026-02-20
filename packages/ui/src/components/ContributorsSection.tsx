import type { ContributorAnalysis } from '@git-repo-analyzer/core';

import { InfoButton } from './InfoButton';
import { Badge } from './ui/badge';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';

const TEAM_SIZE_LABELS = {
  solo: 'Solo Developer',
  small: 'Small Team',
  medium: 'Medium Team',
  large: 'Large Team',
} as const;

interface ContributorsSectionProps {
  data: ContributorAnalysis;
}

export function ContributorsSection({ data }: ContributorsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 select-text">
          <span>Contributors</span>
          <Badge variant="secondary">{TEAM_SIZE_LABELS[data.teamSize]}</Badge>
          <span className="text-muted-foreground text-sm font-normal">
            {data.totalContributors} total / bus factor: {data.busFactor}
          </span>
        </CardTitle>
        <CardAction>
          <InfoButton title="Contributors">
            <p className="text-muted-foreground mt-1">
              Shows top contributors by commit count. Bus factor indicates how many key developers
              the project depends on — a higher number means knowledge is better distributed across
              the team.
            </p>
          </InfoButton>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.topContributors.map(c => (
            <a
              key={c.login}
              href={c.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-muted flex items-center gap-3 rounded-lg p-2 transition-colors"
            >
              <img
                src={c.avatarUrl}
                alt={c.login}
                className="h-8 w-8 rounded-full"
                loading="lazy"
              />
              <div className="min-w-0 flex-1 select-text">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-medium">{c.login}</p>
                  {c.flag && (
                    <span className="text-base leading-none" title={c.country ?? undefined}>
                      {c.flag}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">
                  {c.contributions.toLocaleString()} commits
                  {c.location && (
                    <>
                      {' · '}
                      <span title={c.timezone ?? undefined}>{c.location}</span>
                    </>
                  )}
                </p>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
