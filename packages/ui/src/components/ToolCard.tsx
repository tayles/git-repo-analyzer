import type {  ToolMetaWithFileMatches } from '@git-repo-analyzer/core';

import { ToolLogo } from './ToolLogo';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ToolCardProps {
  tool: ToolMetaWithFileMatches;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="p-3 gap-2 bg-secondary overflow-hidden">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2 text-sm font-normal">
          <ToolLogo logo={tool.logo} className='size-4' />
          <span className='truncate'>{tool.name}</span>
        </CardTitle>
        {/* {tool.url && <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
          >
            <ExternalLink />
          </Button>
        </CardAction>} */}
      </CardHeader>
      <CardContent className="p-0">
        {tool.paths.map((path) => (
          <Button
          key={path}
            variant="link"
            size="xs"
          >
            {path}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
