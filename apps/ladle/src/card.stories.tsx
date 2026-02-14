import type { Story } from '@ladle/react';

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@git-repo-analyzer/ui';

export default {
  title: 'Components/Card',
};

export const Default: Story = () => (
  <Card className="w-[350px]">
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card description goes here.</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Card content goes here. You can put any content inside this area.</p>
    </CardContent>
    <CardFooter>
      <Button>Action</Button>
    </CardFooter>
  </Card>
);

export const SimpleCard: Story = () => (
  <Card className="w-[350px]">
    <CardContent className="pt-6">
      <p>A simple card with just content.</p>
    </CardContent>
  </Card>
);

export const WithoutFooter: Story = () => (
  <Card className="w-[350px]">
    <CardHeader>
      <CardTitle>Repository Analysis</CardTitle>
      <CardDescription>facebook/react</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Commits</span>
          <span className="font-medium">1,234</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Contributors</span>
          <span className="font-medium">42</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Primary Language</span>
          <span className="font-medium">TypeScript</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const Multiple: Story = () => (
  <div className="grid grid-cols-2 gap-4">
    <Card>
      <CardHeader>
        <CardTitle>Card 1</CardTitle>
      </CardHeader>
      <CardContent>Content 1</CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Card 2</CardTitle>
      </CardHeader>
      <CardContent>Content 2</CardContent>
    </Card>
  </div>
);
