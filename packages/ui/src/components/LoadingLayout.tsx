import { Loader2 } from 'lucide-react';

import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface LoadingLayoutProps {
  repo: string;
  progressMessage: string;
  progressValue: number;
  onCancel: () => void;
}

export function LoadingLayout({ repo, progressMessage, progressValue, onCancel }: LoadingLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4 text-center">
      <Loader2 className="text-muted-foreground size-10 animate-spin" />
      <div className="flex w-full max-w-sm flex-col gap-3">
        <h1 className="text-lg font-bold">Analyzing {repo}...</h1>
        <Progress value={progressValue} className="h-2" />
        <p className="text-muted-foreground text-sm">{progressMessage}</p>
      </div>
      <Button variant="outline" onClick={onCancel}>
        Cancel Analysis
      </Button>
    </div>
  );
}
