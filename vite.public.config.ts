import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
  base: process.env.PUBLIC_BASE_PATH || '/naru-taste-house/',
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, '.') } },
  server: { watch: { ignored: ['**/outputs/**', '**/vendor/skills/**'] } },
  build: { outDir: 'dist-public', emptyOutDir: true },
});
