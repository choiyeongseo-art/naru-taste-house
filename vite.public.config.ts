import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
  base: process.env.PUBLIC_BASE_PATH || '/naru-taste-house/',
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, '.') } },
  build: { outDir: 'dist-public', emptyOutDir: true },
});
