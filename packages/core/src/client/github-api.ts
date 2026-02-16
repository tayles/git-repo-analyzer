export interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetAt: Date;
}

const BASE_URL = 'https://api.github.com';

export class GitHubAPIError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

export class GitHubAPI {
  private token: string | undefined;
  rateLimit: RateLimitInfo | null = null;

  constructor(token?: string) {
    this.token = token;
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (this.token) {
      h.Authorization = `Bearer ${this.token}`;
    }
    return h;
  }

  private updateRateLimit(response: Response) {
    const remaining = response.headers.get('x-ratelimit-remaining');
    const limit = response.headers.get('x-ratelimit-limit');
    const reset = response.headers.get('x-ratelimit-reset');
    if (remaining && limit && reset) {
      this.rateLimit = {
        remaining: Number(remaining),
        limit: Number(limit),
        resetAt: new Date(Number(reset) * 1000),
      };
    }
  }

  async fetch<T>(path: string): Promise<T> {
    const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
    console.log(`[GitHub API] GET ${url}`);
    const response = await fetch(url, { headers: this.headers() });
    this.updateRateLimit(response);

    if (!response.ok) {
      if (response.status === 404) {
        throw new GitHubAPIError(404, 'Repository not found');
      }
      if (response.status === 403 && this.rateLimit?.remaining === 0) {
        throw new GitHubAPIError(403, 'GitHub API rate limit exceeded');
      }
      throw new GitHubAPIError(response.status, `GitHub API error: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async fetchPaginated<T>(path: string, maxPages = 3): Promise<T[]> {
    const items: T[] = [];
    let url: string | null = `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}per_page=100`;
    console.log(`[GitHub API] GET ${url} (paginated, max ${maxPages} pages)`);

    for (let page = 0; page < maxPages && url; page++) {
      if (page > 0) console.log(`[GitHub API] Fetching page ${page + 1}/${maxPages}: ${url}`);
      const response = await fetch(url, { headers: this.headers() });
      this.updateRateLimit(response);

      if (!response.ok) {
        if (response.status === 409) return items; // empty repo
        throw new GitHubAPIError(response.status, `GitHub API error: ${response.statusText}`);
      }

      const data = (await response.json()) as T[];
      items.push(...data);

      const link = response.headers.get('link');
      url = this.parseNextLink(link);
    }

    return items;
  }

  private parseNextLink(link: string | null): string | null {
    if (!link) return null;
    const match = link.match(/<([^>]+)>;\s*rel="next"/);
    return match?.[1] ?? null;
  }
}
