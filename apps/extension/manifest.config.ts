import { defineManifest } from '@crxjs/vite-plugin';

import pkg from './package.json';

export default defineManifest({
  manifest_version: 3,
  name: 'Git Repo Analyzer',
  description: 'A Chrome extension to analyze Git repositories and provide insights',
  version: pkg.version,
  icons: {
    48: 'public/icons/git-repo-analyzer-icon.svg',
  },
  action: {
    default_icon: {
      48: 'public/icons/git-repo-analyzer-icon.svg',
    },
    default_title: 'Git Repo Analyzer',
  },
  background: {
    service_worker: 'src/background.ts',
  },
  side_panel: {
    default_path: 'src/sidepanel/index.html',
  },
  permissions: ['activeTab', 'storage', 'sidePanel'],
});
