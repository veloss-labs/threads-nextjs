import { defineConfig } from 'tsup';

export default defineConfig([
  {
    clean: true,
    entry: {
      cli: 'scripts/cli/index.ts',
    },
    format: ['esm', 'cjs'],
    minify: true,
    external: [/^\$/],
  },
]);
