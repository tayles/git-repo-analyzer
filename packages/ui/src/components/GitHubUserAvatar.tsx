import { cn } from '../lib/utils';
import { IconWithFallback } from './IconWithFallback';

interface GitHubUserAvatarProps {
  uid: number | null | undefined;
  className?: string;
}

export function GitHubUserAvatar({ uid, className }: GitHubUserAvatarProps) {
  if (!uid) return null;

  const url = `https://avatars.githubusercontent.com/u/${uid}?s=48&v=4`;

  return (
    <IconWithFallback
      url={url}
      alt="GitHub user avatar"
      className={cn('size-6 rounded-full overflow-hidden', className)}
    />
  );
}
