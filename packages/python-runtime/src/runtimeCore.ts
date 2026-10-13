import type { PythonError } from '@venomous-snake/shared-types';

/**
 * Environment-agnostic core shared by the browser worker and by Node-side tooling
 * and tests. It owns the Python harness that executes one program in an isolated
 * namespace with captured stdout/stderr and a scripted `input()`.
 */

/** Minimal slice of the Pyodide API the core relies on. */
export interface PyodideLike {
  runPython(code: string, options?: { globals?: unknown }): unknown;
  globals: { get(name: string): unknown };
}

export interface RunRequest {
  code: string;
  inputs: string[];
  echoPrompts: boolean;
  interactive: boolean;
}

export interface RunOutcome {
  stdout: string;
  stderr: string;
  /** Set when an interactive run paused because `input()` had no queued value. */
  needsInput?: string;
}

const HARNESS = `
import sys, io, builtins, traceback

class _VSNeedInput(BaseException):
    def __init__(self, prompt):
        super().__init__(prompt)
        self.prompt = prompt

def _vs_run(code, inputs, echo_prompts, interactive):
    out = io.StringIO()
    err = io.StringIO()
    queue = list(inputs)
    pos = [0]

    def _input(prompt=''):
        prompt = str(prompt)
        if echo_prompts:
            out.write(prompt)
        if pos[0] < len(queue):
            value = queue[pos[0]]
            pos[0] += 1
            if echo_prompts:
                out.write(value + '\\n')
            return value
        if interactive:
            raise _VSNeedInput(prompt)
        raise EOFError('EOF when reading a line')

    saved = (sys.stdout, sys.stderr, builtins.input)
    sys.stdout, sys.stderr, builtins.input = out, err, _input
    need = None
    try:
        namespace = {'__name__': '__main__', '__builtins__': builtins}
        exec(compile(code, '<user>', 'exec'), namespace)
    except _VSNeedInput as exc:
        need = exc.prompt
    except SystemExit:
        pass
    except BaseException:
        etype, value, tb = sys.exc_info()
        tb = tb.tb_next if tb is not None else None
        err.write(''.join(traceback.format_exception(etype, value, tb)))
    finally:
        sys.stdout, sys.stderr, builtins.input = saved
    return [out.getvalue(), err.getvalue(), need]
`;

export interface PythonRuntime {
  run(request: RunRequest): RunOutcome;
  version(): string;
}

/** Installs the harness into the given Pyodide instance and returns a runner. */
export function createRuntime(pyodide: PyodideLike): PythonRuntime {
  pyodide.runPython(HARNESS);
  const runner = pyodide.globals.get('_vs_run') as (
    ...args: unknown[]
  ) => { toJs(): unknown[]; destroy(): void } | unknown[];

  return {
    run(request: RunRequest): RunOutcome {
      const raw = runner(request.code, request.inputs, request.echoPrompts, request.interactive);
      const list = (
        typeof (raw as { toJs?: unknown }).toJs === 'function'
          ? (raw as { toJs(): unknown[] }).toJs()
          : raw
      ) as unknown[];
      if (typeof (raw as { destroy?: unknown }).destroy === 'function') {
        (raw as { destroy(): void }).destroy();
      }
      const need = list[2];
      return {
        stdout: String(list[0] ?? ''),
        stderr: String(list[1] ?? ''),
        ...(typeof need === 'string' ? { needsInput: need } : {}),
      };
    },
    version(): string {
      const v = pyodide.runPython('import sys; ".".join(map(str, sys.version_info[:3]))');
      return `Python ${String(v)} (Pyodide)`;
    },
  };
}

/** Extracts type, message and line number from a formatted Python traceback. */
export function parseTraceback(traceback: string): PythonError {
  const lines = traceback.split('\n').filter((l) => l.trim() !== '');
  const last = lines[lines.length - 1] ?? traceback;
  const match = /^([A-Za-z_][\w.]*)(?::\s*(.*))?$/.exec(last);
  const type = match?.[1] ?? 'Error';
  const message = match?.[2] ?? (match === null ? last : '');

  let line: number | undefined;
  for (const l of lines) {
    const m = /File "<user>", line (\d+)/.exec(l);
    if (m?.[1] !== undefined) line = parseInt(m[1], 10);
  }

  const result: PythonError = { type, message, traceback };
  if (line !== undefined) result.line = line;
  return result;
}
