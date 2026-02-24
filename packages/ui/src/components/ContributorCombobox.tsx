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
  onUserProfileChange: (userProfile: UserProfile | null) => void;
}

export function ContributorCombobox({
  contributors,
  userProfiles,
  selectedUserProfile,
  onUserProfileChange,
}: ContributorComboboxProps) {
  const items = [
    null,
    ...contributors.map(contributor => {
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
      itemToStringLabel={c => c?.profile?.login ?? ''}
      itemToStringValue={(c: { contributor: Contributor; profile: UserProfile } | null) =>
        c?.profile?.login ?? ''
      }
      onValueChange={onUserProfileChange}
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
              key={c?.profile?.login ?? 'all'}
              value={c?.profile ?? null}
              onMouseEnter={() => onUserProfileChange(c?.profile ?? null)}
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
