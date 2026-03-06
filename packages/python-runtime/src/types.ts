export interface PythonOutput {
  type: 'stdout' | 'stderr';
  text: string;
}

export interface PythonError {
  type: string;
  message: string;
  line?: number;
  column?: number;
  traceback?: string;
}

export interface ExecutionResult {
  success: boolean;
  output: PythonOutput[];
  error?: PythonError;
  executionTimeMs: number;
}

export interface PythonInterpreter {
  initialize(): Promise<void>;
  isReady(): boolean;
  execute(code: string): Promise<ExecutionResult>;
  provideInput(value: string): void;
  onOutput(callback: (output: PythonOutput) => void): () => void;
  onInputRequest(callback: (prompt: string) => void): () => void;
  terminate(): Promise<void>;
  getVersion(): string;
}

export type InterpreterStatus = 'uninitialized' | 'loading' | 'ready' | 'executing' | 'error';
