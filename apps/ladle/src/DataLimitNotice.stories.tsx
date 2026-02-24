import { DataLimitNotice } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const DataLimitNotices: Story = () => (
  <div className="max-w-xl space-y-4 p-4">
    <h3 className="text-sm font-medium">Commit limit</h3>
    <DataLimitNotice>Showing last 300 commits only</DataLimitNotice>

    <h3 className="text-sm font-medium">Pull request limit</h3>
    <DataLimitNotice>Showing last 100 pull requests only</DataLimitNotice>

    <h3 className="text-sm font-medium">Timezone warning</h3>
    <DataLimitNotice>
      4 contributors without timezone data — activity times shown as UTC
    </DataLimitNotice>
  </div>
);
