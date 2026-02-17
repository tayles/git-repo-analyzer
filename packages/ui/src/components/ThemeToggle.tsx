import { useEffect } from 'react';

export function ThemeToggle() {
  useEffect(() => {
    // add .dark to html if user has dark mode enabled
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }

    // listen for changes in the user's color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) =>
      document.documentElement.classList.toggle('dark', e.matches);

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return <></>;
}
