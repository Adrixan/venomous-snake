import type {
  PythonInterpreter,
  PythonOutput,
  PythonError,
  ExecutionResult,
  ExecuteOptions,
  InterpreterStatus,
} from '@venomous-snake/shared-types';
import { parseTraceback } from './runtimeCore';
import type { RunRequest, RunOutcome } from './runtimeCore';

export const DEFAULT_TIMEOUT_MS = 10_000;

export type StatusListener = (status: InterpreterStatus) => void;

/**
 * Shared execution loop: serialises runs, streams output to listeners, and
 * implements interactive `input()` by re-running the program with the answers
 * collected so far (the program is deterministic and side-effect free).
 */
export abstract class BaseInterpreter implements PythonInterpreter {
  private readonly outputCallbacks = new Set<(output: PythonOutput) => void>();
  private readonly inputCallbacks = new Set<(prompt: string) => void>();
  private readonly statusListeners = new Set<StatusListener>();
  private queued: string[] = [];
  private inputWaiter: ((value: string | null) => void) | null = null;
  private queue: Promise<unknown> = Promise.resolve();
  private currentStatus: InterpreterStatus = 'uninitialized';

  abstract initialize(): Promise<void>;
  abstract getVersion(): string;
  abstract terminate(): Promise<void>;

  /** Runs the program once. Resolves to `null` when the time limit was hit. */
  protected abstract runOnce(request: RunRequest, timeoutMs: number): Promise<RunOutcome | null>;

  isReady(): boolean {
    return this.currentStatus === 'ready' || this.currentStatus === 'executing';
  }

  getStatus(): InterpreterStatus {
    return this.currentStatus;
  }

  onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  protected setStatus(status: InterpreterStatus): void {
    if (this.currentStatus === status) return;
    this.currentStatus = status;
    for (const listener of this.statusListeners) listener(status);
  }

  execute(code: string, options: ExecuteOptions = {}): Promise<ExecutionResult> {
    const run = this.queue.then(() => this.executeInternal(code, options));
    this.queue = run.catch(() => undefined);
    return run;
  }

  provideInput(value: string): void {
    if (this.inputWaiter !== null) {
      const waiter = this.inputWaiter;
      this.inputWaiter = null;
      waiter(value);
    } else {
      this.queued.push(value);
    }
  }

  onOutput(callback: (output: PythonOutput) => void): () => void {
    this.outputCallbacks.add(callback);
    return () => {
      this.outputCallbacks.delete(callback);
    };
  }

  onInputRequest(callback: (prompt: string) => void): () => void {
    this.inputCallbacks.add(callback);
    return () => {
      this.inputCallbacks.delete(callback);
    };
  }

  /** Releases a pending input request (used when the runtime is torn down). */
  protected cancelPendingInput(): void {
    if (this.inputWaiter !== null) {
      const waiter = this.inputWaiter;
      this.inputWaiter = null;
      waiter(null);
    }
  }

  private emit(output: PythonOutput): void {
    for (const callback of this.outputCallbacks) callback(output);
  }

  private requestInput(prompt: string): Promise<string | null> {
    return new Promise<string | null>((resolve) => {
      this.inputWaiter = resolve;
      for (const callback of this.inputCallbacks) callback(prompt);
    });
  }

  private async executeInternal(code: string, options: ExecuteOptions): Promise<ExecutionResult> {
    const started = Date.now();
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const interactive = options.interactive === true && this.inputCallbacks.size > 0;
    const echoPrompts = options.echoPrompts ?? options.interactive === true;
    const inputs = [...this.queued, ...(options.inputs ?? [])];
    this.queued = [];

    this.setStatus('executing');
    const output: PythonOutput[] = [];
    let emittedStdout = 0;
    let finalOutcome: RunOutcome | null = null;
    let timedOut = false;

    try {
      for (;;) {
        const outcome = await this.runOnce({ code, inputs, echoPrompts, interactive }, timeoutMs);
        if (outcome === null) {
          timedOut = true;
          break;
        }
        const fresh = outcome.stdout.slice(emittedStdout);
        if (fresh !== '') {
          const out: PythonOutput = { type: 'stdout', text: fresh };
          output.push(out);
          this.emit(out);
          emittedStdout = outcome.stdout.length;
        }
        if (outcome.needsInput === undefined) {
          finalOutcome = outcome;
          break;
        }
        const answer = await this.requestInput(outcome.needsInput);
        if (answer === null) {
          finalOutcome = { stdout: outcome.stdout, stderr: '' };
          break;
        }
        inputs.push(answer);
      }
    } finally {
      this.setStatus(this.currentStatus === 'executing' ? 'ready' : this.currentStatus);
    }

    const executionTimeMs = Date.now() - started;

    if (timedOut) {
      const error: PythonError = {
        type: 'TimeoutError',
        message: `Execution stopped after ${String(Math.round(timeoutMs / 1000))} s. Check for a loop that never ends.`,
      };
      const out: PythonOutput = { type: 'stderr', text: `${error.type}: ${error.message}\n` };
      output.push(out);
      this.emit(out);
      return { success: false, output, error, executionTimeMs, timedOut: true };
    }

    const stderr = finalOutcome?.stderr ?? '';
    if (stderr !== '') {
      const out: PythonOutput = { type: 'stderr', text: stderr };
      output.push(out);
      this.emit(out);
      return {
        success: false,
        output,
        error: parseTraceback(stderr),
        executionTimeMs,
      };
    }
    return { success: true, output, executionTimeMs };
  }
}
