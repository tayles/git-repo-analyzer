import { describe, expect, it } from 'bun:test';

import type { GitHubUserProfile } from '../client/github-types';
import { processUserProfiles } from './user-profiles';

const profile: GitHubUserProfile = {
  login: 'alice',
  id: 1,
  node_id: 'node',
  avatar_url: 'https://example.com/avatar.png',
  gravatar_id: '',
  url: '',
  html_url: 'https://github.com/alice',
  followers_url: '',
  following_url: '',
  gists_url: '',
  starred_url: '',
  subscriptions_url: '',
  organizations_url: '',
  repos_url: '',
  events_url: '',
  received_events_url: '',
  type: 'User',
  user_view_type: 'public',
  site_admin: false,
  name: 'Alice',
  company: null,
  blog: null,
  location: 'New York',
  email: null,
  hireable: null,
  bio: null,
  twitter_username: null,
  public_repos: 0,
  public_gists: 0,
  followers: 0,
  following: 0,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

describe('processUserProfiles', () => {
  it('maps user profile and enriches location data', () => {
    const [user] = processUserProfiles([profile]);

    expect(user.login).toBe('alice');
    expect(user.country).toBeTruthy();
    expect(user.countryCode).toBeTruthy();
    expect(user.timezone).toBeTruthy();
  });

  it('handles missing location', () => {
    const [user] = processUserProfiles([{ ...profile, login: 'bob', location: null }]);

    expect(user.location).toBeNull();
    expect(user.country).toBeNull();
    expect(user.flag).toBeNull();
    expect(user.timezone).toBeNull();
  });
});
