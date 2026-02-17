import { LoadingLayout } from '../LoadingLayout';

interface AppLoadingPageProps {
  repo: string;
  progressMessage: string;
  progressValue: number;
  onCancel: () => void;
}

export function AppLoadingPage({ repo, progressMessage, progressValue, onCancel }: AppLoadingPageProps) {
  return (
    <div className="container mx-auto flex h-full flex-col items-center justify-center gap-8 p-4 text-center">
      <LoadingLayout repo={repo} progressMessage={progressMessage} progressValue={progressValue} onCancel={onCancel} />
    </div>
  );
}
