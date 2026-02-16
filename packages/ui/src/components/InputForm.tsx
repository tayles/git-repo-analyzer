import { useCallback } from 'react';

import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface InputFormProps {
  repo: string | null;
  onAnalyze: (repo: string) => void;
}

export function InputForm({ repo, onAnalyze }: InputFormProps) {
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
      <Card>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="repo">Repo</Label>
              <Input
                id="repo"
                type="text"
                placeholder="owner/repo or full GitHub URL"
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
        </CardFooter>
      </Card>
    </form>
  );
}
