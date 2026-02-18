import { useCallback, useRef, useEffect } from 'react';

import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface InputFormProps {
  repo: string | null;
  token: string;
  isTokenSectionOpen: boolean;
  onAnalyze: (repo: string) => void;
  onTokenChange: (token: string) => void;
  onTokenSectionOpenChange: (open: boolean) => void;
}

export function InputForm({
  repo,
  token,
  isTokenSectionOpen,
  onAnalyze,
  onTokenChange,
  onTokenSectionOpenChange,
}: InputFormProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.open = isTokenSectionOpen;
    }
  }, [isTokenSectionOpen]);

  const handleAnalyze = useCallback(() => {
    const input = document.getElementById('repo') as HTMLInputElement;
    if (input && input.value) {
      onAnalyze(input.value);
    }
  }, [onAnalyze]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleAnalyze();
      }}
    >
      <Card className="mx-auto max-w-2xl">
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="repo">Repo</Label>
              <Input
                id="repo"
                type="text"
                placeholder="owner/repo or a full GitHub URL"
                required
                autoFocus
                defaultValue={repo ?? ''}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Analyze Now
          </Button>
          <details
            ref={detailsRef}
            className="w-full"
            onToggle={e => onTokenSectionOpenChange((e.target as HTMLDetailsElement).open)}
          >
            <summary className="text-muted-foreground hover:text-foreground mt-2 cursor-pointer text-sm transition-colors">
              Access private repos or need higher rate limits?
            </summary>
            <div className="mt-3 grid gap-2">
              <Label htmlFor="github-token" className="text-sm">
                GitHub Personal Access Token
              </Label>
              <Input
                id="github-token"
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={e => onTokenChange(e.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                Create a token at{' '}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground underline"
                >
                  github.com/settings/tokens
                </a>
                . No scopes needed for public repos; &quot;repo&quot; scope for private repos.
              </p>
            </div>
          </details>
        </CardFooter>
      </Card>
    </form>
  );
}
