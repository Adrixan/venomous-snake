import type { PythonInterpreter, PythonOutput, PythonError, ExecutionResult } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyodideInstance = any;

export class PyodideInterpreter implements PythonInterpreter {
  private pyodide: PyodideInstance = null;
  private ready = false;
  private outputCallbacks: Set<(output: PythonOutput) => void> = new Set();
  private inputCallbacks: Set<(prompt: string) => void> = new Set();
  private inputResolver: ((value: string) => void) | null = null;
  private version = 'Python (loading...)';
  private readonly timeoutMs: number;

  constructor(timeoutMs = 10000) {
    this.timeoutMs = timeoutMs;
  }

  async initialize(): Promise<void> {
    const { loadPyodide } = await import('pyodide');
    this.pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/',
    });
    this.version = this.pyodide.runPython('import sys; sys.version') as string;
    this.ready = true;
  }

  isReady(): boolean {
    return this.ready;
  }

  async execute(code: string): Promise<ExecutionResult> {
    if (!this.pyodide || !this.ready) {
      throw new Error('Interpreter not initialized');
    }

    const startTime = Date.now();
    const output: PythonOutput[] = [];

    // Escape the code for embedding in Python string
    const escapedCode = code.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"');

    const captureScript = `
import sys
from io import StringIO

_stdout_capture = StringIO()
_stderr_capture = StringIO()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture

try:
    exec("""${escapedCode}""")
except Exception as e:
    import traceback
    _stderr_capture.write(traceback.format_exc())

sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
[_stdout_capture.getvalue(), _stderr_capture.getvalue()]
`;

    let success = true;
    let error: PythonError | undefined;

    try {
      const timeoutPromise = new Promise<never>((_resolve, reject) =>
        setTimeout(() => reject(new Error('Execution timeout')), this.timeoutMs)
      );

      const execPromise = Promise.resolve().then(() => {
        return this.pyodide.runPython(captureScript);
      });

      const pyResult = await Promise.race([execPromise, timeoutPromise]);

      // Pyodide returns a proxy; convert to JS
      const jsResult: string[] =
        typeof pyResult.toJs === 'function'
          ? (pyResult.toJs() as string[])
          : (pyResult as string[]);

      const stdout = jsResult[0] ?? '';
      const stderr = jsResult[1] ?? '';

      if (stdout) {
        output.push({ type: 'stdout', text: stdout });
        this.outputCallbacks.forEach((cb) => cb({ type: 'stdout', text: stdout }));
      }
      if (stderr) {
        output.push({ type: 'stderr', text: stderr });
        this.outputCallbacks.forEach((cb) => cb({ type: 'stderr', text: stderr }));
        success = false;
        error = this.parseError(stderr);
      }
    } catch (e) {
      success = false;
      const message = e instanceof Error ? e.message : String(e);
      error = { type: 'RuntimeError', message };
      output.push({ type: 'stderr', text: message });
      this.outputCallbacks.forEach((cb) => cb({ type: 'stderr', text: message }));
    }

    const executionTimeMs = Date.now() - startTime;
    const result: ExecutionResult = { success, output, executionTimeMs };
    if (error !== undefined) {
      result.error = error;
    }
    return result;
  }

  provideInput(value: string): void {
    if (this.inputResolver) {
      this.inputResolver(value);
      this.inputResolver = null;
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

  async terminate(): Promise<void> {
    this.ready = false;
    this.pyodide = null;
  }

  getVersion(): string {
    return this.version;
  }

  private parseError(traceback: string): PythonError {
    const lines = traceback.split('\n');
    const errorLine = lines.filter((l) => l.trim()).pop() ?? traceback;

    // Parse "ErrorType: message"
    const errorMatch = /^(\w+(?:\.\w+)*Error|\w+Exception|\w+Warning): (.+)$/.exec(errorLine);
    const type = errorMatch?.[1] ?? 'Error';
    const message = errorMatch?.[2] ?? errorLine;

    // Extract line number from traceback: "  File ..., line N"
    let line: number | undefined;
    for (const l of lines) {
      const lineMatch = /line (\d+)/.exec(l);
      if (lineMatch?.[1]) {
        line = parseInt(lineMatch[1], 10);
      }
    }

    const error: PythonError = { type, message, traceback };
    if (line !== undefined) {
      error.line = line;
    }
    return error;
  }
}
