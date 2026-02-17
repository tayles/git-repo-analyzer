import { IconWithFallback } from './IconWithFallback';

interface ToolLogoProps {
  logo: string | null;
  className?: string;
}

export function ToolLogo({ logo, className }: ToolLogoProps) {
  if (logo && !logo.startsWith('http')) {
    // assume simpleicons
    logo = `https://cdn.simpleicons.org/${logo}`;
  }

  return <IconWithFallback url={logo} alt="Tool logo" className={className} />;
}
