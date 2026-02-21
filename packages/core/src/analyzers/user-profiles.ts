import type { GitHubUserProfile } from '../client/github-types';
import type { UserProfile } from '../types';
import { countryCodeToEmojiFlag, parseLocation } from '../utils/location-utils';

export function processUserProfiles(profiles: GitHubUserProfile[]): UserProfile[] {
  const users = profiles.map(u => {
    const location = parseLocation(u.location);
    const country = location?.country ?? null;
    const countryCode = location?.iso2 ?? null;
    const flag = countryCode ? countryCodeToEmojiFlag(countryCode) : null;
    const timezone = location?.timezone ?? null;

    return {
      id: u.id,
      name: u.name ?? null,
      login: u.login,
      avatarUrl: u.avatar_url,
      htmlUrl: u.html_url,
      location: u.location ?? null,

      country,
      countryCode,
      flag,
      timezone,
    };
  });

  return users;
}
