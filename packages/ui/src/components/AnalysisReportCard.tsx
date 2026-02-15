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
        <CardTitle>{report.repository}</CardTitle>
        <CardDescription>{new Date(report.analyzedAt).toLocaleString()}</CardDescription>
        <CardAction>
          <Button
            variant="link"
            onClick={e => {
              e.stopPropagation();
              onDelete(report.repository);
            }}
          >
            Delete
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>{report.stats.primaryLanguage}</p>
      </CardContent>
    </Card>
  );
}
