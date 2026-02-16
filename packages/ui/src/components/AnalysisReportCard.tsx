import type { AnalysisResult } from '@git-repo-analyzer/core';

import { Button } from './ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface AnalysisReportCardProps {
  report: AnalysisResult;
  onClick: () => void;
  onDelete: (repo: string) => void;
}

export function AnalysisReportCard({ report, onClick, onDelete }: AnalysisReportCardProps) {
  return (
    <Card onClick={onClick}>
      <CardHeader>
        <CardTitle>{report.basicStats.fullName}</CardTitle>
        <CardDescription>{new Date(report.generator.analyzedAt).toLocaleString()}</CardDescription>
        <CardAction>
          <Button
            variant="destructive"
            onClick={e => {
              e.stopPropagation();
              onDelete(report.basicStats.fullName);
            }}
          >
            Delete
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>{report.languages.primaryLanguage}</p>
      </CardContent>
    </Card>
  );
}
