import { RepoName } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const RepoNames: Story = () => (
  <div className="flex flex-col gap-4 p-4 text-lg">
    <RepoName fullName="facebook/docusaurus" uid={69631} />
    <RepoName fullName="vercel/next.js" uid={14985020} />
    <RepoName fullName="microsoft/typescript" uid={6154722} />
  </div>
);
