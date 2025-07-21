import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['./src/**/*.test.{js,jsx,ts,tsx}'],
    globals: true,
    coverage: {
      include: ['src/**'],
      exclude: ['tailwind.config.js', '**/*.d.ts', '**/*{.,-}{test,spec}.*'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
