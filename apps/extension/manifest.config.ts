import { defineManifest } from '@crxjs/vite-plugin';

import pkg from './package.json';

export default defineManifest({
  manifest_version: 3,
  name: 'Git Repo Analyzer',
  description: 'View the tech stack, health and other insights of any GitHub repository',
  version: pkg.version,
  icons: {
    512: 'public/icons/git-repo-analyzer-icon-512x512.png',
  },
  action: {
    default_icon: {
      512: 'public/icons/git-repo-analyzer-icon-512x512.png',
    },
    default_title: 'Git Repo Analyzer',
  },
  background: {
    service_worker: 'src/background.ts',
  },
  side_panel: {
    default_path: 'src/sidepanel/index.html',
  },
  permissions: ['activeTab', 'storage', 'sidePanel', 'contextMenus'],
  commands: {
    'get-repo-details': {
      suggested_key: {
        default: 'Alt+A',
      },
      description: 'Get repository details',
    },
  },
});
