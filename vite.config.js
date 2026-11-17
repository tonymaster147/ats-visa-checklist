import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Stable, hash-free file names so the WordPress plugin can enqueue
// dist/visa-checklist.js and dist/visa-checklist.css directly.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'visa-checklist.js',
        chunkFileNames: 'visa-checklist-[name].js',
        assetFileNames: (info) =>
          info.names?.some((n) => n.endsWith('.css')) ? 'visa-checklist.css' : 'assets/[name][extname]',
      },
    },
  },
});
