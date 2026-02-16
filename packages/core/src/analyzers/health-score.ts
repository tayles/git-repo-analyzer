import type { AnalysisResult, HealthCategory, HealthScore, HealthScoreAnalysis } from '../types';

type PartialAnalysisResult = Omit<AnalysisResult, 'healthScore' | 'generator'>;

function scoreMaintenance(data: PartialAnalysisResult): HealthScore {
  const details: string[] = [];
  let score = 0;
  const maxScore = 25;

  // Recent activity (pushed within last 6 months)
  const daysSincePush = Math.floor(
    (Date.now() - new Date(data.basicStats.pushedAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysSincePush < 30) {
    score += 10;
    details.push('Active in last 30 days');
  } else if (daysSincePush < 180) {
    score += 5;
    details.push('Active in last 6 months');
  } else {
    details.push(`Inactive for ${daysSincePush} days`);
  }

  // Commit frequency
  if (data.commits.totalCommits > 100) {
    score += 8;
    details.push('High commit frequency');
  } else if (data.commits.totalCommits > 20) {
    score += 4;
    details.push('Moderate commit frequency');
  } else {
    details.push('Low commit frequency');
  }

  // Not archived
  if (!data.basicStats.archived) {
    score += 4;
  } else {
    details.push('Repository is archived');
  }

  // Has CI/CD
  if (data.tooling.categories.includes('CI/CD & Deployment')) {
    score += 3;
    details.push('CI/CD configured');
  }

  return { score: Math.min(score, maxScore), maxScore, details };
}

function scoreDocumentation(data: PartialAnalysisResult): HealthScore {
  const details: string[] = [];
  let score = 0;
  const maxScore = 20;

  if (data.basicStats.description) {
    score += 5;
    details.push('Has description');
  } else {
    details.push('Missing description');
  }

  if (data.basicStats.license) {
    score += 5;
    details.push(`License: ${data.basicStats.license}`);
  } else {
    details.push('No license');
  }

  if (data.basicStats.homepage) {
    score += 3;
    details.push('Has homepage');
  }

  if (data.basicStats.hasWiki) {
    score += 3;
    details.push('Wiki enabled');
  }

  if (data.basicStats.topics.length > 0) {
    score += 4;
    details.push(`${data.basicStats.topics.length} topics`);
  } else {
    details.push('No topics');
  }

  return { score: Math.min(score, maxScore), maxScore, details };
}

function scoreCommunity(data: PartialAnalysisResult): HealthScore {
  const details: string[] = [];
  let score = 0;
  const maxScore = 25;

  // Stars
  if (data.basicStats.stars >= 1000) {
    score += 8;
    details.push(`${data.basicStats.stars.toLocaleString()} stars`);
  } else if (data.basicStats.stars >= 100) {
    score += 5;
    details.push(`${data.basicStats.stars} stars`);
  } else if (data.basicStats.stars >= 10) {
    score += 2;
    details.push(`${data.basicStats.stars} stars`);
  }

  // Contributors
  if (data.contributors.totalContributors >= 10) {
    score += 7;
    details.push('Strong contributor base');
  } else if (data.contributors.totalContributors >= 3) {
    score += 4;
    details.push('Small contributor team');
  } else {
    score += 1;
    details.push('Few contributors');
  }

  // Bus factor
  if (data.contributors.busFactor >= 3) {
    score += 5;
    details.push(`Bus factor: ${data.contributors.busFactor}`);
  } else if (data.contributors.busFactor >= 2) {
    score += 3;
    details.push(`Bus factor: ${data.contributors.busFactor}`);
  } else {
    details.push('Bus factor: 1 (high risk)');
  }

  // Forks
  if (data.basicStats.forks >= 100) {
    score += 5;
    details.push(`${data.basicStats.forks} forks`);
  } else if (data.basicStats.forks >= 10) {
    score += 3;
  }

  return { score: Math.min(score, maxScore), maxScore, details };
}

function scoreCodeQuality(data: PartialAnalysisResult): HealthScore {
  const details: string[] = [];
  let score = 0;
  const maxScore = 15;

  if (data.tooling.categories.includes('Testing')) {
    score += 5;
    const testingTools = data.tooling.tools
      .filter(t => t.category === 'Testing')
      .map(t => t.name)
      .join(', ');
    details.push(`Testing: ${testingTools}`);
  } else {
    details.push('No testing framework detected');
  }

  if (data.tooling.categories.includes('Linting & Formatting')) {
    score += 5;
    const lintingTools = data.tooling.tools
      .filter(t => t.category === 'Linting & Formatting')
      .map(t => t.name)
      .join(', ');
    details.push(`Linting & Formatting: ${lintingTools}`);
  } else {
    details.push('No linter detected');
  }

  // PR workflow
  if (data.pullRequests.totalMerged > 10) {
    score += 5;
    details.push('Active PR workflow');
  } else if (data.pullRequests.totalMerged > 0) {
    score += 2;
    details.push('Some PR activity');
  } else {
    details.push('No PR activity');
  }

  return { score: Math.min(score, maxScore), maxScore, details };
}

function scoreSecurity(data: PartialAnalysisResult): HealthScore {
  const details: string[] = [];
  let score = 0;
  const maxScore = 15;

  if (data.basicStats.license) {
    score += 5;
    details.push('Has license');
  }

  if (data.tooling.categories.includes('CI/CD & Deployment')) {
    score += 5;
    details.push('Automated CI pipeline');
  }

  if (data.tooling.categories.includes('Linting & Formatting')) {
    score += 3;
    details.push('Code quality checks');
  }

  if (data.tooling.tools.some(t => t.name === 'Docker' || t.name === 'Docker Compose')) {
    score += 2;
    details.push('Containerized');
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
