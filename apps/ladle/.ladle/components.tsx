import type { GlobalProvider } from '@ladle/react';

import './ladle.css';
import { useEffect } from 'react';

/**
 * Global provider that wraps all stories
 * This is where you add global styles, providers, etc.
 */
export const Provider: GlobalProvider = ({ children, globalState }) => {
  useEffect(() => {
    if (globalState.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [globalState.theme]);

  return children;
};
