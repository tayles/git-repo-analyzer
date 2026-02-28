import { cn } from '../lib/utils';
import { IconWithFallback } from './IconWithFallback';

interface ToolLogoProps {
  logo: string | null;
  invertColor?: boolean;
  className?: string;
}

export function ToolLogo({ logo, invertColor, className }: ToolLogoProps) {
  if (logo && !logo.startsWith('http')) {
    // assume simpleicons
    logo = `https://cdn.simpleicons.org/${logo}`;
  }

  return (
    <IconWithFallback
      url={logo}
      alt="Tool logo"
      className={cn(invertColor && 'dark:invert', className)}
    />
  );
}
