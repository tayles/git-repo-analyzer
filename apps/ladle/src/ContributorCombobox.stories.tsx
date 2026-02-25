import type { UserProfile } from '@git-repo-analyzer/core';
import { mockResult } from '@git-repo-analyzer/mocks';
import { ContributorCombobox } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';
import { useState } from 'react';

export default {
  title: 'Components',
};

export const ContributorComboboxs: Story = () => {
  const [selected, setSelected] = useState<UserProfile | null>(mockResult.userProfiles[0] ?? null);

  return (
    <div className="max-w-sm">
      <ContributorCombobox
        contributors={mockResult.contributors.recentContributors}
        userProfiles={mockResult.userProfiles}
        selectedUserProfile={selected}
        onUserProfileChange={setSelected}
      />
    </div>
  );
};
