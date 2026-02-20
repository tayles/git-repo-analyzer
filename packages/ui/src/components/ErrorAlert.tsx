import { AlertCircleIcon } from 'lucide-react';

import { cn } from '../lib/utils';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

interface ErrorAlertProps {
  message: string;
  className?: string;
}

export function ErrorAlert({ message, className }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={cn('max-w-xl mx-auto select-text', className)}>
      <AlertCircleIcon />
      <AlertTitle>Analysis Failed</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
