import type { ToolMeta } from '@git-repo-analyzer/core';

import { ToolLogo } from './ToolLogo';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface ToolCardProps {
  tool: ToolMeta;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{tool.name}</CardTitle>
        <CardDescription>
          <Button variant="link">{tool.url}</Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ToolLogo logo={tool.logo} />
      </CardContent>
    </Card>
  );
}
