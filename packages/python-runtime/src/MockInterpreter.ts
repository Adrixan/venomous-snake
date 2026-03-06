import type { PythonInterpreter, PythonOutput, ExecutionResult } from './types';

export class MockInterpreter implements PythonInterpreter {
  private ready = false;
  private outputCallbacks: Set<(output: PythonOutput) => void> = new Set();
  private inputCallbacks: Set<(prompt: string) => void> = new Set();
  private queuedResults: ExecutionResult[] = [];
  private readonly mockVersion = 'Python 3.12.0 (mock)';

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

    // Default: parse print("...") or print('...') calls and emit them as stdout
    const output: PythonOutput[] = [];
    const printRegex = /print\((['"])(.*?)\1\)/g;
    let match: RegExpExecArray | null;
    while ((match = printRegex.exec(code)) !== null) {
      const text = (match[2] ?? '') + '\n';
      const out: PythonOutput = { type: 'stdout', text };
      output.push(out);
      this.outputCallbacks.forEach((cb) => cb(out));
    }

    if (output.length === 0) {
      const text = `[Mock execution]\n${code}\n`;
      const out: PythonOutput = { type: 'stdout', text };
      output.push(out);
      this.outputCallbacks.forEach((cb) => cb(out));
    }

    return { success: true, output, executionTimeMs: Date.now() - startTime };
  }

  provideInput(_value: string): void {
    // no-op in mock
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
  }

  getVersion(): string {
    return this.mockVersion;
  }
}
