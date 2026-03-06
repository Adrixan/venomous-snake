import type { PythonInterpreter, PythonOutput, ExecutionResult } from './types';

export class MockInterpreter implements PythonInterpreter {
  private ready = false;
  private outputCallbacks: Set<(output: PythonOutput) => void> = new Set();
  private inputCallbacks: Set<(prompt: string) => void> = new Set();
  private readonly mockVersion = 'Python 3.12.0 (mock)';

  async initialize(): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 100));
    this.ready = true;
  }

  isReady(): boolean {
    return this.ready;
  }

  async execute(code: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    const output: PythonOutput[] = [];

    const text = `[Mock execution]\n${code}\n`;
    output.push({ type: 'stdout', text });
    this.outputCallbacks.forEach((cb) => cb({ type: 'stdout', text }));

    const executionTimeMs = Date.now() - startTime;
    return { success: true, output, executionTimeMs };
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
  }

  getVersion(): string {
    return this.mockVersion;
  }
}
