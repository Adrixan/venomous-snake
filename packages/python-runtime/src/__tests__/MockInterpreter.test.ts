import { describe, it, expect } from 'vitest';
import { MockInterpreter } from '../MockInterpreter';

describe('MockInterpreter', () => {
  it('initialize sets the interpreter to ready', async () => {
    const interp = new MockInterpreter();
    expect(interp.isReady()).toBe(false);

    await interp.initialize();

    expect(interp.isReady()).toBe(true);
  });

  it('execute with a print statement produces stdout output', async () => {
    const interp = new MockInterpreter();
    await interp.initialize();

    const result = await interp.execute('print("hello world")');

    const stdout = result.output
      .filter((o) => o.type === 'stdout')
      .map((o) => o.text)
      .join('');
    expect(result.success).toBe(true);
    expect(stdout).toContain('hello world');
  });

  it('execute returns a queued PythonError (syntax error simulation)', async () => {
    const interp = new MockInterpreter();
    await interp.initialize();

    interp.queueResult({
      success: false,
      output: [],
      error: { type: 'SyntaxError', message: 'invalid syntax' },
      executionTimeMs: 5,
    });

    const result = await interp.execute('print("oops"');

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('SyntaxError');
    expect(result.error?.message).toBe('invalid syntax');
  });

  it('execute with multiple print statements returns each as a separate output entry', async () => {
    const interp = new MockInterpreter();
    await interp.initialize();

    const result = await interp.execute('print("first")\nprint("second")');

    const stdoutLines = result.output
      .filter((o) => o.type === 'stdout')
      .map((o) => o.text.trim());
    expect(stdoutLines).toContain('first');
    expect(stdoutLines).toContain('second');
    expect(result.output).toHaveLength(2);
  });

  it('provideInput does not throw', async () => {
    const interp = new MockInterpreter();
    await interp.initialize();

    expect(() => interp.provideInput('42')).not.toThrow();
  });

  it('onOutput callback receives emitted output', async () => {
    const interp = new MockInterpreter();
    await interp.initialize();

    const received: string[] = [];
    interp.onOutput((o) => received.push(o.text));

    await interp.execute('print("callback test")');

    expect(received.some((t) => t.includes('callback test'))).toBe(true);
  });

  it('terminate resets the ready state', async () => {
    const interp = new MockInterpreter();
    await interp.initialize();
    expect(interp.isReady()).toBe(true);

    await interp.terminate();

    expect(interp.isReady()).toBe(false);
  });

  it('getVersion returns a non-empty version string', () => {
    const interp = new MockInterpreter();
    expect(interp.getVersion().length).toBeGreaterThan(0);
  });

  it('queued results are consumed in order', async () => {
    const interp = new MockInterpreter();
    await interp.initialize();

    interp.queueResult({ success: true, output: [{ type: 'stdout', text: 'first\n' }], executionTimeMs: 1 });
    interp.queueResult({ success: false, output: [], error: { type: 'ValueError', message: 'bad' }, executionTimeMs: 1 });

    const r1 = await interp.execute('code');
    const r2 = await interp.execute('code');

    expect(r1.success).toBe(true);
    expect(r2.success).toBe(false);
    expect(r2.error?.type).toBe('ValueError');
  });
});
