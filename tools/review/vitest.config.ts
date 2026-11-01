import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { workspaceAliases } from '../../vite.aliases';

const root = path.resolve(__dirname, '../..');

export default defineConfig({
  root,
  resolve: { alias: workspaceAliases(root) },
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 120_000,
    include: ['tools/review/*.test.ts'],
  },
});
