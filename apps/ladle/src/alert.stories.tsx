import { Alert, AlertDescription, AlertTitle } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const Alerts: Story = () => (
  <div className="grid max-w-lg gap-3">
    <Alert>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>This repository has limited recent activity.</AlertDescription>
    </Alert>
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Failed to fetch repository data.</AlertDescription>
    </Alert>
  </div>
);
