import { Info, TriangleAlert } from 'lucide-react';

import { cn } from '../lib/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

interface InfoButtonProps {
  title?: string;
  className?: string;
  /** Show a yellow warning triangle instead of the default info icon */
  warning?: boolean;
  children: React.ReactNode;
}

export function InfoButton({ title, className, warning, children }: InfoButtonProps) {
  return (
    <HoverCard openDelay={50}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className={cn('cursor-pointer', className)}
          aria-label="More information"
        >
          {warning ? (
            <TriangleAlert className="size-4 text-yellow-500 transition-colors hover:text-yellow-600" />
          ) : (
            <Info className="text-muted-foreground hover:text-foreground size-4 transition-colors" />
          )}
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="flex flex-col gap-2 text-sm">
        {title && <p className="font-medium">{title}</p>}
        {children}
      </HoverCardContent>
    </HoverCard>
  );
}
