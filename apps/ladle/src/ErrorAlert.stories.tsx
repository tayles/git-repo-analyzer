import { ErrorAlert } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const ErrorAlerts: Story = () => (
  <div className="flex flex-col gap-4 p-4">
    <ErrorAlert message="Repository not found. Please check the name and try again." />
    <ErrorAlert message="GitHub API rate limit exceeded. Try again later." />
  </div>
);
