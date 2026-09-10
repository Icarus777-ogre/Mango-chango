import { defineConfig } from 'vite';

// Pure Vanilla JS Vite configuration
export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});
