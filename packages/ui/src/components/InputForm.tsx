import { useCallback } from 'react';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface InputFormProps {
  onAnalyze: (repo: string) => void;
}

export function InputForm({ onAnalyze }: InputFormProps) {
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
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Analyze Repository</CardTitle>
          <CardDescription>Enter your repository URL below to analyze it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="repo">Repo</Label>
              <Input id="repo" type="text" placeholder="owner/repo or full GitHub URL" required />
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
