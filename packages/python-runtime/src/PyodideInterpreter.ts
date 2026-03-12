import type { PythonInterpreter, PythonOutput, PythonError, ExecutionResult } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyodideInstance = any;

/**
 * Real CPython interpreter running via Pyodide (WASM).
 *
 * Features:
 * - Base64-encoded code injection (safe for any user code including triple-quotes)
 * - Pre-queued input() support for challenge test cases
 * - Isolated namespace per execution (no state leakage between runs)
 * - Execution queue prevents concurrent Python state corruption
 * - Configurable execution timeout
 */
export class PyodideInterpreter implements PythonInterpreter {
  private pyodide: PyodideInstance = null;
  private ready = false;
  private outputCallbacks: Set<(output: PythonOutput) => void> = new Set();
  private inputCallbacks: Set<(prompt: string) => void> = new Set();
  private inputQueue: string[] = [];
  private version = 'Python (loading...)';
  private readonly timeoutMs: number;
  private executionQueue: Promise<ExecutionResult> = Promise.resolve({
    success: true,
    output: [],
    executionTimeMs: 0,
  });

  constructor(timeoutMs = 15_000) {
    this.timeoutMs = timeoutMs;
  }

  async initialize(): Promise<void> {
    if (this.ready) return;
    const { loadPyodide } = await import('pyodide');
    this.pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/',
    });
    this.version = `Python ${this.pyodide.runPython('import sys; ".".join(map(str, sys.version_info[:3]))') as string} (Pyodide)`;
    this.ready = true;
  }

  isReady(): boolean {
    return this.ready;
  }

  async execute(code: string): Promise<ExecutionResult> {
    // Queue execution to prevent concurrent state corruption
    const result = this.executionQueue.then(() => this.executeInternal(code));
    this.executionQueue = result.catch(() => ({
      success: false,
      output: [],
      executionTimeMs: 0,
    }));
    return result;
  }

  private async executeInternal(code: string): Promise<ExecutionResult> {
    if (!this.pyodide || !this.ready) {
      throw new Error('Interpreter not initialized');
    }

    const startTime = Date.now();
    const output: PythonOutput[] = [];

    // Encode user code as base64 for safe injection (handles triple-quotes, backslashes, etc.)
    const b64Code = btoa(unescape(encodeURIComponent(code)));

    // Build input queue as a Python list literal
    const inputLiteral = JSON.stringify(this.inputQueue);
    this.inputQueue = [];

    const wrapperScript = `
import sys, builtins, base64, json
from io import StringIO

_input_queue = json.loads(${JSON.stringify(inputLiteral)})
_input_idx = [0]

def _custom_input(prompt=''):
    _stdout_cap.write(str(prompt))
    if _input_idx[0] < len(_input_queue):
        val = _input_queue[_input_idx[0]]
        _input_idx[0] += 1
        return val
    return ''

_old_input = builtins.input
builtins.input = _custom_input

_stdout_cap = StringIO()
_stderr_cap = StringIO()
_old_stdout, _old_stderr = sys.stdout, sys.stderr
sys.stdout = _stdout_cap
sys.stderr = _stderr_cap

try:
    _user_code = base64.b64decode("${b64Code}").decode('utf-8')
    _ns = {"__builtins__": __builtins__}
    exec(compile(_user_code, '<user>', 'exec'), _ns)
except Exception:
    import traceback
    _stderr_cap.write(traceback.format_exc())
finally:
    sys.stdout = _old_stdout
    sys.stderr = _old_stderr
    builtins.input = _old_input

[_stdout_cap.getvalue(), _stderr_cap.getvalue()]
`;

    let success = true;
    let error: PythonError | undefined;

    try {
      const timeoutPromise = new Promise<never>((_resolve, reject) =>
        setTimeout(() => reject(new Error('Execution timeout')), this.timeoutMs),
      );

      const execPromise = Promise.resolve().then(
        () => this.pyodide.runPython(wrapperScript) as unknown,
      );

      const pyResult = await Promise.race([execPromise, timeoutPromise]);

      // Pyodide returns a proxy; convert to JS
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = pyResult as any;
      const jsResult: string[] =
        typeof raw?.toJs === 'function' ? (raw.toJs() as string[]) : (raw as string[]);

      const stdout = jsResult[0] ?? '';
      const stderr = jsResult[1] ?? '';

      if (stdout) {
        const out: PythonOutput = { type: 'stdout', text: stdout };
        output.push(out);
        this.outputCallbacks.forEach((cb) => cb(out));
      }
      if (stderr) {
        const out: PythonOutput = { type: 'stderr', text: stderr };
        output.push(out);
        this.outputCallbacks.forEach((cb) => cb(out));
        success = false;
        error = this.parseError(stderr);
      }
    } catch (e) {
      success = false;
      const message = e instanceof Error ? e.message : String(e);
      error = { type: 'RuntimeError', message };
      const out: PythonOutput = { type: 'stderr', text: message };
      output.push(out);
      this.outputCallbacks.forEach((cb) => cb(out));
    }

    const executionTimeMs = Date.now() - startTime;
    const result: ExecutionResult = { success, output, executionTimeMs };
    if (error !== undefined) {
      result.error = error;
    }
    return result;
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
    this.pyodide = null;
    this.inputQueue = [];
  }

  getVersion(): string {
    return this.version;
  }

  private parseError(traceback: string): PythonError {
    const lines = traceback.split('\n');
    const errorLine = lines.filter((l) => l.trim()).pop() ?? traceback;

    const errorMatch = /^(\w+(?:\.\w+)*Error|\w+Exception|\w+Warning): (.+)$/.exec(errorLine);
    const type = errorMatch?.[1] ?? 'Error';
    const message = errorMatch?.[2] ?? errorLine;

    let line: number | undefined;
    for (const l of lines) {
      const lineMatch = /File "<user>", line (\d+)/.exec(l);
      if (lineMatch?.[1]) {
        line = parseInt(lineMatch[1], 10);
      }
    }

    const result: PythonError = { type, message, traceback };
    if (line !== undefined) {
      result.line = line;
    }
    return result;
  }
}
