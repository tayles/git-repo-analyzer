import { GitHubUserAvatar } from './GitHubUserAvatar';
import { Button } from './ui/button';

interface GettingStartedPlaceholderProps {
  onSelectExample: (repo: string) => void;
}

const examples = [
  { name: 'facebook/react', uid: 69631 },
  { name: 'facebook/docusaurus', uid: 69631 },
  { name: 'microsoft/vscode', uid: 6154722 },
  { name: 'vercel/vercel', uid: 14985020 },
  { name: 'sindresorhus/awesome', uid: 170270 },
  { name: 'torvalds/linux', uid: 1024025 },
  { name: 'nodejs/node', uid: 9950313 },
  { name: 'golang/go', uid: 4314092 },
  { name: 'python/cpython', uid: 1525981 },
  { name: 'rust-lang/rust', uid: 5430905 },
];

export function GettingStartedPlaceholder({ onSelectExample }: GettingStartedPlaceholderProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <p className="text-muted-foreground text-center text-sm">
        To get started, enter a repository URL above, or try an example below:
      </p>

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        {examples.map(example => (
          <li key={example.name} className="text-left">
            <Button variant="link" onClick={() => onSelectExample(example.name)}>
              <GitHubUserAvatar uid={example.uid} />
              <span>{example.name}</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
