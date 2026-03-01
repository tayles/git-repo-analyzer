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
  selectedUserProfile: UserProfile | null;
  onSelectUserProfile: (contributor: UserProfile | null) => void;
  onHoverUserProfile: (contributor: UserProfile | null) => void;
}

export function ContributorCombobox({
  contributors,
  userProfiles,
  selectedUserProfile,
  onSelectUserProfile,
  onHoverUserProfile,
}: ContributorComboboxProps) {
  const items = [
    null,
    ...contributors.slice(0, 10).map(contributor => {
      const profile = userProfiles.find(p => p.login === contributor.login);
      return { contributor, profile };
    }),
  ];

  const profile = selectedUserProfile
    ? (userProfiles.find(p => p.login === selectedUserProfile.login) ?? null)
    : null;

  return (
    <Combobox
      items={items}
      itemToStringLabel={c => c?.login ?? ''}
      itemToStringValue={(c: UserProfile | null) => c?.login ?? ''}
      onValueChange={onSelectUserProfile}
    >
      <ComboboxInput placeholder="Contributors" showClear className="w-45 font-normal sm:w-auto">
        <InputGroupAddon>
          {profile ? <GitHubUserAvatar uid={profile.id} className="size-4" /> : <GlobeIcon />}
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent alignOffset={-28} className="w-60">
        <ComboboxEmpty>No contributors found</ComboboxEmpty>
        <ComboboxList>
          {c => (
            <ComboboxItem
              key={c?.profile?.login ?? 'all'}
              value={c?.profile ?? null}
              onMouseEnter={() => onHoverUserProfile(c?.profile ?? null)}
            >
              {c ? (
                <>
                  <GitHubUserAvatar uid={c.profile?.id} className="size-4" />
                  <span>{c.profile?.login}</span>
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
