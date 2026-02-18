import { InfoButton } from '@git-repo-analyzer/ui';
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
      <h3 className="mb-4 text-sm font-medium">With Rich Content</h3>
      <InfoButton>
        <p className="font-medium">Activity Heatmap</p>
        <p className="text-muted-foreground mt-1">
          Shows when commits happen throughout the week. Each cell represents an hour of a day, with
          darker colors indicating more commit activity during that time.
        </p>
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
