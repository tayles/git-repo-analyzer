import { AnalyzerLogo } from '@git-repo-analyzer/ui';

export function ChromeExtensionSidePanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-120 min-w-86 resize-x flex-col overflow-hidden rounded-lg border">
      <div className="bg-secondary/50 flex items-center gap-2 p-2 text-sm font-medium">
        <AnalyzerLogo className="size-4" />
        Git Repo Analyzer
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
