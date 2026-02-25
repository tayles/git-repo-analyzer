import { Tabs, TabsContent, TabsList, TabsTrigger } from '@git-repo-analyzer/ui';
import type { Story } from '@ladle/react';

export default {
  title: 'Components',
};

export const Tabss: Story = () => (
  <Tabs defaultValue="overview" className="max-w-md">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="commits">Commits</TabsTrigger>
      <TabsTrigger value="prs">PRs</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">Overview content</TabsContent>
    <TabsContent value="commits">Commit activity content</TabsContent>
    <TabsContent value="prs">Pull request content</TabsContent>
  </Tabs>
);
