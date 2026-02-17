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
        <Card className="hover:bg-accent relative cursor-pointer gap-0 p-3 transition-colors lg:p-4">
          <CardHeader className="gap-0 p-0">
            <CardTitle className="flex items-center gap-2 overflow-hidden text-sm font-normal">
              <ToolLogo logo={tool.logo} className="size-6" />
              <span className="min-w-0 truncate text-lg font-bold">{tool.name}</span>
              <Badge variant="secondary" className="ml-auto text-xs tabular-nums">
                {tool.paths.length}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="center" className="w-auto max-w-md p-2 text-sm">
        <p className="p-2">Files associated with this tool:</p>
        <ul className="flex list-inside list-disc flex-col p-2">
          {tool.paths.map(path => (
            <li key={path}>
              <Button variant="link" size="sm" asChild>
                <a
                  href={`https://github.com/${repo}/blob/main/${path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {path}
                </a>
              </Button>
            </li>
          ))}
        </ul>
        <hr />
        <Button variant="link" size="sm" asChild className="mt-2">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            Read the docs
            <ExternalLink className="size-3.5" />
          </a>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
