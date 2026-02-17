import type { ToolMetaWithFileMatches } from '@git-repo-analyzer/core';

import { ExternalLink } from 'lucide-react';

import { ToolLogo } from './ToolLogo';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface ToolCardProps {
  repo: string;
  tool: ToolMetaWithFileMatches;
}

export function ToolCard({ repo, tool }: ToolCardProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Card className="group bg-muted/60 hover:bg-muted relative cursor-pointer gap-2 overflow-hidden p-3 transition-colors lg:p-4">
          <CardHeader className="p-0">
            <CardTitle className="flex items-center gap-2 text-sm font-normal">
              <ToolLogo logo={tool.logo} className="size-4" />
              <span className="truncate font-bold">{tool.name}</span>
              <Badge variant="secondary" className="ml-auto text-xs tabular-nums">
                {tool.paths.length}
              </Badge>
              {tool.url && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  asChild
                >
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-auto max-w-md p-2">
        <ul className="flex flex-col gap-0.5">
          {tool.paths.map(path => (
            <li key={path}>
              <a
                href={`https://github.com/${repo}/blob/main/${path}`}
                className="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {path}
              </a>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
