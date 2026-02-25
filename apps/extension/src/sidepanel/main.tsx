import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './sidepanel.css';
import SidePanel from './SidePanel';

createRoot(document.getElementById('root')!, {
  onUncaughtError: (error: unknown) => {
    console.error('Uncaught error:', error);
    window.localStorage.clear(); // Clear localStorage to reset app state
    window.location.reload(); // Reload the page to recover from the error
  },
}).render(
  <StrictMode>
    <SidePanel />
  </StrictMode>,
);
