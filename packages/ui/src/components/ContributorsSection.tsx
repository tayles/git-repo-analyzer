import {
  CONTRIBUTORS_FETCH_LIMIT,
  type ContributorAnalysis,
  type UserProfile,
} from '@git-repo-analyzer/core';
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
  selectedUserProfile: UserProfile | null;
  hoveredUserProfile: UserProfile | null;
  /** Called when a contributor is clicked. Pass the contributor to select, or null to deselect. */
  onSelectUserProfile: (contributor: UserProfile | null) => void;
  onHoverUserProfile: (contributor: UserProfile | null) => void;
}

export function ContributorsSection({
  contributors,
  userProfiles,
  selectedUserProfile,
  hoveredUserProfile,
  onSelectUserProfile,
  onHoverUserProfile,
}: ContributorsSectionProps) {
  const [tab, setTab] = useState<'recent' | 'top'>('recent');

  const handleSelectUserProfile = useCallback(
    (userProfile: UserProfile | null) => {
      onSelectUserProfile(userProfile);
      if (!userProfile) {
        onHoverUserProfile(null);
      }
    },
    [onSelectUserProfile, onHoverUserProfile],
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

  const numContributors =
    contributors.totalContributors >= CONTRIBUTORS_FETCH_LIMIT
      ? `${CONTRIBUTORS_FETCH_LIMIT}+`
      : contributors.totalContributors.toString();

  // show tabs if top contributors !== recent contributors
  const showTabs =
    contributors.topContributors
      .slice(0, 10)
      .map(c => c.login)
      .sort()
      .join(',') !==
    contributors.recentContributors
      .slice(0, 10)
      .map(c => c.login)
      .sort()
      .join(',');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-3 select-text">
          <span>Contributors</span>
          <Badge variant="secondary">{TEAM_SIZE_LABELS[contributors.teamSize]}</Badge>
          <Badge variant={contributors.busFactor < 3 ? 'destructive' : 'secondary'}>
            Bus factor: {contributors.busFactor}
          </Badge>
          {contributors.totalContributors > 1 && (
            <span className="text-muted-foreground text-sm font-normal">
              {numContributors} total
            </span>
          )}
          <span className="flex-1"></span>
          {showTabs && (
            <Tabs value={tab} onValueChange={v => setTab(v as 'recent' | 'top')}>
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="top">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          <InfoButton title="Contributors">
            <p className="text-muted-foreground">
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
            const isSelected = selectedUserProfile?.login === c.contributor.login;
            return (
              <a
                key={c.contributor.login}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'cursor-pointer flex items-center gap-3 rounded-lg p-2 transition-colors',
                  hoveredUserProfile?.login === c.contributor.login && 'bg-muted',
                  isSelected ? 'bg-primary/10 ring-primary ring-2' : 'hover:bg-muted',
                )}
                onClick={() => handleSelectUserProfile(isSelected ? null : (c.profile ?? null))}
                onMouseEnter={() => onHoverUserProfile(c.profile ?? null)}
                onMouseLeave={() => onHoverUserProfile(null)}
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
                    {c.contributor.contributions.toLocaleString()} commit
                    {c.contributor.contributions !== 1 ? 's' : ''}
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
