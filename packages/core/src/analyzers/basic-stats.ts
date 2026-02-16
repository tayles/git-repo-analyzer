import type { GitHubRepoDetails } from '../client/github-types';
import type { BasicStats } from '../types';

export function processBasicStats(data: GitHubRepoDetails): BasicStats {
  return {
    name: data.name,
    fullName: data.full_name,
    htmlUrl: data.html_url,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    watchers: data.subscribers_count,
    language: data.language,
    license: data.license?.spdx_id ?? null,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    pushedAt: data.pushed_at,
    defaultBranch: data.default_branch,
    size: data.size,
    hasWiki: data.has_wiki,
    hasPages: data.has_pages,
    archived: data.archived,
    topics: data.topics ?? [],
    homepage: data.homepage,
    owner: {
      login: data.owner.login,
      id: data.owner.id,
      avatarUrl: data.owner.avatar_url,
    },
  };
}
