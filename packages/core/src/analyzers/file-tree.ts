import type { GitHubFileTree } from '../client/github-types';
import type { DirectorySize, FileTreeAnalysis } from '../types';

export function processFileTree(files: GitHubFileTree): FileTreeAnalysis {
  const byDirectory = new Map<string, DirectorySize>();
  let totalBytes = 0;
  let totalFiles = 0;

  for (const file of files.tree) {
    if (file.type !== 'blob') {
      continue;
    }

    const size = file.size ?? 0;
    const topLevelSegment = file.path.split('/')[0] ?? '.';
    const directoryPath = file.path.includes('/') ? topLevelSegment : '.';
    const directoryName = file.path.includes('/') ? topLevelSegment : 'Root';

    const current = byDirectory.get(directoryPath) ?? {
      name: directoryName,
      path: directoryPath,
      bytes: 0,
      fileCount: 0,
    };

    current.bytes += size;
    current.fileCount += 1;

    byDirectory.set(directoryPath, current);
    totalBytes += size;
    totalFiles += 1;
  }

  const directories = [...byDirectory.values()].sort((a, b) => b.bytes - a.bytes);

  return {
    totalBytes,
    totalFiles,
    directories,
  };
}
