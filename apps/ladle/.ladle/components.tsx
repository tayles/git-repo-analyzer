import type { GlobalProvider } from '@ladle/react';

import './ladle.css';

/**
 * Global provider that wraps all stories
 * This is where you add global styles, providers, etc.
 */
export const Provider: GlobalProvider = ({ children }) => {
  return <div className="p-4">{children}</div>;
};
