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
import { useCallback, useMemo, useState } from 'react';

import { ActivityHeatmapChart } from './ActivityHeatmapChart';
import { CommitChart } from './CommitChart';
import { CommitsByTypeChart } from './CommitsByTypeChart';
import { ContributorsSection } from './ContributorsSection';
import { HealthScoreCard } from './HealthScoreCard';
import { LanguageChart } from './LanguageChart';
import { LanguageLogo } from './LanguageLogo';
import { PullRequestChart } from './PullRequestChart';
import { RepoName } from './RepoName';
import { StatCard } from './StatCard';
import { TechStackSection } from './TechStackSection';
import { Button } from './ui/button';
import { WorkPatternsCard } from './WorkPatternsCard';

interface RepoDetailsLayoutProps {
  report: AnalysisResult;
  onBack: () => void;
  onRefresh: () => void;
}

export function RepoDetailsLayout({ report, onBack, onRefresh }: RepoDetailsLayoutProps) {
  const baseUrl = report.basicStats.htmlUrl;
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | null>(null);
  const [hoveredUserProfile, setHoveredUserProfile] = useState<UserProfile | null>(null);

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

      {/* <p className="text-muted-foreground text-sm">{report.basicStats.description}</p> */}

      {/* Tech Stack */}
      <TechStackSection repo={report.basicStats.fullName} tools={report.tooling.tools} />

      <section className="xs:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] grid grid-cols-1 gap-4 p-2 sm:grid-cols-[repeat(auto-fill,minmax(420px,1fr))]">
        <ActivityHeatmapChart
          data={heatmapData}
          contributors={report.contributors}
          userProfiles={report.userProfiles}
          selectedUserProfile={selectedUserProfile}
          onUserProfileChange={handleSelectUserProfile}
          primaryTimezone={report.contributors.primaryTimezone}
          contributorsMissingTimezone={dataWarnings.contributorsMissingTimezone}
        />

        <WorkPatternsCard
          data={workPatternsData}
          selectedUserProfile={selectedUserProfile}
          contributorsMissingTimezone={dataWarnings.contributorsMissingTimezone}
        />

        <ContributorsSection
          contributors={report.contributors}
          userProfiles={report.userProfiles}
          selectedUserProfile={selectedUserProfile}
          onSelectContributor={handleSelectUserProfile}
          onHoverContributor={handleHoverUserProfile}
        />

        <CommitChart data={commitsPerWeek} totalCommits={report.commits.commits.length} />

        <CommitsByTypeChart commits={report.commits} selectedUserProfile={selectedUserProfile} />

        <PullRequestChart pulls={report.pullRequests} data={pullsPerWeek} />

        <LanguageChart data={report.languages} />
      </section>

      <HealthScoreCard health={report.healthScore} />

      {/* Stats */}
      <section>
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
