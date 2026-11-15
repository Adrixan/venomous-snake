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
  'pyodide.asm.mjs',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
];

const MIME: Record<string, string> = {
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.wasm': 'application/wasm',
  '.zip': 'application/zip',
  '.json': 'application/json',
};

/**
 * Pyodide release the texts in `licenses/` were taken for. A Pyodide bump can change CPython
 * and every bundled library, so the build stops until they are checked and re-vendored.
 */
const LICENSES_VENDORED_FOR = '314.0.7';

/**
 * MPL 2.0 section 3.2 asks that recipients of Pyodide's executable form learn where its
 * source is; CPython and the bundled libraries ask that their notices travel with every copy.
 */
function pyodideLicenseNotice(pyodideDir: string): string {
  const { version } = JSON.parse(
    fs.readFileSync(path.join(pyodideDir, 'package.json'), 'utf8'),
  ) as { version: string };
  if (version !== LICENSES_VENDORED_FOR) {
    throw new Error(
      `Pyodide is ${version}, but apps/game/licenses/ was vendored for ` +
        `${LICENSES_VENDORED_FOR}: re-check its CPython licence and third-party notices.`,
    );
  }
  const { info } = JSON.parse(
    fs.readFileSync(path.join(pyodideDir, 'pyodide-lock.json'), 'utf8'),
  ) as { info: { python: string } };
  const licence = (name: string): string =>
    fs.readFileSync(path.resolve(__dirname, 'licenses', name), 'utf8');
  const rule = '='.repeat(72);
  return [
    `Pyodide ${version}`,
    rule,
    '',
    `The files in this folder are the unmodified executable form of Pyodide ${version},`,
    'distributed under the Mozilla Public License 2.0 (full text below).',
    '',
    'Source code of this exact version:',
    `  https://github.com/pyodide/pyodide/tree/${version}`,
    `  https://www.npmjs.com/package/pyodide/v/${version}`,
    '',
    `Pyodide contains CPython ${info.python} and further libraries; their licences and`,
    'notices follow the MPL text.',
    '',
    'Venomous Snake itself, outside this folder, is licensed separately: see',
    'https://github.com/Adrixan/venomous-snake',
    '',
    '',
    rule,
    'Mozilla Public License 2.0 (Pyodide)',
    rule,
    '',
    licence('MPL-2.0.txt'),
    '',
    rule,
    `CPython ${info.python} licence`,
    rule,
    '',
    licence('CPython-LICENSE.txt'),
    '',
    licence('third-party-notices.txt'),
  ].join('\n');
}

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
      this.emitFile({
        type: 'asset',
        fileName: 'pyodide/LICENSE.txt',
        source: pyodideLicenseNotice(pyodideDir),
      });
    },
  };
}

/** Lists every bundled file so the service worker can precache the whole game on install. */
function precacheManifest(): Plugin {
  return {
    name: 'precache-manifest',
    apply: 'build',
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        this.emitFile({
          type: 'asset',
          fileName: 'precache-manifest.json',
          source: JSON.stringify(Object.keys(bundle)),
        });
      },
    },
  };
}

/**
 * Production-only policy: the game loads nothing from other origins, and Pyodide needs
 * `wasm-unsafe-eval`. A `<meta>` tag because shared hosting offers no header control here.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

function contentSecurityPolicy(): Plugin {
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY },
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [
    react(),
    selfHostedPyodide(),
    precacheManifest(),
    contentSecurityPolicy(),
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
    fs: {
      allow: [root],
    },
  },
});
