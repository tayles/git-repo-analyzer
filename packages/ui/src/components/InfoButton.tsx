import { Info, TriangleAlert } from 'lucide-react';
import { useState } from 'react';

import { cn } from '../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface InfoButtonProps {
  title?: string;
  className?: string;
  /** Show a yellow warning triangle instead of the default info icon */
  warning?: boolean;
  children: React.ReactNode;
}

export function InfoButton({ title, className, warning, children }: InfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn('cursor-pointer', className)}
          aria-label="More information"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {warning ? (
            <TriangleAlert className="size-4 text-yellow-500 transition-colors hover:text-yellow-600" />
          ) : (
            <Info className="text-muted-foreground hover:text-foreground size-4 transition-colors" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2 text-sm">
        {title && <p className="font-medium">{title}</p>}
        {children}
      </PopoverContent>
    </Popover>
  );
}
