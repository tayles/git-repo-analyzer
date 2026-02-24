import { TriangleAlert } from 'lucide-react';

import { cn } from '../lib/utils';

interface DataLimitNoticeProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A subtle inline notice shown when data may be incomplete due to API limits.
 */
export function DataLimitNotice({ children, className }: DataLimitNoticeProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-1.5 rounded-md bg-yellow-50 px-2.5 py-1.5 text-xs text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-200',
        className,
      )}
    >
      <TriangleAlert className="size-3.5 shrink-0 text-yellow-500" />
      <span>{children}</span>
    </p>
  );
}
