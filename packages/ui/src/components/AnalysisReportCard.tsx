import type { AnalysisResult } from '@git-repo-analyzer/core';

import { X } from 'lucide-react';

import { RepoName } from './RepoName';
import { ToolLogo } from './ToolLogo';
import { Button } from './ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card';

interface AnalysisReportCardProps {
  report: AnalysisResult;
  onClick: () => void;
  onDelete: (repo: string) => void;
}

export function AnalysisReportCard({ report, onClick, onDelete }: AnalysisReportCardProps) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer gap-0 p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2">
          <RepoName fullName={report.basicStats.fullName} uid={report.basicStats.owner.id} />
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
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
          {report.tooling.tools.map(tool => (
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
