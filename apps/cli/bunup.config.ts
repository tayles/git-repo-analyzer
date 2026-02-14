import { defineConfig } from 'bunup';

export default defineConfig({
  entry: {
    index: './src/index.ts',
    cli: './src/cli.ts',
  },
  outDir: './dist',
  format: ['esm'],
  dts: false,
  minify: false,
  clean: true,
  external: ['@git-repo-analyzer/core'],
});
