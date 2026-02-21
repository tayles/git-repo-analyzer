import type {
  AnalysisResult,
  HealthCategory,
  HealthScore,
  HealthScoreAnalysis,
  HealthScoreDetail,
} from '../types';

type PartialAnalysisResult = Omit<AnalysisResult, 'healthScore' | 'generator'>;

function scoreMaintenance(data: PartialAnalysisResult): HealthScore {
  const details: HealthScoreDetail[] = [];
  let score = 0;
  const maxScore = 25;

  // Recent activity (pushed within last 6 months)
  const daysSincePush = Math.floor(
    (Date.now() - new Date(data.basicStats.pushedAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysSincePush < 30) {
    score += 10;
    details.push({ message: 'Active in last 30 days', delta: 10 });
  } else if (daysSincePush < 180) {
    score += 5;
    details.push({ message: 'Active in last 6 months', delta: 5 });
  } else {
    details.push({ message: `Inactive for ${daysSincePush} days`, delta: 0 });
  }

  // Commit frequency
  if (data.commits.totalCommits > 100) {
    score += 8;
    details.push({ message: 'High commit frequency', delta: 8 });
  } else if (data.commits.totalCommits > 20) {
    score += 4;
    details.push({ message: 'Moderate commit frequency', delta: 4 });
  } else {
    details.push({ message: 'Low commit frequency', delta: 0 });
  }

  // Not archived
  if (!data.basicStats.archived) {
    score += 4;
  } else {
    details.push({ message: 'Repository is archived', delta: 0 });
  }

  // Has CI/CD
  if (data.tooling.categories.includes('CI/CD & Deployment')) {
    score += 3;
    details.push({ message: 'CI/CD configured', delta: 3 });
  }

  return { score: Math.min(score, maxScore), maxScore, details };
}

function scoreDocumentation(data: PartialAnalysisResult): HealthScore {
  const details: HealthScoreDetail[] = [];
  let score = 0;
  const maxScore = 20;

  if (data.basicStats.description) {
    score += 5;
    details.push({ message: 'Has description', delta: 5 });
  } else {
    details.push({ message: 'Missing description', delta: 0 });
  }

  if (data.basicStats.license) {
    score += 5;
    details.push({ message: `License: ${data.basicStats.license}`, delta: 5 });
  } else {
    details.push({ message: 'No license', delta: 0 });
  }

  if (data.basicStats.homepage) {
    score += 3;
    details.push({ message: 'Has homepage', delta: 3 });
  }

  if (data.basicStats.hasWiki) {
    score += 3;
    details.push({ message: 'Wiki enabled', delta: 3 });
  }

  if (data.basicStats.topics.length > 0) {
    score += 4;
    details.push({ message: `${data.basicStats.topics.length} topics`, delta: 4 });
  } else {
    details.push({ message: 'No topics', delta: 0 });
  }

  return { score: Math.min(score, maxScore), maxScore, details };
}

function scoreCommunity(data: PartialAnalysisResult): HealthScore {
  const details: HealthScoreDetail[] = [];
  let score = 0;
  const maxScore = 25;

  // Stars
  if (data.basicStats.stars >= 1000) {
    score += 8;
    details.push({ message: `${data.basicStats.stars.toLocaleString()} stars`, delta: 8 });
  } else if (data.basicStats.stars >= 100) {
    score += 5;
    details.push({ message: `${data.basicStats.stars} stars`, delta: 5 });
  } else if (data.basicStats.stars >= 10) {
    score += 2;
    details.push({ message: `${data.basicStats.stars} stars`, delta: 2 });
  }

  // Contributors
  if (data.contributors.totalContributors >= 10) {
    score += 7;
    details.push({ message: 'Strong contributor base', delta: 7 });
  } else if (data.contributors.totalContributors >= 3) {
    score += 4;
    details.push({ message: 'Small contributor team', delta: 4 });
  } else {
    score += 1;
    details.push({ message: 'Few contributors', delta: 1 });
  }

  // Bus factor
  if (data.contributors.busFactor >= 3) {
    score += 5;
    details.push({ message: `Bus factor: ${data.contributors.busFactor}`, delta: 5 });
  } else if (data.contributors.busFactor >= 2) {
    score += 3;
    details.push({ message: `Bus factor: ${data.contributors.busFactor}`, delta: 3 });
  } else {
    details.push({ message: 'Bus factor: 1 (high risk)', delta: 0 });
  }

  // Forks
  if (data.basicStats.forks >= 100) {
    score += 5;
    details.push({ message: `${data.basicStats.forks} forks`, delta: 5 });
  } else if (data.basicStats.forks >= 10) {
    score += 3;
    details.push({ message: `${data.basicStats.forks} forks`, delta: 3 });
  }

  return { score: Math.min(score, maxScore), maxScore, details };
}

function scoreCodeQuality(data: PartialAnalysisResult): HealthScore {
  const details: HealthScoreDetail[] = [];
  let score = 0;
  const maxScore = 15;

  if (data.tooling.categories.includes('Testing')) {
    score += 5;
    const testingTools = data.tooling.tools
      .filter(t => t.category === 'Testing')
      .map(t => t.name)
      .join(', ');
    details.push({ message: `Testing: ${testingTools}`, delta: 5 });
  } else {
    details.push({ message: 'No testing framework detected', delta: 0 });
  }

  if (data.tooling.categories.includes('Linting & Formatting')) {
    score += 5;
    const lintingTools = data.tooling.tools
      .filter(t => t.category === 'Linting & Formatting')
      .map(t => t.name)
      .join(', ');
    details.push({ message: `Linting & Formatting: ${lintingTools}`, delta: 5 });
  } else {
    details.push({ message: 'No linter detected', delta: 0 });
  }

  // PR workflow
  if (data.pullRequests.counts.merged > 10) {
    score += 5;
    details.push({ message: 'Active PR workflow', delta: 5 });
  } else if (data.pullRequests.counts.merged > 0) {
    score += 2;
    details.push({ message: 'Some PR activity', delta: 2 });
  } else {
    details.push({ message: 'No PR activity', delta: 0 });
  }

  return { score: Math.min(score, maxScore), maxScore, details };
}

function scoreSecurity(data: PartialAnalysisResult): HealthScore {
  const details: HealthScoreDetail[] = [];
  let score = 0;
  const maxScore = 15;

  if (data.basicStats.license) {
    score += 5;
    details.push({ message: 'Has license', delta: 5 });
  }

  if (data.tooling.categories.includes('CI/CD & Deployment')) {
    score += 5;
    details.push({ message: 'Automated CI pipeline', delta: 5 });
  }

  if (data.tooling.categories.includes('Linting & Formatting')) {
    score += 3;
    details.push({ message: 'Code quality checks', delta: 3 });
  }

  if (data.tooling.tools.some(t => t.name === 'Docker' || t.name === 'Docker Compose')) {
    score += 2;
    details.push({ message: 'Containerized', delta: 2 });
  }

  return { score: Math.min(score, maxScore), maxScore, details };
}

export function processHealthScore(result: PartialAnalysisResult): HealthScoreAnalysis {
  const categories: Record<HealthCategory, HealthScore> = {
    Maintenance: scoreMaintenance(result),
    Documentation: scoreDocumentation(result),
    Community: scoreCommunity(result),
    'Code Quality': scoreCodeQuality(result),
    Security: scoreSecurity(result),
  };

  const overall = Object.values(categories).reduce((sum, c) => sum + c.score, 0);

  return { overall, categories };
}
