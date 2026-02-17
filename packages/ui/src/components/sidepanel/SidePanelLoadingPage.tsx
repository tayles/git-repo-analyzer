import { LoadingLayout } from '../LoadingLayout';

interface SidePanelLoadingPageProps {
  repo: string;
  progress: string;
  onCancel: () => void;
}

export function SidePanelLoadingPage({ repo, progress, onCancel }: SidePanelLoadingPageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-4 text-center">
      <LoadingLayout repo={repo} progress={progress} onCancel={onCancel} />
    </div>
  );
}
