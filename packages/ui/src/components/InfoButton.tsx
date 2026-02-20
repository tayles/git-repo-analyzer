import { Info } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface InfoButtonProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export function InfoButton({ title, className, children }: InfoButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={className} aria-label="More information">
          <Info className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer transition-colors" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="text-sm">
        {title && <p className="font-medium">{title}</p>}
        {children}
      </PopoverContent>
    </Popover>
  );
}
