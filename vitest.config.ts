import { fileURLToPath } from 'url';
import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    // globals: true,
    exclude: [...configDefaults.exclude, '**/playwright/**'],
    alias: {
      '~/': fileURLToPath(new URL('./src/', import.meta.url)),
    },
  },
});
