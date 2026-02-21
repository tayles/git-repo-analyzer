import type { Contributor, ContributorAnalysis, UserProfile } from '@git-repo-analyzer/core';
import { useCallback, useState } from 'react';

import { cn } from '../lib/utils';
import { GitHubUserAvatar } from './GitHubUserAvatar';
import { InfoButton } from './InfoButton';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

const TEAM_SIZE_LABELS = {
  solo: 'Solo Developer',
  small: 'Small Team',
  medium: 'Medium Team',
  large: 'Large Team',
} as const;

interface ContributorsSectionProps {
  contributors: ContributorAnalysis;
  userProfiles: UserProfile[];
  /** The currently selected contributor (null = none selected) */
  selectedContributor: Contributor | null;
  /** Called when a contributor is clicked. Pass the contributor to select, or null to deselect. */
  onSelectContributor: (contributor: Contributor | null) => void;
  onHoverContributor: (contributor: Contributor | null) => void;
}

export function ContributorsSection({
  contributors,
  userProfiles,
  selectedContributor,
  onSelectContributor,
  onHoverContributor,
}: ContributorsSectionProps) {
  const [tab, setTab] = useState<'recent' | 'top'>('recent');

  const handleSelectContributor = useCallback(
    (contributor: Contributor | null) => {
      onSelectContributor(contributor);
      if (!contributor) {
        onHoverContributor(null);
      }
    },
    [onSelectContributor, onHoverContributor],
  );

  const activeContributors =
    tab === 'recent' ? contributors.recentContributors : contributors.topContributors;

  const decoratedContributors = activeContributors.slice(0, 10).map(contributor => {
    const profile = userProfiles.find(p => p.login === contributor.login);
    return {
      contributor,
      profile,
      url: profile ? profile.htmlUrl : `https://github.com/${contributor.login}`,
    };
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-3 select-text">
          <span>Contributors</span>
          <Badge variant="secondary">{TEAM_SIZE_LABELS[contributors.teamSize]}</Badge>
          <span className="text-muted-foreground flex-1 text-sm font-normal">
            {contributors.totalContributors} total / bus factor: {contributors.busFactor}
          </span>
          <Tabs value={tab} onValueChange={v => setTab(v as 'recent' | 'top')}>
            <TabsList>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="top">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
          <InfoButton title="Contributors">
            <p className="text-muted-foreground mt-1">
              Shows top contributors by commit count. Bus factor indicates how many key developers
              the project depends on — a higher number means knowledge is better distributed across
              the team.
            </p>
          </InfoButton>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
          {decoratedContributors.map(c => {
            const isSelected = selectedContributor?.login === c.contributor.login;
            return (
              <a
                key={c.contributor.login}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'cursor-pointer flex items-center gap-3 rounded-lg p-2 transition-colors',
                  isSelected ? 'bg-primary/10 ring-primary ring-2' : 'hover:bg-muted',
                )}
                onClick={() => handleSelectContributor(isSelected ? null : c.contributor)}
                onMouseEnter={() => onHoverContributor(c.contributor)}
                onMouseLeave={() => onHoverContributor(null)}
              >
                <GitHubUserAvatar uid={c.profile?.id} />

                <div className="min-w-0 flex-1 select-text">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-medium">{c.contributor.login}</p>
                    {c.profile?.flag && (
                      <span
                        className="text-base leading-none"
                        title={c.profile.country ?? undefined}
                      >
                        {c.profile.flag}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {c.contributor.contributions.toLocaleString()} commits
                    {c.profile?.location && (
                      <>
                        {' · '}
                        <span title={c.profile?.timezone ?? undefined}>{c.profile?.location}</span>
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
