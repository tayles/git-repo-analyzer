/**
 * Parse a repository string into owner/repo format
 */
export function parseRepository(repoNameOrUrl: string): string {
  // Handle full GitHub URLs
  const urlMatch = repoNameOrUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (urlMatch) {
    return `${urlMatch[1]}/${urlMatch[2].replace(/\.git$/, '')}`;
  }

  // Handle owner/repo format
  const parts = repoNameOrUrl.split('/');
  if (parts.length === 2) {
    return `${parts[0]}/${parts[1]}`;
  }

  throw new Error(
    `Invalid repository format: ${repoNameOrUrl}. Expected "owner/repo" or full GitHub URL`,
  );
}
