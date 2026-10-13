import path from 'node:path';
import { createRequire } from 'node:module';
import { loadPyodide } from 'pyodide';
import { InProcessInterpreter } from '../InProcessInterpreter';
import type { PyodideLike } from '../runtimeCore';

const require = createRequire(import.meta.url);

let cached: Promise<PyodideLike> | null = null;

/** Loads the Pyodide build that ships with the npm package (no network needed). */
export function loadNodePyodide(): Promise<PyodideLike> {
  if (cached === null) {
    const dir = path.dirname(require.resolve('pyodide/package.json')) + path.sep;
    cached = loadPyodide({ indexURL: dir }) as unknown as Promise<PyodideLike>;
  }
  return cached;
}

export async function createNodeInterpreter(): Promise<InProcessInterpreter> {
  return new InProcessInterpreter(await loadNodePyodide());
}
