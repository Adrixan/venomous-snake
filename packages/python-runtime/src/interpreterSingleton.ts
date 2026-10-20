import { WorkerPyodideInterpreter } from './WorkerPyodideInterpreter';

let shared: WorkerPyodideInterpreter | null = null;

function defaultIndexURL(): string {
  return new URL('pyodide/', document.baseURI).href;
}

/** Returns the application-wide interpreter (stable reference). */
export function getSharedInterpreter(): WorkerPyodideInterpreter {
  if (shared === null) {
    shared = new WorkerPyodideInterpreter({ indexURL: defaultIndexURL() });
  }
  return shared;
}

/**
 * Starts loading the Python runtime. Safe to call repeatedly; rejects when the
 * runtime cannot be loaded so callers can show an explicit error state.
 */
export function initializeSharedInterpreter(): Promise<void> {
  return getSharedInterpreter().initialize();
}
