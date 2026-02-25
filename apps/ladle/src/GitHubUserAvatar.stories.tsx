import { GitHubUserAvatar } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const GitHubUserAvatars: Story = () => (
  <div className="flex items-center gap-4">
    <GitHubUserAvatar uid={69631} className="size-8" />
    <GitHubUserAvatar uid={9919} className="size-12" />
    <GitHubUserAvatar uid={null} className="size-8" />
  </div>
);
