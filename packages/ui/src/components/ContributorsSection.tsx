import type { Contributor, ContributorAnalysis } from '@git-repo-analyzer/core';
import { useCallback } from 'react';

import { cn } from '../lib/utils';
import { GitHubUserAvatar } from './GitHubUserAvatar';
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
  /** The currently selected contributor (null = none selected) */
  selectedContributor: Contributor | null;
  /** Called when a contributor is clicked. Pass the contributor to select, or null to deselect. */
  onSelectContributor: (contributor: Contributor | null) => void;
  onHoverContributor: (contributor: Contributor | null) => void;
}

export function ContributorsSection({
  data,
  selectedContributor,
  onSelectContributor,
  onHoverContributor,
}: ContributorsSectionProps) {
  const handleSelectContributor = useCallback(
    (contributor: Contributor | null) => {
      onSelectContributor(contributor);
      if (!contributor) {
        onHoverContributor(null);
      }
    },
    [onSelectContributor, onHoverContributor],
  );

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-3 select-text">
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
          {data.topContributors.map(c => {
            const isSelected = selectedContributor?.login === c.login;
            return (
              <a
                key={c.login}
                href={c.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'cursor-pointer flex items-center gap-3 rounded-lg p-2 transition-colors',
                  isSelected ? 'bg-primary/10 ring-primary ring-2' : 'hover:bg-muted',
                )}
                onClick={() => handleSelectContributor(isSelected ? null : c)}
                onMouseEnter={() => onHoverContributor(c)}
                onMouseLeave={() => onHoverContributor(null)}
              >
                <GitHubUserAvatar uid={c.id} />

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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
