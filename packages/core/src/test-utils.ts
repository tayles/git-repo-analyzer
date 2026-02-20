import { mock } from 'bun:test';

import MockResultFacebookDocusaurusJson from '../../mocks/data/facebook__docusaurus.json';
import type { GitHubRawData } from './client/github-types';
import type { AnalysisResultWithRaw } from './types';

const mockRawData: GitHubRawData = (
  MockResultFacebookDocusaurusJson as unknown as AnalysisResultWithRaw
).raw;

const RATE_LIMIT_HEADERS: Record<string, string> = {
  'x-ratelimit-remaining': '4999',
  'x-ratelimit-limit': '5000',
  'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 3600),
  'content-type': 'application/json',
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: RATE_LIMIT_HEADERS,
  });
}

/**
 * Matches a URL path against GitHub API patterns and returns mock data.
 * Handles both direct fetch (full URL) and paginated fetch (with query params).
 */
function matchUrl(url: string): Response | null {
  const parsed = new URL(url);
  const path = parsed.pathname; // e.g. /repos/facebook/react

  // /repos/{owner}/{repo} — exact match (not /repos/owner/repo/something)
  const repoMatch = path.match(/^\/repos\/([^/]+)\/([^/]+)$/);
  if (repoMatch) {
    const owner = repoMatch[1]!;
    const repo = repoMatch[2]!;
    return jsonResponse({
      ...mockRawData.repoDetails,
      name: repo,
      full_name: `${owner}/${repo}`,
      owner: { ...mockRawData.repoDetails.owner, login: owner },
    });
  }

  // /repos/{owner}/{repo}/contributors
  if (/^\/repos\/[^/]+\/[^/]+\/contributors$/.test(path)) {
    return jsonResponse(mockRawData.contributors);
  }

  // /repos/{owner}/{repo}/commits
  if (/^\/repos\/[^/]+\/[^/]+\/commits$/.test(path)) {
    return jsonResponse(mockRawData.commits);
  }

  // /repos/{owner}/{repo}/pulls
  if (/^\/repos\/[^/]+\/[^/]+\/pulls$/.test(path)) {
    return jsonResponse(mockRawData.pullRequests);
  }

  // /repos/{owner}/{repo}/languages
  if (/^\/repos\/[^/]+\/[^/]+\/languages$/.test(path)) {
    return jsonResponse(mockRawData.languages);
  }

  // /repos/{owner}/{repo}/git/trees/{ref}
  if (/^\/repos\/[^/]+\/[^/]+\/git\/trees\//.test(path)) {
    return jsonResponse(mockRawData.files);
  }

  // /users/{login}
  const userMatch = path.match(/^\/users\/([^/]+)$/);
  if (userMatch) {
    const login = userMatch[1];
    const profile = mockRawData.userProfiles.find(p => p.login === login);
    if (profile) {
      return jsonResponse(profile);
    }
    // Return a minimal profile for unknown users
    return jsonResponse({ login, location: null, email: null }, 200);
  }

  return null;
}

const originalFetch = globalThis.fetch;

/**
 * Install a mock global fetch that intercepts GitHub API calls and returns mock data.
 * Call `restoreFetch()` to restore the original fetch.
 */
export function installMockFetch(): void {
  const mockFetch = mock(
    (input: string | URL | Request, _init?: RequestInit): Promise<Response> => {
      const url =
        typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      const response = matchUrl(url);
      if (response) {
        return Promise.resolve(response);
      }
      // Fail loudly for unmatched URLs so tests don't silently hit the network
      return Promise.resolve(
        new Response(JSON.stringify({ message: `Mock: unmatched URL ${url}` }), {
          status: 404,
          headers: RATE_LIMIT_HEADERS,
        }),
      );
    },
  );
  globalThis.fetch = mockFetch as unknown as typeof fetch;
}

/**
 * Restore the original global fetch.
 */
export function restoreFetch(): void {
  globalThis.fetch = originalFetch;
}
