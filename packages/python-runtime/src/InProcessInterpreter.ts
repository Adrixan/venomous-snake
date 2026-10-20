import { BaseInterpreter } from './BaseInterpreter';
import { createRuntime } from './runtimeCore';
import type { PythonRuntime, PyodideLike, RunRequest, RunOutcome } from './runtimeCore';

/**
 * Runs Python on the calling thread. Intended for Node tooling and tests where a
 * Pyodide instance is already loaded; it cannot interrupt a runaway program.
 */
export class InProcessInterpreter extends BaseInterpreter {
  private readonly runtime: PythonRuntime;

  constructor(pyodide: PyodideLike) {
    super();
    this.runtime = createRuntime(pyodide);
    this.setStatus('ready');
  }

  initialize(): Promise<void> {
    return Promise.resolve();
  }

  getVersion(): string {
    return this.runtime.version();
  }

  terminate(): Promise<void> {
    this.cancelPendingInput();
    this.setStatus('uninitialized');
    return Promise.resolve();
  }

  protected runOnce(request: RunRequest): Promise<RunOutcome | null> {
    return Promise.resolve(this.runtime.run(request));
  }
}
