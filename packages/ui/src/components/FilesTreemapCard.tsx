import { formatBytes, formatNumber, type FileTreeAnalysis } from '@git-repo-analyzer/core';
import { useCallback } from 'react';
import { Treemap } from 'recharts';

import { InfoButton } from './InfoButton';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';

interface FilesTreemapCardProps {
  data: FileTreeAnalysis;
  repoUrl: string;
  defaultBranch: string;
}

interface TreemapDatum {
  name: string;
  size: number;
  fileCount: number;
  fill: string;
  path: string;
}

export function FilesTreemapCard({ data, repoUrl, defaultBranch }: FilesTreemapCardProps) {
  const chartData: TreemapDatum[] =
    data.directories
      .filter(directory => directory.bytes > 0)
      .slice(0, 20)
      .map((directory, index) => ({
        name: directory.name,
        size: directory.bytes,
        fileCount: directory.fileCount,
        fill: `var(--chart-${(index % 5) + 1})`,
        path: directory.path,
      })) ?? [];

  const handleClick = useCallback(
    (node: { path?: string }) => {
      if (!repoUrl) return;
      const path = node.path;
      if (!path) return;
      const url = path === '.' ? repoUrl : `${repoUrl}/tree/${defaultBranch}/${path}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    [repoUrl, defaultBranch],
  );

  const chartConfig: ChartConfig = Object.fromEntries(
    chartData.map(directory => [directory.name, { label: directory.name, color: directory.fill }]),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 select-text">
          <span>Files & Folders</span>
          <span className="text-muted-foreground text-xs font-normal select-text">
            {formatNumber(data.totalFiles)} files · {formatBytes(data.totalBytes)} total
          </span>
        </CardTitle>
        <CardAction>
          <InfoButton title="Directory Treemap">
            <p className="text-muted-foreground">
              Shows the distribution of file sizes across top-level directories in the repository.
              The size of each rectangle corresponds to the total bytes of files within that
              directory.
            </p>
          </InfoButton>
        </CardAction>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm select-text">No file tree data available</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <Treemap
              data={chartData}
              dataKey="size"
              nameKey="name"
              aspectRatio={4 / 3}
              fill="#fff"
              animationDuration={100}
              onClick={node => handleClick(node as { path?: string })}
              className="cursor-pointer"
            >
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => (
                      <div className="flex w-full min-w-40 items-center justify-between gap-3">
                        <span className="text-muted-foreground">{name}</span>
                        <span className="font-mono tabular-nums">{formatBytes(Number(value))}</span>
                        {'payload' in item && item.payload?.fileCount ? (
                          <span className="text-muted-foreground">
                            {formatNumber(item.payload.fileCount)} files
                          </span>
                        ) : null}
                      </div>
                    )}
                  />
                }
              />
            </Treemap>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
