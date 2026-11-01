"""Runs every solution and scaffold under native CPython, as a cross-check of the Pyodide CI job.

Mirrors ChallengeRunner: setup overrides, appended code, input split on newlines, no prompt echo,
EOFError when input runs out, error tests compare the exception type. Needs dump.test.ts output.
"""
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

DUMP = Path(__file__).resolve().parents[2] / '.scratch' / 'review' / 'challenges.json'

HARNESS = '''
import sys, json, builtins
queue = json.loads(sys.argv[1])
def _input(prompt=''):
    if queue:
        return queue.pop(0)
    raise EOFError('EOF when reading a line')
builtins.input = _input
with open(sys.argv[2]) as handle:
    source = handle.read()
exec(compile(source, '<user>', 'exec'), {'__name__': '__main__', '__builtins__': builtins})
'''


def apply_setup(setup, code):
    result = code
    for line in setup.split('\n'):
        m = re.match(r'^(\w+)\s*=', line)
        if m:
            pat = re.compile(r'^' + m.group(1) + r'\s*=.*$', re.M)
            if pat.search(result):
                result = pat.sub(lambda _: line, result, count=1)
            else:
                result = line + '\n' + result
    return result


def build_program(tc, code):
    result = apply_setup(tc['setup'], code) if tc.get('setup') else code
    return f"{result}\n{tc['append']}\n" if tc.get('append') else result


def error_type(stderr):
    lines = [line for line in (stderr or '').split('\n') if line.strip()]
    return lines[-1].split(':')[0] if lines else ''


def run(code, inp):
    inputs = [] if inp is None else inp.split('\n')
    with tempfile.TemporaryDirectory() as d:
        for name, content in (('h.py', HARNESS), ('u.py', code)):
            with open(os.path.join(d, name), 'w', encoding='utf-8') as handle:
                handle.write(content)
        try:
            p = subprocess.run([sys.executable, 'h.py', json.dumps(inputs), 'u.py'], cwd=d,
                               capture_output=True, text=True, timeout=10, check=False)
        except subprocess.TimeoutExpired:
            return None, 'TIMEOUT'
        return p.stdout, p.stderr


def passes(tc, code):
    out, err = run(build_program(tc, code), tc.get('input'))
    if tc.get('expectsError'):
        return error_type(err) == tc['expectsError'], out, err
    return out is not None and out.strip() == tc['expectedOutput'].strip(), out, err


if not DUMP.exists():
    sys.exit(f'{DUMP} is missing: run dump.test.ts first (see tools/review/README.md)')
with open(DUMP, encoding='utf-8') as dump_file:
    data = json.load(dump_file)

fails = []
scaff_pass = []
for c in data:
    for tc in c['testCases']:
        ok, out, err = passes(tc, c['solutionCode'])
        if not ok:
            fails.append((c['id'], tc['id'], 'expected %r got %r err=%r' % (
                tc['expectedOutput'].strip()[:100], (out or '')[:100].strip(), (err or '')[-120:])))
    if all(passes(tc, c['scaffoldedCode'])[0] for tc in c['testCases']):
        scaff_pass.append(c['id'])

print('CPython solution failures:', len(fails))
for f in fails:
    print('  ', f)
print('Scaffolded code that already passes all tests (no work required):', len(scaff_pass))
for s in scaff_pass:
    print('  ', s)
