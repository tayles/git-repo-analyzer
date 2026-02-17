import { defineConfig } from 'bunup';
import { copy } from 'bunup/plugins';

export default defineConfig({
  noExternal: ['@git-repo-analyzer/core'],
  // Copy the root README.md file to the output directory
  plugins: [copy(['../../README.md']).to('README.md')],
});
