import { LoadingLayout } from '../LoadingLayout';

interface SidePanelLoadingPageProps {
  repo: string;
  progressMessage: string;
  progressValue: number;
  onCancel: () => void;
}

export function SidePanelLoadingPage({
  repo,
  progressMessage,
  progressValue,
  onCancel,
}: SidePanelLoadingPageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-4 text-center">
      <LoadingLayout
        repo={repo}
        progressMessage={progressMessage}
        progressValue={progressValue}
        onCancel={onCancel}
      />
    </div>
  );
}
