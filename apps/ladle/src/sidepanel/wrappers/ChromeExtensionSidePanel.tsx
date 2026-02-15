export function ChromeExtensionSidePanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-120 min-w-86 resize-x flex-col overflow-hidden rounded-lg border">
      <div className="bg-secondary/50 p-2 text-sm font-medium">Git Repo Analyzer</div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
