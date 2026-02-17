
import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { cn } from '../lib/utils';

interface ErrorAlertProps {
  message: string;
  className?: string;
}

export function ErrorAlert({ message, className }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={cn("max-w-md mx-auto", className)}>
      <AlertCircleIcon />
      <AlertTitle>Analysis Failed</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
}
