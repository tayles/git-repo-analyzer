import { GitHubUserAvatar } from './GitHubUserAvatar';

interface RepoNameProps {
  fullName: string | null;
  uid?: number;
}

export function RepoName({ fullName, uid }: RepoNameProps) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      {uid && <GitHubUserAvatar uid={uid} />}
      <span className="truncate select-text" title={fullName ?? undefined}>
        {fullName}
      </span>
    </div>
  );
}
