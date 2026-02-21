import { HorizontalBarChart } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const HorizontalBarChartStories: Story = () => {
  return (
    <div className="max-w-lg space-y-8 p-4">
      <div>
        <h3 className="mb-3 text-sm font-medium">Commit types</h3>
        <HorizontalBarChart
          data={{ feat: 42, fix: 28, chore: 19, docs: 11, refactor: 8, test: 5, other: 3 }}
        />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium">PR title types</h3>
        <HorizontalBarChart data={{ feat: 31, fix: 14, chore: 6, docs: 4 }} />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium">Single value</h3>
        <HorizontalBarChart data={{ other: 100 }} />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium">Empty (renders nothing)</h3>
        <HorizontalBarChart data={{}} />
        <p className="text-muted-foreground mt-1 text-xs">(nothing rendered above)</p>
      </div>
    </div>
  );
};
