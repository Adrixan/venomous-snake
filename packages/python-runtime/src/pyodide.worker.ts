/// <reference lib="webworker" />
import { loadPyodide } from 'pyodide';
import { createRuntime } from './runtimeCore';
import type { PythonRuntime, RunRequest, RunOutcome, PyodideLike } from './runtimeCore';

export type WorkerRequest =
  | { type: 'init'; indexURL: string }
  | ({ type: 'run'; id: number } & RunRequest);

export type WorkerResponse =
  | { type: 'ready'; version: string }
  | { type: 'init-error'; message: string }
  | ({ type: 'result'; id: number } & RunOutcome);

const scope = self as unknown as {
  postMessage(message: WorkerResponse): void;
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
};

let runtime: PythonRuntime | null = null;

scope.onmessage = (event: MessageEvent<WorkerRequest>): void => {
  const message = event.data;
  if (message.type === 'init') {
    loadPyodide({ indexURL: message.indexURL })
      .then((pyodide) => {
        runtime = createRuntime(pyodide as unknown as PyodideLike);
        scope.postMessage({ type: 'ready', version: runtime.version() });
      })
      .catch((err: unknown) => {
        scope.postMessage({
          type: 'init-error',
          message: err instanceof Error ? err.message : String(err),
        });
      });
    return;
  }

  const { id, ...request } = message;
  if (runtime === null) {
    scope.postMessage({ type: 'result', id, stdout: '', stderr: 'RuntimeError: not ready' });
    return;
  }
  try {
    scope.postMessage({ type: 'result', id, ...runtime.run(request) });
  } catch (err) {
    const text = err instanceof Error ? err.message : String(err);
    scope.postMessage({ type: 'result', id, stdout: '', stderr: `RuntimeError: ${text}` });
  }
};
