import type { AnalysisResult } from '@git-repo-analyzer/core';
import { X } from 'lucide-react';

import { RepoName } from './RepoName';
import { ToolLogo } from './ToolLogo';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';

function healthScoreColor(score: number): string {
  if (score >= 70) return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
  if (score >= 40) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
  return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
}

interface AnalysisReportCardProps {
  report: AnalysisResult;
  onClick: () => void;
  onDelete: (repo: string) => void;
}

export function AnalysisReportCard({ report, onClick, onDelete }: AnalysisReportCardProps) {
  const healthPercent = Math.round(report.healthScore.overall);

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer gap-0 p-2 hover:bg-gray-50 lg:p-4 dark:hover:bg-gray-800"
    >
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2 overflow-hidden text-sm font-medium">
          <RepoName fullName={report.basicStats.fullName} uid={report.basicStats.owner.id} />
          <Badge className={healthScoreColor(report.healthScore.overall)}>{healthPercent}%</Badge>
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:bg-red-100 hover:text-red-600"
            title="Clear report"
            onClick={e => {
              e.stopPropagation();
              onDelete(report.basicStats.fullName);
            }}
          >
            <X />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex flex-wrap gap-2">
          {report.techStack.tools
            .filter(tool => tool.category !== 'Documentation')
            .map(tool => (
              <div key={tool.name} className="flex items-center gap-2 text-xs">
                <ToolLogo logo={tool.logo} className="size-4" />
                {tool.name}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
