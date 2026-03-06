import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const root = path.resolve(__dirname, '../..');

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  resolve: {
    alias: {
      '@venomous-snake/engine': path.resolve(root, 'packages/engine/src/index.ts'),
      '@venomous-snake/ui': path.resolve(root, 'packages/ui/src/index.ts'),
      '@venomous-snake/python-runtime': path.resolve(root, 'packages/python-runtime/src/index.ts'),
      '@venomous-snake/challenge-engine': path.resolve(root, 'packages/challenge-engine/src/index.ts'),
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
  },
  server: {
    port: 4200,
    host: 'localhost',
  },
});
