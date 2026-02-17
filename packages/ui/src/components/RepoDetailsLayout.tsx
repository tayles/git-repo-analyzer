import type { AnalysisResult } from '@git-repo-analyzer/core';

import {
  Calendar,
  ChevronLeft,
  CircleDot,
  Code,
  Eye,
  HardDrive,
  RefreshCw,
  Scale,
  Split,
  Star,
} from 'lucide-react';

import { ActivityHeatmapChart } from './ActivityHeatmapChart';
import { CommitChart } from './CommitChart';
import { ContributorsSection } from './ContributorsSection';
import { LanguageChart } from './LanguageChart';
import { PullRequestChart } from './PullRequestChart';
import { RepoName } from './RepoName';
import { StatCard } from './StatCard';
import { ToolCard } from './ToolCard';
import { Button } from './ui/button';
import { WorkPatternsCard } from './WorkPatternsCard';

interface RepoDetailsLayoutProps {
  report: AnalysisResult;
  onBack: () => void;
  onRefresh: () => void;
}

export function RepoDetailsLayout({ report, onBack, onRefresh }: RepoDetailsLayoutProps) {
  return (
    <div className="flex h-full flex-col justify-start gap-2">
      <div className="bg-background absolute sticky top-0 z-10 flex min-w-0 flex-wrap items-center gap-1 p-1 py-4">
        <Button variant="ghost" onClick={onBack} className="order-1" title="Go back">
          <ChevronLeft />
          <span className="hidden xl:inline">Back</span>
        </Button>

        <h2 className="text-md order-2 min-w-80 flex-1 truncate overflow-hidden font-semibold whitespace-nowrap sm:order-3 sm:text-xl">
          <RepoName fullName={report.basicStats.fullName} uid={report.basicStats.owner.id} />
        </h2>

        <Button
          variant="ghost"
          onClick={onRefresh}
          className="order-3 sm:order-2"
          title="Refresh data"
        >
          <RefreshCw />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Stats */}
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 p-2 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          <StatCard
            label="Stars"
            value={report.basicStats.stars}
            icon={<Star className="size-4" />}
          />
          <StatCard
            label="Forks"
            value={report.basicStats.forks}
            icon={<Split className="size-4" />}
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 p-2 lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {report.tooling.tools.map(tool => (
            <ToolCard key={tool.name} repo={report.basicStats.fullName} tool={tool} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 p-2">
        <ActivityHeatmapChart data={report.commits.activityHeatmap} />

        <WorkPatternsCard data={report.commits.workPatterns} />

        <ContributorsSection data={report.contributors} />

        <LanguageChart data={report.languages} />

        <CommitChart data={report.commits.byWeek} />

        <PullRequestChart data={report.pullRequests} />
      </section>
    </div>
  );
}
