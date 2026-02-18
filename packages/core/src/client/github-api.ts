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
    public mayRequireToken: boolean = false,
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

export class GitHubAPI {
  private token: string | undefined;
  private signal: AbortSignal | undefined;
  private verbose: boolean;
  rateLimit: RateLimitInfo | null = null;

  constructor(options?: { token?: string; signal?: AbortSignal; verbose?: boolean }) {
    this.token = options?.token;
    this.signal = options?.signal;
    this.verbose = options?.verbose ?? false;
  }

  private log(...args: unknown[]) {
    if (this.verbose) console.log(...args);
  }

  private logRateLimit() {
    if (this.verbose && this.rateLimit) {
      const { remaining, limit, resetAt } = this.rateLimit;
      this.log(`[Rate Limit] ${remaining}/${limit}, resets at ${resetAt.toLocaleTimeString()}`);
    }
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
    this.log(`[GitHub API] GET ${url}`);
    const response = await fetch(url, { headers: this.headers(), signal: this.signal });
    this.updateRateLimit(response);
    this.logRateLimit();

    if (!response.ok) {
      this.handleErrorResponse(response);
    }

    return response.json() as Promise<T>;
  }

  async fetchPaginated<T>(path: string, maxPages = 3): Promise<T[]> {
    const items: T[] = [];
    let url: string | null = `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}per_page=100`;
    this.log(`[GitHub API] GET ${url} (paginated, max ${maxPages} pages)`);

    for (let page = 0; page < maxPages && url; page++) {
      if (page > 0) this.log(`[GitHub API] Fetching page ${page + 1}/${maxPages}: ${url}`);
      const response = await fetch(url, { headers: this.headers(), signal: this.signal });
      this.updateRateLimit(response);
      this.logRateLimit();

      if (!response.ok) {
        this.handleErrorResponse(response);
      }

      if (!response.ok) {
        if (response.status === 409) return items; // empty repo

        this.handleErrorResponse(response);
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

  private handleErrorResponse(response: Response): never {
    if (response.status === 404) {
      throw new GitHubAPIError(
        404,
        'Repository not found. If this is a private repository, enter a GitHub Personal Access Token to be able to view it',
        true,
      );
    }
    if (response.status === 403 && this.rateLimit?.remaining === 0) {
      throw new GitHubAPIError(
        403,
        'GitHub API rate limit exceeded. Add a GitHub Personal Access Token to increase your rate limit',
        true,
      );
    }

    const message = response.statusText || 'An unknown error occurred';
    throw new GitHubAPIError(response.status, `GitHub API error: ${response.status} ${message}`);
  }
}
