import { LoadingLayout } from '../LoadingLayout';

interface AppLoadingPageProps {
  repo: string;
  progress: string;
  onCancel: () => void;
}

export function AppLoadingPage({ repo, progress, onCancel }: AppLoadingPageProps) {
  return (
    <div className="container mx-auto flex h-full flex-col items-center justify-center gap-8 p-4 text-center">
      <LoadingLayout repo={repo} progress={progress} onCancel={onCancel} />
    </div>
  );
}
