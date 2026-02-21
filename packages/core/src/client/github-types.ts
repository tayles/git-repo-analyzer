export interface GitHubRepoDetails {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
  };
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count: number;
  language: string | null;
  license: { spdx_id: string; name: string } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  size: number;
  has_wiki: boolean;
  has_pages: boolean;
  archived: boolean;
  topics: string[];
  homepage: string | null;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author?: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    type: 'User' | 'Bot';
    site_admin: boolean;
  };
  committer?: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    type: 'User' | 'Bot';
    site_admin: boolean;
  };
  parents: { sha: string }[];
}

export interface GitHubPullRequest {
  number: number;
  state: string;
  merged_at: string | null;
  created_at: string;
  closed_at: string | null;
  user: {
    login: string;
    type: string;
  };
  title: string;
  html_url: string;
}

export interface GitHubContributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export interface GitHubUserProfile {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: 'User' | 'Bot';
  user_view_type: 'public';
  site_admin: boolean;
  name: string;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubFileTree {
  tree: GitHubFile[];
}

export interface GitHubFile {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size: number;
  url: string;
}

export interface GitHubLanguage {
  [language: string]: number;
}

export interface GitHubRawData {
  repoDetails: GitHubRepoDetails;
  commits: GitHubCommit[];
  pullRequests: GitHubPullRequest[];
  contributors: GitHubContributor[];
  languages: GitHubLanguage;
  files: GitHubFileTree;
  userProfiles: GitHubUserProfile[];
}
