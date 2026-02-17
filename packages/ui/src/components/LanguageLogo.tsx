import { IconWithFallback } from './IconWithFallback';

interface LanguageLogoProps {
  language: string | null;
  className?: string;
}

export function LanguageLogo({ language, className }: LanguageLogoProps) {
  const url = `https://cdn.simpleicons.org/${language}`;

  return <IconWithFallback url={url} alt={language ?? ''} className={className} />;
}
