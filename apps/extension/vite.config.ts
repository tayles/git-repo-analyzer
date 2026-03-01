import path from 'node:path';

import { crx } from '@crxjs/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type PluginOption } from 'vite';
import zip from 'vite-plugin-zip-pack';

import manifest from './manifest.config.js';
import { version } from './package.json';

export default defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [
    react() as PluginOption,
    tailwindcss() as PluginOption,
    crx({ manifest }) as PluginOption,
    zip({ outDir: 'release', outFileName: `git-repo-analyzer-${version}.zip` }) as PluginOption,
  ],
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
});
