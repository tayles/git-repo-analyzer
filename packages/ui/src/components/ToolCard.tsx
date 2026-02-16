import type { ToolMetaWithFileMatches } from '@git-repo-analyzer/core';

import { ToolLogo } from './ToolLogo';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ToolCardProps {
  repo: string;
  tool: ToolMetaWithFileMatches;
}

export function ToolCard({ repo, tool }: ToolCardProps) {
  return (
    <Card className="bg-secondary gap-2 overflow-hidden p-3">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2 text-sm font-normal">
          <ToolLogo logo={tool.logo} className="size-4" />
          <span className="truncate">{tool.name}</span>
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
        {tool.paths.map(path => {
          const url = `https://github.com/${repo}/blob/main/${path}`;

          return (
            <Button key={path} variant="link" size="xs" asChild>
              <a href={url}>{path}</a>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
