import { afterEach, describe, expect, it } from 'bun:test';

import { GitHubAPI, GitHubAPIError } from './github-api';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('GitHubAPI', () => {
  it('fetches JSON and updates rate limit data', async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          'x-ratelimit-remaining': '4999',
          'x-ratelimit-limit': '5000',
          'x-ratelimit-reset': '1730000000',
        },
      })) as unknown as typeof fetch;

    const api = new GitHubAPI();
    const result = await api.fetch<{ ok: boolean }>('/repos/owner/repo');

    expect(result.ok).toBe(true);
    expect(api.rateLimit?.remaining).toBe(4999);
  });

  it('follows pagination next links up to max pages', async () => {
    const calls: string[] = [];

    globalThis.fetch = (async (url: string | URL | Request) => {
      const href = typeof url === 'string' ? url : url instanceof URL ? url.toString() : url.url;
      calls.push(href);

      if (calls.length === 1) {
        return new Response(JSON.stringify([{ id: 1 }]), {
          status: 200,
          headers: {
            link: '<https://api.github.com/page-2>; rel="next"',
          },
        });
      }

      return new Response(JSON.stringify([{ id: 2 }]), { status: 200 });
    }) as typeof fetch;

    const api = new GitHubAPI();
    const items = await api.fetchPaginated<{ id: number }>('/repos/owner/repo/commits', 3);

    expect(items).toEqual([{ id: 1 }, { id: 2 }]);
    expect(calls.length).toBe(2);
  });

  it('throws rich 404 message for missing repository', async () => {
    globalThis.fetch = (async () =>
      new Response('not found', { status: 404 })) as unknown as typeof fetch;

    const api = new GitHubAPI();
    expect(api.fetch('/repos/owner/repo')).rejects.toBeInstanceOf(GitHubAPIError);
    expect(api.fetch('/repos/owner/repo')).rejects.toThrow('Repository not found');
  });

  it('throws rate limit error when 403 and no remaining requests', async () => {
    globalThis.fetch = (async () =>
      new Response('forbidden', {
        status: 403,
        headers: {
          'x-ratelimit-remaining': '0',
          'x-ratelimit-limit': '60',
          'x-ratelimit-reset': '1730000000',
        },
      })) as unknown as typeof fetch;

    const api = new GitHubAPI();
    expect(api.fetch('/repos/owner/repo')).rejects.toThrow('rate limit exceeded');
  });

  it('returns partial items for 409 empty repository in paginated fetch', async () => {
    let callCount = 0;

    globalThis.fetch = (async () => {
      callCount += 1;
      if (callCount === 1) {
        return new Response(JSON.stringify([{ id: 1 }]), {
          status: 200,
          headers: { link: '<https://api.github.com/page-2>; rel="next"' },
        });
      }

      return new Response('conflict', { status: 409 });
    }) as unknown as typeof fetch;

    const api = new GitHubAPI();
    const items = await api.fetchPaginated<{ id: number }>('/repos/owner/repo/commits', 3);

    expect(items).toEqual([{ id: 1 }]);
  });
});
