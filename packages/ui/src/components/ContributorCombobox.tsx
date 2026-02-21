import { type Contributor, type UserProfile } from '@git-repo-analyzer/core';
import { GlobeIcon } from 'lucide-react';

import { GitHubUserAvatar } from './GitHubUserAvatar';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from './ui/combobox';
import { InputGroupAddon } from './ui/input-group';

interface ContributorComboboxProps {
  contributors: Contributor[];
  userProfiles: UserProfile[];
  selectedContributor: Contributor | null;
  onContributorChange: (contributor: Contributor | null) => void;
}

export function ContributorCombobox({
  contributors,
  userProfiles,
  selectedContributor,
  onContributorChange,
}: ContributorComboboxProps) {
  const items = [
    null,
    ...contributors.map(contributor => {
      const profile = userProfiles.find(p => p.login === contributor.login);
      return { contributor, profile };
    }),
  ];

  const profile = selectedContributor
    ? (userProfiles.find(p => p.login === selectedContributor.login) ?? null)
    : null;

  return (
    <Combobox
      items={items}
      itemToStringLabel={c => c?.login ?? ''}
      itemToStringValue={(c: Contributor | null) => c?.login ?? ''}
      onValueChange={onContributorChange}
    >
      <ComboboxInput placeholder="Recent contributors" showClear>
        <InputGroupAddon>
          {profile ? <GitHubUserAvatar uid={profile.id} className="size-4" /> : <GlobeIcon />}
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent alignOffset={-28} className="w-60">
        <ComboboxEmpty>No contributors found</ComboboxEmpty>
        <ComboboxList>
          {c => (
            <ComboboxItem
              key={c?.contributor.login ?? 'all'}
              value={c?.contributor ?? null}
              onMouseEnter={() => onContributorChange(c.contributor ?? null)}
            >
              {c ? (
                <>
                  <GitHubUserAvatar uid={c.profile?.id} className="size-4" />
                  <span>{c.contributor.login}</span>
                </>
              ) : (
                <>
                  <GlobeIcon />
                  <span>All contributors</span>
                </>
              )}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
