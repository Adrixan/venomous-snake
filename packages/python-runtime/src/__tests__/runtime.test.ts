import { describe, it, expect, beforeAll } from 'vitest';
import { createNodeInterpreter } from './nodePyodide';
import type { InProcessInterpreter } from '../InProcessInterpreter';
import { parseTraceback } from '../runtimeCore';

let py: InProcessInterpreter;

beforeAll(async () => {
  py = await createNodeInterpreter();
}, 120_000);

const stdout = (r: { output: { type: string; text: string }[] }): string =>
  r.output
    .filter((o) => o.type === 'stdout')
    .map((o) => o.text)
    .join('');

describe('PyodideRuntime', () => {
  it('captures stdout', async () => {
    const r = await py.execute('print("hi")\nprint(1 + 2)');
    expect(r.success).toBe(true);
    expect(stdout(r)).toBe('hi\n3\n');
  });

  it('isolates namespaces between runs', async () => {
    await py.execute('leaked = 1');
    const r = await py.execute('print("leaked" in globals())');
    expect(stdout(r)).toBe('False\n');
  });

  it('does not echo prompts by default and reads queued inputs', async () => {
    const r = await py.execute('name = input("Name: ")\nprint(f"Hi {name}")', { inputs: ['Ada'] });
    expect(stdout(r)).toBe('Hi Ada\n');
  });

  it('echoes prompt and answer when asked to', async () => {
    const r = await py.execute('print(input("Name: "))', { inputs: ['Ada'], echoPrompts: true });
    expect(stdout(r)).toBe('Name: Ada\nAda\n');
  });

  it('serves several queued lines in order', async () => {
    const code = 'a = input()\nb = input()\nprint(b, a)';
    const r = await py.execute(code, { inputs: ['one', 'two'] });
    expect(stdout(r)).toBe('two one\n');
  });

  it('raises EOFError when input runs out in a graded run', async () => {
    const r = await py.execute('input()');
    expect(r.success).toBe(false);
    expect(r.error?.type).toBe('EOFError');
  });

  it('reports errors with type, message and line', async () => {
    const r = await py.execute('x = 1\nprint(undefined_name)');
    expect(r.success).toBe(false);
    expect(r.error).toMatchObject({ type: 'NameError', line: 2 });
    expect(r.error?.traceback).not.toContain('_vs_run');
  });

  it('reports syntax errors', async () => {
    const r = await py.execute('print("a"');
    expect(r.success).toBe(false);
    expect(r.error?.type).toBe('SyntaxError');
  });

  it('treats sys.exit as a clean exit and keeps earlier output', async () => {
    const r = await py.execute('print("before")\nimport sys\nsys.exit(0)');
    expect(r.success).toBe(true);
    expect(stdout(r)).toBe('before\n');
  });

  it('keeps stdout produced before an error', async () => {
    const r = await py.execute('print("ok")\n1/0');
    expect(stdout(r)).toBe('ok\n');
    expect(r.error?.type).toBe('ZeroDivisionError');
  });

  it('pauses for input in interactive mode and resumes with the answer', async () => {
    const prompts: string[] = [];
    const unsubscribe = py.onInputRequest((prompt) => {
      prompts.push(prompt);
      queueMicrotask(() => py.provideInput(prompts.length === 1 ? 'Ada' : '36'));
    });
    const seen: string[] = [];
    const unsubOut = py.onOutput((o) => seen.push(o.text));
    const code = 'name = input("Name: ")\nage = int(input("Age: "))\nprint(name, age + 1)';
    const r = await py.execute(code, { interactive: true });
    unsubscribe();
    unsubOut();
    expect(prompts).toEqual(['Name: ', 'Age: ']);
    expect(r.success).toBe(true);
    expect(seen.join('')).toBe('Name: Ada\nAge: 36\nAda 37\n');
  });

  it('survives loops that finish quickly', async () => {
    const r = await py.execute('print(sum(range(100000)))');
    expect(stdout(r)).toBe('4999950000\n');
  });
});

describe('parseTraceback', () => {
  it('reads the last line and user line number', () => {
    const tb =
      'Traceback (most recent call last):\n  File "<user>", line 4, in <module>\nValueError: bad value';
    expect(parseTraceback(tb)).toMatchObject({ type: 'ValueError', message: 'bad value', line: 4 });
  });
});
