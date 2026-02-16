import { IconWithFallback } from './IconWithFallback';

interface GitHubUserAvatarProps {
  uid: number;
}

export function GitHubUserAvatar({ uid }: GitHubUserAvatarProps) {
  const url = `https://avatars.githubusercontent.com/u/${uid}?s=48&v=4`;

  return (
    <IconWithFallback url={url} alt="GitHub user avatar" className="overflow-hidden rounded-full" />
  );
}
