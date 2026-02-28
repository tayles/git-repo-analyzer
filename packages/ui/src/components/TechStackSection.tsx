import type { ToolMetaWithFileMatches } from '@git-repo-analyzer/core';
import { ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

import { ToolLogo } from './ToolLogo';
import { Button } from './ui/button';
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
    <div className="flex flex-wrap justify-center gap-2">
      {toolsByCategory.map(([category, categoryTools], categoryIndex) =>
        categoryTools.map((tool, toolIndex) => (
          <motion.div
            key={`${category}-${tool.name}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: (categoryIndex + toolIndex) * 0.04 }}
          >
            <Popover>
              <PopoverTrigger asChild>
                <div className="hover:bg-accent flex min-w-20 cursor-pointer break-inside-avoid flex-col items-center justify-end gap-2 rounded-md p-2 transition-colors">
                  <ToolLogo
                    logo={tool.logo}
                    invertColor={tool.silhouette}
                    className="size-6 shrink-0"
                  />
                  <span className="text-sm font-medium">{tool.name}</span>
                </div>
              </PopoverTrigger>
              {tool.paths.length > 0 && (
                <PopoverContent
                  side="bottom"
                  align="center"
                  className="w-auto max-w-md p-2 text-sm"
                >
                  <h3 className="text-muted-foreground/70 mb-3 px-2 text-xs font-semibold tracking-wider uppercase">
                    {category}
                  </h3>
                  <hr />
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
              )}
            </Popover>
          </motion.div>
        )),
      )}
    </div>
  );
}
