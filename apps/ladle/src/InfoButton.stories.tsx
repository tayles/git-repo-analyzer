import { DataLimitNotice, InfoButton } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const InfoButtons: Story = () => (
  <div className="flex flex-col gap-8 p-8">
    <div>
      <h3 className="mb-4 text-sm font-medium">Default InfoButton</h3>
      <InfoButton>This is a helpful tooltip explaining something important.</InfoButton>
    </div>

    <div>
      <h3 className="mb-4 text-sm font-medium">Warning InfoButton</h3>
      <InfoButton warning title="Data Limit">
        <DataLimitNotice>Showing last 300 commits only</DataLimitNotice>
      </InfoButton>
    </div>

    <div>
      <h3 className="mb-4 text-sm font-medium">With Rich Content + Warning</h3>
      <InfoButton title="Activity Heatmap" warning>
        <p className="text-muted-foreground">
          Shows when commits happen throughout the week. Each cell represents an hour of a day, with
          darker colors indicating more commit activity during that time.
        </p>
        <DataLimitNotice>
          4 contributors without timezone data — activity times shown as UTC
        </DataLimitNotice>
      </InfoButton>
    </div>

    <div>
      <h3 className="mb-4 text-sm font-medium">In Context (Header)</h3>
      <div className="bg-card flex items-center justify-between rounded-lg border p-4">
        <span className="font-semibold">Card Title</span>
        <InfoButton>
          Information about this card's content and how to interpret the data shown.
        </InfoButton>
      </div>
    </div>
  </div>
);
