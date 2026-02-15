import { Button } from '../ui/button';

interface SidePanelAnalysisInProgressProps {
  repo: string;
  progress: string;
  onCancel: () => void;
}

export function SidePanelAnalysisInProgress({
  repo,
  progress,
  onCancel,
}: SidePanelAnalysisInProgressProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-lg font-bold">Analyzing {repo}...</h1>
      <p className="text-muted-foreground">{progress}</p>
      <Button variant="outline" onClick={onCancel}>
        Cancel Analysis
      </Button>
    </div>
  );
}
