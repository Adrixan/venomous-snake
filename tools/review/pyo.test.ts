import { it } from 'vitest';
import type { ExecutionResult } from '@venomous-snake/python-runtime';
import { createNodeInterpreter } from '../../packages/python-runtime/src/__tests__/nodePyodide';
import { writeReport } from './report';

const stdoutOf = (result: ExecutionResult): string =>
  result.output
    .filter((o) => o.type === 'stdout')
    .map((o) => o.text)
    .join('');

it('pyodide real', async () => {
  const py = await createNodeInterpreter();
  const out = [`init: ready ${py.getVersion()}`];

  const single = await py.execute(
    'codename = input("Enter your codename: ")\nprint(f"Welcome, Agent {codename}!")',
    { inputs: ['Viper'] },
  );
  out.push(`input challenge stdout: ${JSON.stringify(stdoutOf(single))}`);

  // ChallengeRunner splits a test case's input on newlines; this mirrors that.
  const started = Date.now();
  const multi = await py.execute(
    'pw = input("p: ")\nn = 0\nwhile pw != "viper":\n    n += 1\n    pw = input("p: ")\nprint("done", n)',
    { inputs: 'snake\nviper'.split('\n') },
  );
  const elapsed = Date.now() - started;
  out.push(`multi-line input stdout: ${JSON.stringify(stdoutOf(multi))} in ${elapsed} ms`);

  writeReport('pyo.txt', `${out.join('\n')}\n`);
});
