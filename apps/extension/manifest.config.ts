import { defineManifest } from '@crxjs/vite-plugin';

import pkg from './package.json';

export default defineManifest({
  manifest_version: 3,
  name: 'Git Repo Analyzer',
  description:
    'View the tech stack, work patterns, project structure and health of any GitHub repository',
  version: pkg.version,
  icons: {
    16: 'public/icons/git-repo-analyzer-icon-16x16.png',
    32: 'public/icons/git-repo-analyzer-icon-32x32.png',
    48: 'public/icons/git-repo-analyzer-icon-48x48.png',
    96: 'public/icons/git-repo-analyzer-icon-96x96.png',
    128: 'public/icons/git-repo-analyzer-icon-128x128.png',
    512: 'public/icons/git-repo-analyzer-icon-512x512.png',
  },
  action: {
    default_icon: {
      16: 'public/icons/git-repo-analyzer-icon-16x16.png',
      32: 'public/icons/git-repo-analyzer-icon-32x32.png',
      48: 'public/icons/git-repo-analyzer-icon-48x48.png',
      96: 'public/icons/git-repo-analyzer-icon-96x96.png',
      128: 'public/icons/git-repo-analyzer-icon-128x128.png',
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
  permissions: ['activeTab', 'storage', 'sidePanel'],
  commands: {
    'get-repo-details': {
      suggested_key: {
        default: 'Alt+A',
      },
      description: 'Get repository details',
    },
  },
});
