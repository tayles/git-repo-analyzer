import type { AnalysisResult, ToolMetaWithFileMatches } from '@git-repo-analyzer/core';
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
import { motion } from 'motion/react';

import { ActivityHeatmapChart } from './ActivityHeatmapChart';
import { CommitChart } from './CommitChart';
import { ContributorsSection } from './ContributorsSection';
import { HealthScoreCard } from './HealthScoreCard';
import { LanguageChart } from './LanguageChart';
import { LanguageLogo } from './LanguageLogo';
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
  const baseUrl = report.basicStats.htmlUrl;

  const toolsByCategory = Object.entries(
    report.tooling.tools.reduce(
      (acc, tool) => {
        if (!acc[tool.category]) {
          acc[tool.category] = [];
        }
        acc[tool.category].push(tool);
        return acc;
      },
      {} as Record<string, ToolMetaWithFileMatches[]>,
    ),
  );

  return (
    <div className="flex h-full flex-col justify-start gap-2">
      <div className="bg-background absolute sticky top-0 z-10 flex min-w-0 flex-wrap items-center gap-1 p-1 py-2 md:py-4">
        <Button variant="ghost" onClick={onBack} className="order-1" title="Go back">
          <ChevronLeft />
          <span className="inline sm:hidden sm:inline">Back</span>
        </Button>

        <h2 className="order-3 w-full truncate overflow-hidden text-lg font-semibold whitespace-nowrap sm:order-2 sm:w-auto sm:flex-1 sm:text-xl">
          <a
            href={report.basicStats.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:underline"
          >
            <RepoName fullName={report.basicStats.fullName} uid={report.basicStats.owner.id} />
          </a>
        </h2>

        <Button
          variant="ghost"
          onClick={onRefresh}
          className="order-2 ml-auto sm:order-3"
          title="Refresh data"
        >
          <RefreshCw />
          <span className="inline sm:hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Stats */}
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 p-2 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <StatCard
              label="Stars"
              value={report.basicStats.stars}
              icon={<Star className="size-4" />}
              href={`${baseUrl}/stargazers`}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 1 * 0.03 }}
          >
            <StatCard
              label="Forks"
              value={report.basicStats.forks}
              icon={<Split className="size-4" />}
              href={`${baseUrl}/forks`}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 2 * 0.03 }}
          >
            <StatCard
              label="Open Issues"
              value={report.basicStats.openIssues}
              icon={<CircleDot className="size-4" />}
              href={`${baseUrl}/issues`}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 3 * 0.03 }}
          >
            <StatCard
              label="Watchers"
              value={report.basicStats.watchers}
              icon={<Eye className="size-4" />}
              href={`${baseUrl}/watchers`}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 4 * 0.03 }}
          >
            <StatCard
              label="Language"
              value={report.basicStats.language}
              icon={<Code className="size-4" />}
            >
              <LanguageLogo language={report.basicStats.language} className="size-6" />
            </StatCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 5 * 0.03 }}
          >
            <StatCard
              label="License"
              value={report.basicStats.license}
              icon={<Scale className="size-4" />}
              href={`${baseUrl}/blob/${report.basicStats.defaultBranch}/LICENSE`}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 6 * 0.03 }}
          >
            <StatCard
              label="Size"
              value={report.basicStats.size}
              icon={<HardDrive className="size-4" />}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 7 * 0.03 }}
          >
            <StatCard
              label="Created"
              value={report.basicStats.createdAt.split('T')[0]}
              icon={<Calendar className="size-4" />}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 8 * 0.03 }}
          >
            <StatCard
              label="Updated"
              value={report.basicStats.updatedAt.split('T')[0]}
              icon={<Calendar className="size-4" />}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 9 * 0.03 }}
          >
            <StatCard
              label="Pushed"
              value={report.basicStats.pushedAt.split('T')[0]}
              icon={<Calendar className="size-4" />}
            />
          </motion.div>
        </div>
      </section>

      {/* Tools */}
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-end gap-4 p-2 lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {toolsByCategory.map(([category, tools], categoryIndex) =>
            tools.map((tool, toolIndex) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: (categoryIndex + toolIndex) * 0.03 }}
              >
                {toolIndex === 0 && (
                  <h3 className="text-muted-foreground mb-3 text-sm font-semibold">{category}</h3>
                )}
                <ToolCard repo={report.basicStats.fullName} tool={tool} />
              </motion.div>
            )),
          )}
        </div>
      </section>

      <section className="xs:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] grid grid-cols-1 gap-4 p-2 sm:grid-cols-[repeat(auto-fill,minmax(420px,1fr))]">
        <ActivityHeatmapChart data={report.commits.activityHeatmap} />

        <WorkPatternsCard data={report.commits.workPatterns} />

        <ContributorsSection data={report.contributors} />

        <LanguageChart data={report.languages} />

        <CommitChart data={report.commits.byWeek} />

        <PullRequestChart data={report.pullRequests} />
      </section>

      <HealthScoreCard health={report.healthScore} />
    </div>
  );
}
