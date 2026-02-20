import { cn } from '../lib/utils';
import { IconWithFallback } from './IconWithFallback';

interface GitHubUserAvatarProps {
  uid: number;
  className?: string;
}

export function GitHubUserAvatar({ uid, className }: GitHubUserAvatarProps) {
  const url = `https://avatars.githubusercontent.com/u/${uid}?s=48&v=4`;

  return (
    <IconWithFallback
      url={url}
      alt="GitHub user avatar"
      className={cn('rounded-full overflow-hidden', className)}
    />
  );
}
