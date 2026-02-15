interface SidePanelHomeProps {
  repo: string;
  // history: AnalysisReportHistoryItem[];
}

export function SidePanelHome({ repo }: SidePanelHomeProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
      <div className="text-muted-foreground text-sm">
        Select a report to view details for {repo}
      </div>
    </div>
  );
}
