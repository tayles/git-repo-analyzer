import type { AnalysisResult } from '@git-repo-analyzer/core';

import { Calendar, ChevronLeft, CircleDot, Code, Eye, HardDrive, RefreshCw, Scale, Split, Star } from 'lucide-react';

import { Card, CardHeader, CardTitle } from '../ui/card';
import { RepoName } from '../RepoName';
import { Button } from '../ui/button';
import { CardAction, CardContent } from '../ui/card';
import { ToolCard } from '../ToolCard';

interface SidePanelRepoDetailsProps {
  report: AnalysisResult;
  onBack: () => void;
  onRefresh: () => void;
}

export function SidePanelRepoDetails({ report, onBack, onRefresh }: SidePanelRepoDetailsProps) {
  return (
    <div className="flex h-full flex-col justify-start gap-2 p-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft />
          Back
        </Button>
        <Button variant="ghost" onClick={onRefresh}>
          <RefreshCw />
          Refresh
        </Button>
      </div>

      <div className="flex h-full flex-col justify-start gap-2 p-2">
        <h2 className="mb-2 text-xl font-semibold">
          <RepoName fullName={report.basicStats.fullName} uid={report.basicStats.owner.id} />
        </h2>
      </div>

      {/* Stats */}
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 p-2">
          <StatCard
            label="Stars"
            value={report.basicStats.stars}
            icon={<Star className="size-4" />}
          />
          <StatCard
            label="Forks"
            value={report.basicStats.forks}
            icon={<Split  className="size-4" />}
          />
          <StatCard
            label="Open Issues"
            value={report.basicStats.openIssues}
            icon={<CircleDot className="size-4" />}
          />
          <StatCard
            label="Watchers"
            value={report.basicStats.watchers}
            icon={<Eye className="size-4" />}
          />
          <StatCard
            label="Language"
            value={report.basicStats.language}
            icon={<Code className="size-4" />}
          />
          <StatCard
            label="License"
            value={report.basicStats.license}
            icon={<Scale className="size-4" />}
          />
          <StatCard
            label="Size"
            value={report.basicStats.size}
            icon={<HardDrive className="size-4" />}
          />
          <StatCard
            label="Created"
            value={report.basicStats.createdAt.split('T')[0]}
            icon={<Calendar className="size-4" />}
          />
          <StatCard
            label="Updated"
            value={report.basicStats.updatedAt.split('T')[0]}
            icon={<Calendar className="size-4" />}
          />
          <StatCard
            label="Pushed"
            value={report.basicStats.pushedAt.split('T')[0]}
            icon={<Calendar className="size-4" />}
          />
        </div>
      </section>

      {/* Tools */}
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 p-2">
          {report.tooling.tools.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </section>

      <div>
        <p>
          <strong>Name:</strong> {report.basicStats.fullName}
        </p>
        <p>
          <strong>Primary Language:</strong> {report.languages.primaryLanguage}
        </p>
        <p>
          <strong>Total Commits:</strong> {report.commits.totalCommits}
        </p>
        <p>
          <strong>Total Contributors:</strong> {report.contributors.totalContributors}
        </p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number | null;
  icon?: React.ReactNode;
}
export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card className="gap-0 p-2">
      <CardHeader className="p-0">
        <CardTitle className="text-muted-foreground text-xs font-normal">{label}</CardTitle>
        <CardAction className="text-muted-foreground">{icon}</CardAction>
      </CardHeader>
      <CardContent className="p-0 text-xl font-bold">{value}</CardContent>
    </Card>
  );
}
