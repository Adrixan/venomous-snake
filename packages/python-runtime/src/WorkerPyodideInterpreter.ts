import type { InterpreterStatus } from '@venomous-snake/shared-types';
import { BaseInterpreter } from './BaseInterpreter';
import type { RunRequest, RunOutcome } from './runtimeCore';
import type { WorkerRequest, WorkerResponse } from './pyodide.worker';

export interface WorkerInterpreterOptions {
  /** Absolute URL of the directory that holds the self-hosted Pyodide files. */
  indexURL: string;
  /** Creates the worker; overridable for tests. */
  createWorker?: () => Worker;
  /** Give up on loading the runtime after this many milliseconds. */
  initTimeoutMs?: number;
}

const DEFAULT_INIT_TIMEOUT_MS = 90_000;

/**
 * Runs CPython (Pyodide) in a dedicated Web Worker. A program that never ends is
 * stopped by terminating the worker, which is re-created on the next run.
 */
export class WorkerPyodideInterpreter extends BaseInterpreter {
  private worker: Worker | null = null;
  private initPromise: Promise<void> | null = null;
  private version = 'Python (loading...)';
  private nextId = 1;
  private pending = new Map<number, (outcome: RunOutcome) => void>();
  private readonly indexURL: string;
  private readonly createWorker: () => Worker;
  private readonly initTimeoutMs: number;
  private lastError: string | null = null;

  constructor(options: WorkerInterpreterOptions) {
    super();
    this.indexURL = options.indexURL;
    this.initTimeoutMs = options.initTimeoutMs ?? DEFAULT_INIT_TIMEOUT_MS;
    this.createWorker =
      options.createWorker ??
      ((): Worker =>
        new Worker(new URL('./pyodide.worker.ts', import.meta.url), { type: 'module' }));
  }

  getVersion(): string {
    return this.version;
  }

  getLastError(): string | null {
    return this.lastError;
  }

  initialize(): Promise<void> {
    if (this.initPromise !== null) return this.initPromise;
    this.setStatus('loading');
    this.lastError = null;

    this.initPromise = new Promise<void>((resolve, reject) => {
      let worker: Worker;
      try {
        worker = this.createWorker();
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
        return;
      }
      this.worker = worker;

      const fail = (message: string): void => {
        clearTimeout(timer);
        this.disposeWorker();
        this.lastError = message;
        this.setStatus('error');
        reject(new Error(message));
      };
      const timer = setTimeout(
        () => fail('Python runtime did not start in time'),
        this.initTimeoutMs,
      );

      worker.onerror = (event: ErrorEvent): void => fail(event.message || 'Worker failed');
      worker.onmessage = (event: MessageEvent<WorkerResponse>): void => {
        const message = event.data;
        if (message.type === 'ready') {
          clearTimeout(timer);
          this.version = message.version;
          this.setStatus('ready');
          worker.onerror = null;
          worker.onmessage = (e: MessageEvent<WorkerResponse>): void => this.handleResult(e.data);
          resolve();
        } else if (message.type === 'init-error') {
          fail(message.message);
        }
      };
      const init: WorkerRequest = { type: 'init', indexURL: this.indexURL };
      worker.postMessage(init);
    });

    this.initPromise.catch(() => {
      this.initPromise = null;
    });
    return this.initPromise;
  }

  protected async runOnce(request: RunRequest, timeoutMs: number): Promise<RunOutcome | null> {
    await this.initialize();
    const worker = this.worker;
    if (worker === null) throw new Error('Python runtime is not available');

    return new Promise<RunOutcome | null>((resolve) => {
      const id = this.nextId++;
      const timer = setTimeout(() => {
        this.pending.delete(id);
        // The only way to stop synchronous Python is to discard the worker.
        this.disposeWorker();
        this.initPromise = null;
        this.setStatus('uninitialized');
        resolve(null);
      }, timeoutMs);
      this.pending.set(id, (outcome) => {
        clearTimeout(timer);
        resolve(outcome);
      });
      const message: WorkerRequest = { type: 'run', id, ...request };
      worker.postMessage(message);
    });
  }

  async terminate(): Promise<void> {
    this.cancelPendingInput();
    this.disposeWorker();
    this.initPromise = null;
    this.setStatus('uninitialized');
  }

  private handleResult(message: WorkerResponse): void {
    if (message.type !== 'result') return;
    const resolve = this.pending.get(message.id);
    if (resolve === undefined) return;
    this.pending.delete(message.id);
    const outcome: RunOutcome = {
      stdout: message.stdout,
      stderr: message.stderr,
      ...(message.needsInput !== undefined ? { needsInput: message.needsInput } : {}),
    };
    resolve(outcome);
  }

  private disposeWorker(): void {
    if (this.worker !== null) {
      this.worker.terminate();
      this.worker = null;
    }
    this.pending.clear();
  }
}

export type { InterpreterStatus };
