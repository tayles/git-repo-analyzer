import type { AnalysisResult, UserProfile } from '@git-repo-analyzer/core';
import {
  analyzeWorkPatterns,
  computeActivityHeatmap,
  computeCommitsPerWeek,
  computeDataWarnings,
  computePullsPerWeek,
  formatDate,
  relativeDateLabel,
} from '@git-repo-analyzer/core';
import {
  Calendar,
  Check,
  ChevronLeft,
  CircleDot,
  Code,
  Copy,
  ExternalLink,
  Eye,
  HardDrive,
  RefreshCw,
  Scale,
  Split,
  Star,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useMemo, useState } from 'react';

import { useCopyToClipboard } from '../hooks/use-copy-to-clipboard';
import { ActivityHeatmapChart } from './ActivityHeatmapChart';
import { CommitChart } from './CommitChart';
import { CommitsByTypeChart } from './CommitsByTypeChart';
import { ContributorsSection } from './ContributorsSection';
import { FilesTreemapCard } from './FilesTreemapCard';
import { HealthScoreCard } from './HealthScoreCard';
import { LanguageChart } from './LanguageChart';
import { LanguageLogo } from './LanguageLogo';
import { PullRequestChart } from './PullRequestChart';
import { RepoName } from './RepoName';
import { StatCard } from './StatCard';
import { TableOfContents, type TocItem } from './TableOfContents';
import { TechStackSection } from './TechStackSection';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { WorkPatternsCard } from './WorkPatternsCard';

interface RepoDetailsLayoutProps {
  report: AnalysisResult;
  onBack: () => void;
  onRefresh: () => void;
  showReportLink: boolean;
}

export function RepoDetailsLayout({
  report,
  onBack,
  onRefresh,
  showReportLink = true,
}: RepoDetailsLayoutProps) {
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | null>(null);
  const [hoveredUserProfile, setHoveredUserProfile] = useState<UserProfile | null>(null);

  const [copy, isCopied] = useCopyToClipboard();

  const handleSelectUserProfile = useCallback((userProfile: UserProfile | null) => {
    setSelectedUserProfile(userProfile);
  }, []);

  const handleHoverUserProfile = useCallback((userProfile: UserProfile | null) => {
    setHoveredUserProfile(userProfile);
  }, []);

  const userProfile = hoveredUserProfile || selectedUserProfile;

  const heatmapData = useMemo(() => {
    return computeActivityHeatmap(report.commits.commits, userProfile?.login);
  }, [userProfile, report.commits.commits]);

  const workPatternsData = useMemo(() => {
    if (!userProfile) {
      return report.commits.workPatterns;
    }
    return analyzeWorkPatterns(report.commits.commits, userProfile?.login);
  }, [userProfile, report.commits]);

  const commitsPerWeek = useMemo(() => {
    return computeCommitsPerWeek(report.commits.commits, userProfile?.login);
  }, [userProfile, report.commits.commits]);

  const pullsPerWeek = useMemo(() => {
    return computePullsPerWeek(report.pullRequests.pulls, userProfile?.login);
  }, [userProfile, report.pullRequests.pulls]);

  const dataWarnings = useMemo(() => computeDataWarnings(report), [report]);

  const tocItems = useMemo<TocItem[]>(
    () => [
      { id: 'toc-tech-stack', label: 'Tech Stack' },
      { id: 'toc-activity', label: 'Activity' },
      { id: 'toc-files', label: 'Files' },
      { id: 'toc-health', label: 'Health' },
      { id: 'toc-stats', label: 'Stats' },
    ],
    [],
  );

  const baseUrl = report.basicStats.htmlUrl;
  const reportUrl = `https://tayles.github.io/git-repo-analyzer/?repo=${encodeURIComponent(report.basicStats.fullName)}`;

  return (
    <div className="flex h-full flex-col justify-start gap-2">
      <div className="bg-background absolute sticky top-0 z-10 flex flex-col gap-1 p-1 py-2 md:py-4">
        <div className="flex min-w-0 flex-wrap items-center gap-1">
          <Button variant="ghost" onClick={onBack} className="order-1">
            <ChevronLeft />
            <span className="inline sm:hidden sm:inline">Back</span>
          </Button>

          <h2 className="order-5 w-full truncate overflow-hidden text-lg font-semibold whitespace-nowrap sm:order-2 sm:w-auto sm:flex-1 sm:text-xl">
            <a
              href={report.basicStats.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors hover:underline"
            >
              <RepoName fullName={report.basicStats.fullName} uid={report.basicStats.owner.id} />
            </a>
          </h2>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => copy(reportUrl)}
                className="order-2 ml-auto sm:order-3"
              >
                {isCopied ? <Check /> : <Copy />}
                <span className="hidden md:inline">Copy</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isCopied ? 'Copied!' : 'Copy link to this report'}
            </TooltipContent>
          </Tooltip>

          {showReportLink && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="order-3 sm:order-4" asChild>
                  <a href={reportUrl} target="_blank">
                    <ExternalLink />
                    <span className="hidden md:inline">New Tab</span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Open report in a new tab</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={onRefresh} className="order-4 sm:order-5">
                <RefreshCw />
                <span className="inline sm:hidden sm:inline">Refresh</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Refresh report</TooltipContent>
          </Tooltip>
        </div>

        <TableOfContents items={tocItems} />
      </div>

      {/* <p className="text-muted-foreground text-sm">{report.basicStats.description}</p> */}

      {/* Tech Stack */}
      <section id="toc-tech-stack" className="mb-2 scroll-mt-34 md:scroll-mt-28">
        <TechStackSection repo={report.basicStats.fullName} tools={report.techStack.tools} />
      </section>

      <section
        id="toc-activity"
        className="xs:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] grid scroll-mt-34 grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(420px,1fr))] md:scroll-mt-28"
      >
        <ActivityHeatmapChart
          data={heatmapData}
          contributors={report.contributors}
          userProfiles={report.userProfiles}
          selectedUserProfile={userProfile}
          onSelectUserProfile={handleSelectUserProfile}
          onHoverUserProfile={handleHoverUserProfile}
          primaryTimezone={report.contributors.primaryTimezone}
          contributorsMissingTimezone={dataWarnings.contributorsMissingTimezone}
        />

        <WorkPatternsCard
          data={workPatternsData}
          selectedUserProfile={userProfile}
          contributorsMissingTimezone={dataWarnings.contributorsMissingTimezone}
        />

        <section className="md:col-span-2">
          <ContributorsSection
            contributors={report.contributors}
            userProfiles={report.userProfiles}
            selectedUserProfile={selectedUserProfile}
            hoveredUserProfile={hoveredUserProfile}
            onSelectUserProfile={handleSelectUserProfile}
            onHoverUserProfile={handleHoverUserProfile}
          />
        </section>

        <CommitChart data={commitsPerWeek} totalCommits={report.commits.commits.length} />

        <CommitsByTypeChart commits={report.commits} selectedUserProfile={userProfile} />

        <PullRequestChart pulls={report.pullRequests} data={pullsPerWeek} />

        <LanguageChart data={report.languages} />

        <section id="toc-files" className="scroll-mt-34 md:col-span-2 md:scroll-mt-28">
          <FilesTreemapCard
            data={report.fileTree}
            repoUrl={report.basicStats.htmlUrl}
            defaultBranch={report.basicStats.defaultBranch}
          />
        </section>
      </section>

      <section id="toc-health" className="scroll-mt-34 md:scroll-mt-28">
        <HealthScoreCard health={report.healthScore} />
      </section>

      {/* Stats */}
      <section id="toc-stats" className="scroll-mt-34 md:scroll-mt-28">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 p-2 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
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
              value={formatDate(report.basicStats.createdAt)}
              icon={<Calendar className="size-4" />}
            >
              <span className="text-muted-foreground text-xs font-normal">
                {relativeDateLabel(report.basicStats.createdAt)}
              </span>
            </StatCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 8 * 0.03 }}
          >
            <StatCard
              label="Updated"
              value={formatDate(report.basicStats.updatedAt)}
              icon={<Calendar className="size-4" />}
            >
              <span className="text-muted-foreground text-xs font-normal">
                {relativeDateLabel(report.basicStats.updatedAt)}
              </span>
            </StatCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 9 * 0.03 }}
          >
            <StatCard
              label="Last Push"
              value={formatDate(report.basicStats.pushedAt)}
              icon={<Calendar className="size-4" />}
            >
              <span className="text-muted-foreground text-xs font-normal">
                {relativeDateLabel(report.basicStats.pushedAt)}
              </span>
            </StatCard>
          </motion.div>

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
          {report.basicStats.license && (
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
          )}
        </div>
      </section>
    </div>
  );
}
