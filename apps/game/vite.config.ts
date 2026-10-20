import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { workspaceAliases } from '../../vite.aliases';

const root = path.resolve(__dirname, '../..');

/** Files the Pyodide loader fetches at runtime. */
const PYODIDE_FILES = [
  'pyodide.asm.js',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
];

const MIME: Record<string, string> = {
  '.js': 'text/javascript',
  '.wasm': 'application/wasm',
  '.zip': 'application/zip',
  '.json': 'application/json',
};

/**
 * Serves the Pyodide runtime from this origin (dev server and build output) so the
 * game works offline and never depends on a third-party CDN.
 */
function selfHostedPyodide(): Plugin {
  const requireFromRuntime = createRequire(
    path.resolve(root, 'packages/python-runtime/package.json'),
  );
  const pyodideDir = path.dirname(requireFromRuntime.resolve('pyodide/package.json'));

  return {
    name: 'self-hosted-pyodide',
    configureServer(server) {
      server.middlewares.use('/pyodide/', (req, res, next) => {
        const name = path.basename((req.url ?? '').split('?')[0] ?? '');
        if (!PYODIDE_FILES.includes(name)) return next();
        res.setHeader('Content-Type', MIME[path.extname(name)] ?? 'application/octet-stream');
        fs.createReadStream(path.join(pyodideDir, name)).pipe(res);
      });
    },
    generateBundle() {
      for (const name of PYODIDE_FILES) {
        this.emitFile({
          type: 'asset',
          fileName: `pyodide/${name}`,
          source: fs.readFileSync(path.join(pyodideDir, name)),
        });
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [
    react(),
    selfHostedPyodide(),
    compression({ algorithm: 'gzip', ext: '.gz', threshold: 1024 }),
    compression({ algorithm: 'brotliCompress', ext: '.br', threshold: 1024 }),
  ],
  root: __dirname,
  resolve: {
    alias: workspaceAliases(root),
  },
  worker: {
    format: 'es',
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('/react/') || id.includes('/react-dom/')) return 'vendor-react';
          if (
            id.includes('/@codemirror/') ||
            id.includes('/codemirror/') ||
            id.includes('/@lezer/')
          )
            return 'vendor-codemirror';
          if (id.includes('/i18next/') || id.includes('/react-i18next/')) return 'vendor-i18n';
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
  server: {
    port: 4200,
    host: 'localhost',
  },
});
