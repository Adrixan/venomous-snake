import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import path from 'node:path';

const root = path.resolve(__dirname, '../..');

export default defineConfig({
  plugins: [
    react(),
    // Gzip pre-compression
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
    }),
    // Brotli pre-compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
    }),
  ],
  root: __dirname,
  resolve: {
    alias: {
      '@venomous-snake/engine': path.resolve(root, 'packages/engine/src/index.ts'),
      '@venomous-snake/ui': path.resolve(root, 'packages/ui/src/index.ts'),
      '@venomous-snake/python-runtime': path.resolve(root, 'packages/python-runtime/src/index.ts'),
      '@venomous-snake/challenge-engine': path.resolve(
        root,
        'packages/challenge-engine/src/index.ts',
      ),
      '@venomous-snake/challenges': path.resolve(root, 'packages/challenges/src/index.ts'),
      '@venomous-snake/narrative': path.resolve(root, 'packages/narrative/src/index.ts'),
      '@venomous-snake/audio': path.resolve(root, 'packages/audio/src/index.ts'),
      '@venomous-snake/i18n': path.resolve(root, 'packages/i18n/src/index.ts'),
      '@venomous-snake/save-system': path.resolve(root, 'packages/save-system/src/index.ts'),
      '@venomous-snake/shared-types': path.resolve(root, 'packages/shared-types/src/index.ts'),
    },
  },
  build: {
    outDir: '../../dist/apps/game',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('/phaser/')) return 'vendor-phaser';
          if (id.includes('/react/') || id.includes('/react-dom/')) return 'vendor-react';
          if (
            id.includes('/@codemirror/') ||
            id.includes('/codemirror/') ||
            id.includes('/@lezer/')
          )
            return 'vendor-codemirror';
          if (id.includes('/pyodide/')) return 'vendor-pyodide';
          if (id.includes('/i18next/') || id.includes('/react-i18next/')) return 'vendor-i18n';
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 800, // Phaser is ~1.6MB, expected
  },
  server: {
    port: 4200,
    host: 'localhost',
  },
});
