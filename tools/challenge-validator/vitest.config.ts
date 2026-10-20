import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { workspaceAliases } from '../../vite.aliases';

export default defineConfig({
  root: path.resolve(__dirname, '../..'),
  resolve: { alias: workspaceAliases(path.resolve(__dirname, '../..')) },
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 120_000,
    hookTimeout: 120_000,
    include: ['tools/challenge-validator/src/**/*.test.ts'],
  },
});
