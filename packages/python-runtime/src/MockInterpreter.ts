import type { PythonInterpreter, PythonOutput, PythonError, ExecutionResult } from './types';
import { MiniPythonEvaluator } from './MiniPythonEvaluator';

export class MockInterpreter implements PythonInterpreter {
  private ready = false;
  private outputCallbacks: Set<(output: PythonOutput) => void> = new Set();
  private inputCallbacks: Set<(prompt: string) => void> = new Set();
  private queuedResults: ExecutionResult[] = [];
  private inputQueue: string[] = [];
  private readonly mockVersion = 'Python 3.12.0 (mock)';
  private readonly evaluator = new MiniPythonEvaluator();

  /** Queue a specific ExecutionResult to be returned on the next execute() call. */
  queueResult(result: ExecutionResult): void {
    this.queuedResults.push(result);
  }

  async initialize(): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 10));
    this.ready = true;
  }

  isReady(): boolean {
    return this.ready;
  }

  async execute(code: string): Promise<ExecutionResult> {
    const startTime = Date.now();

    // Return queued result if available (used for test injection)
    const queued = this.queuedResults.shift();
    if (queued !== undefined) {
      queued.output.forEach((o) => this.outputCallbacks.forEach((cb) => cb(o)));
      return queued;
    }

    // Queue any pending input for the evaluator
    for (const inp of this.inputQueue) {
      this.evaluator.queueInput(inp);
    }
    this.inputQueue = [];

    // Execute using the mini Python evaluator
    const result = this.evaluator.execute(code);
    const output: PythonOutput[] = [];

    if (result.stdout) {
      // Split into per-print-statement outputs (each ends with \n)
      const parts = result.stdout.split('\n');
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part === undefined || (part === '' && i === parts.length - 1)) continue;
        const text = part + '\n';
        const out: PythonOutput = { type: 'stdout', text };
        output.push(out);
        this.outputCallbacks.forEach((cb) => cb(out));
      }
    }

    if (!result.success && result.error) {
      const errText = `${result.error.type}: ${result.error.message}`;
      const errOut: PythonOutput = { type: 'stderr', text: errText };
      output.push(errOut);
      this.outputCallbacks.forEach((cb) => cb(errOut));

      const error: PythonError = {
        type: result.error.type,
        message: result.error.message,
        ...(result.error.line !== undefined ? { line: result.error.line } : {}),
      };
      return { success: false, output, error, executionTimeMs: Date.now() - startTime };
    }

    return { success: true, output, executionTimeMs: Date.now() - startTime };
  }

  provideInput(value: string): void {
    this.inputQueue.push(value);
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

  async terminate(): Promise<void> {
    this.ready = false;
    this.queuedResults = [];
    this.inputQueue = [];
  }

  getVersion(): string {
    return this.mockVersion;
  }
}
