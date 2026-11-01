import path from 'node:path';
import { mergeConfig } from 'vite';
import type { Plugin, UserConfig } from 'vite';
import appConfig from '../../apps/game/vite.config';
import { writeReport } from './report';

const root = path.resolve(__dirname, '../..');

type Inputs = Record<string, { bytesInOutput: number }>;

/** Records which source modules end up in a bundle and how many bytes each contributes. */
function collectInputs(inputs: Inputs): Plugin {
  return {
    name: 'review-collect-inputs',
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') continue;
        for (const [id, info] of Object.entries(output.modules)) {
          if (id.startsWith('\0')) continue;
          const file = path.relative(root, id.split('?')[0] ?? id);
          const bytes = inputs[file]?.bytesInOutput ?? 0;
          inputs[file] = { bytesInOutput: bytes + info.renderedLength };
        }
      }
    },
  };
}

const inputs: Inputs = {};

/**
 * Production build of the game that writes nothing but `.scratch/review/meta.json`, the
 * module list `reach.py` reads. Workers are bundled separately, so they are collected too.
 */
export default mergeConfig(appConfig as UserConfig, {
  plugins: [
    collectInputs(inputs),
    {
      name: 'review-write-metafile',
      closeBundle() {
        writeReport('meta.json', JSON.stringify({ outputs: { bundle: { inputs } } }));
      },
    } satisfies Plugin,
  ],
  worker: { plugins: () => [collectInputs(inputs)] },
  build: { write: false, emptyOutDir: false, outDir: path.join(root, '.scratch/review/bundle') },
} satisfies UserConfig);
