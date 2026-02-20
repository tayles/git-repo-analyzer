import { type Contributor } from '@git-repo-analyzer/core';
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
  selectedContributor: Contributor | null;
  onContributorChange: (contributor: Contributor | null) => void;
}

export function ContributorCombobox({
  contributors,
  selectedContributor,
  onContributorChange,
}: ContributorComboboxProps) {
  const items = [null, ...contributors];

  return (
    <Combobox
      items={items}
      itemToStringLabel={c => c?.login ?? ''}
      itemToStringValue={(c: Contributor | null) => c?.login ?? ''}
      onValueChange={onContributorChange}
    >
      <ComboboxInput placeholder="All contributors" showClear>
        <InputGroupAddon>
          {selectedContributor ? (
            <GitHubUserAvatar uid={selectedContributor.id} className="size-4" />
          ) : (
            <GlobeIcon />
          )}
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent alignOffset={-28} className="w-60">
        <ComboboxEmpty>No contributors found</ComboboxEmpty>
        <ComboboxList>
          {c => (
            <ComboboxItem key={c?.id} value={c} onMouseEnter={() => onContributorChange(c)}>
              {c ? (
                <>
                  <GitHubUserAvatar uid={c.id} className="size-4" />
                  <span>{c.login}</span>
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
