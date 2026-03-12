import type { PythonInterpreter, PythonOutput, ExecutionResult } from './types';
import { PyodideInterpreter } from './PyodideInterpreter';
import { MockInterpreter } from './MockInterpreter';

/**
 * Stable wrapper that delegates to the current interpreter implementation.
 * When the underlying implementation changes (e.g., Pyodide fails → MockInterpreter),
 * all existing references continue to work via delegation.
 */
class InterpreterDelegate implements PythonInterpreter {
  private impl: PythonInterpreter;
  private outputCallbacks: Set<(output: PythonOutput) => void> = new Set();
  private inputCallbacks: Set<(prompt: string) => void> = new Set();
  private implUnsubOutput: (() => void) | null = null;
  private implUnsubInput: (() => void) | null = null;

  constructor(initial: PythonInterpreter) {
    this.impl = initial;
    this.bindImpl();
  }

  /** Switch the underlying interpreter (re-binds callbacks). */
  setImpl(newImpl: PythonInterpreter): void {
    this.unbindImpl();
    this.impl = newImpl;
    this.bindImpl();
  }

  private bindImpl(): void {
    this.implUnsubOutput = this.impl.onOutput((out) => {
      this.outputCallbacks.forEach((cb) => cb(out));
    });
    this.implUnsubInput = this.impl.onInputRequest((prompt) => {
      this.inputCallbacks.forEach((cb) => cb(prompt));
    });
  }

  private unbindImpl(): void {
    this.implUnsubOutput?.();
    this.implUnsubInput?.();
  }

  async initialize(): Promise<void> {
    return this.impl.initialize();
  }
  isReady(): boolean {
    return this.impl.isReady();
  }
  async execute(code: string): Promise<ExecutionResult> {
    return this.impl.execute(code);
  }
  provideInput(value: string): void {
    this.impl.provideInput(value);
  }
  onOutput(callback: (output: PythonOutput) => void): () => void {
    this.outputCallbacks.add(callback);
    return () => { this.outputCallbacks.delete(callback); };
  }
  onInputRequest(callback: (prompt: string) => void): () => void {
    this.inputCallbacks.add(callback);
    return () => { this.inputCallbacks.delete(callback); };
  }
  async terminate(): Promise<void> {
    this.unbindImpl();
    return this.impl.terminate();
  }
  getVersion(): string {
    return this.impl.getVersion();
  }
}

let delegate: InterpreterDelegate | null = null;
let initPromise: Promise<void> | null = null;

/**
 * Returns the shared interpreter instance (stable reference).
 * The underlying implementation may change after initialization
 * (e.g., fallback to MockInterpreter), but the reference stays the same.
 */
export function getSharedInterpreter(): PythonInterpreter {
  if (delegate === null) {
    delegate = new InterpreterDelegate(new PyodideInterpreter());
  }
  return delegate;
}

/**
 * Initializes the shared interpreter (loads Pyodide WASM).
 * Safe to call multiple times — returns the same promise.
 * Falls back to MockInterpreter if Pyodide fails to load.
 */
export function initializeSharedInterpreter(): Promise<void> {
  if (initPromise !== null) return initPromise;

  const interp = getSharedInterpreter();
  if (interp.isReady()) {
    initPromise = Promise.resolve();
    return initPromise;
  }

  initPromise = interp.initialize().catch((err: unknown) => {
    console.warn('Pyodide failed to load, falling back to MockInterpreter:', err);
    const fallback = new MockInterpreter();
    // Safe: delegate rebinds callbacks to the new implementation
    (delegate as InterpreterDelegate).setImpl(fallback);
    return fallback.initialize();
  });

  return initPromise;
}
