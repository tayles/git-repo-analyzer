import type { ToolMetaWithFileMatches } from '@git-repo-analyzer/core';
import { ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

import { InfoButton } from './InfoButton';
import { ToolLogo } from './ToolLogo';
import { Button } from './ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface TechStackSectionProps {
  repo: string;
  tools: ToolMetaWithFileMatches[];
}

export function TechStackSection({ repo, tools }: TechStackSectionProps) {
  const toolsByCategory = Object.entries(
    tools
      .filter(t => t.category !== 'Community')
      .reduce(
        (acc, tool) => {
          if (!acc[tool.category]) acc[tool.category] = [];
          acc[tool.category].push(tool);
          return acc;
        },
        {} as Record<string, ToolMetaWithFileMatches[]>,
      ),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tech Stack</CardTitle>
        <CardAction>
          <InfoButton title="Tech Stack Detection">
            <p className="text-muted-foreground mt-1">
              Detects the technologies used in the repository by analyzing file names and directory
              structures. Provides insights into the project's development ecosystem.
            </p>
          </InfoButton>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="columns-[180px] gap-4">
          {toolsByCategory.map(([category, categoryTools], categoryIndex) => (
            <motion.div
              key={category}
              className="mb-4 break-inside-avoid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: categoryIndex * 0.04 }}
            >
              <h3 className="text-muted-foreground/70 mb-3 px-2 text-xs font-semibold tracking-wider uppercase">
                {category}
              </h3>
              <ul className="flex flex-col gap-0.5">
                {categoryTools.map(tool => (
                  <li key={tool.name}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="hover:bg-accent flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors">
                          <ToolLogo logo={tool.logo} className="size-6 shrink-0" />
                          <span className="text-md font-medium">{tool.name}</span>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        side="bottom"
                        align="center"
                        className="w-auto max-w-md p-2 text-sm"
                      >
                        <p className="p-2">Files associated with this tool:</p>
                        <ul className="flex list-inside list-disc flex-col p-2">
                          {tool.paths.slice(0, 5).map(path => (
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
                        {tool.url && (
                          <>
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
                          </>
                        )}
                      </PopoverContent>
                    </Popover>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
