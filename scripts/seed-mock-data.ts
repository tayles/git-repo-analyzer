/**
 * This script is used to seed mock data for testing and development purposes.
 * It uses the CLI interface to fetch data from the GitHub API for a specified
 * repository and saves it as a JSON file in the mocks package.
 */

import { writeFileSync } from 'node:fs';
import path from 'node:path';

import { analyzeGitRepository } from '../packages/core/src/analyze-repo';

const repo = `facebook/docusaurus`;

const outputPath = 'packages/mocks/data';

const baseFilename = repo.replace('/', '__');

const rawDataOutputPath = path.join(outputPath, `${baseFilename}.raw.json`);
const reportOutputPath = path.join(outputPath, `${baseFilename}.report.json`);

const report = await analyzeGitRepository(repo, {
  verbose: true,
  includeRawData: true,
});

const { raw, result } = report;

// Save raw data
writeFileSync(rawDataOutputPath, JSON.stringify(raw, null, 2), 'utf-8');
console.log(`Raw data saved to ${rawDataOutputPath}`);

// Save processed report
writeFileSync(reportOutputPath, JSON.stringify(result, null, 2), 'utf-8');
console.log(`Processed report saved to ${reportOutputPath}`);
