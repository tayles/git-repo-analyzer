import { Loader2 } from 'lucide-react';

import { Button } from './ui/button';

interface LoadingLayoutProps {
  repo: string;
  progress: string;
  onCancel: () => void;
}

export function LoadingLayout({ repo, progress, onCancel }: LoadingLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4 text-center">
      <Loader2 className="text-muted-foreground size-10 animate-spin" />
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">Analyzing {repo}...</h1>
        <p className="text-muted-foreground text-sm">{progress}</p>
      </div>
      <Button variant="outline" onClick={onCancel}>
        Cancel Analysis
      </Button>
    </div>
  );
}
