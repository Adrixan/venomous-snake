import type { PythonInterpreter, StructureCheck } from '@venomous-snake/shared-types';

const CHECKER = String.raw`
import ast, json, warnings
warnings.simplefilter('ignore')
request = json.loads(__REQUEST__)
nodes = list(ast.walk(ast.parse(request['code'])))

def count_nodes(names):
    total = 0
    for name in [names] if isinstance(names, str) else names:
        if name in ('vararg', 'kwarg'):
            total += sum(1 for n in nodes if isinstance(n, ast.arguments) and getattr(n, name))
        else:
            total += sum(1 for n in nodes if type(n).__name__ == name)
    return total

def called_name(call):
    func = call.func
    return func.id if isinstance(func, ast.Name) else getattr(func, 'attr', None)

def imported(module):
    for n in nodes:
        if isinstance(n, ast.Import) and any(a.name.split('.')[0] == module for a in n.names):
            return 1
        if isinstance(n, ast.ImportFrom) and (n.module or '').split('.')[0] == module:
            return 1
    return 0

def measure(check):
    kind = check['type']
    if kind == 'node':
        return count_nodes(check['node'])
    if kind == 'call':
        return sum(1 for n in nodes if isinstance(n, ast.Call) and called_name(n) == check['name'])
    if kind == 'assign':
        return sum(1 for n in nodes if isinstance(n, ast.Name) and isinstance(n.ctx, ast.Store) and n.id == check['name'])
    return imported(check['module'])

print(json.dumps([measure(c) >= c.get('min', 1) for c in request['checks']]))
`;

/** Upper bound for parsing a learner program; it never runs the program itself. */
const CHECK_TIMEOUT_MS = 5_000;

/** True when code still contains a `___` blank from the scaffold, comments included. */
export function hasPlaceholder(code: string): boolean {
  return /(^|[^A-Za-z0-9_])_{3,}($|[^A-Za-z0-9_])/m.test(code);
}

function parseAnswer(stdout: string): unknown[] | null {
  try {
    const answer: unknown = JSON.parse(stdout);
    return Array.isArray(answer) ? answer : null;
  } catch {
    return null;
  }
}

/** Returns the checks the code does not satisfy. */
export async function findUnmetChecks(
  interpreter: PythonInterpreter,
  code: string,
  checks: StructureCheck[],
): Promise<StructureCheck[]> {
  const request = JSON.stringify(JSON.stringify({ code, checks }));
  const result = await interpreter.execute(
    CHECKER.replace('__REQUEST__', () => request),
    {
      inputs: [],
      interactive: false,
      echoPrompts: false,
      timeoutMs: CHECK_TIMEOUT_MS,
      silent: true,
    },
  );
  const stdout = result.output
    .filter((o) => o.type === 'stdout')
    .map((o) => o.text)
    .join('');
  const met = result.success ? parseAnswer(stdout) : null;
  // Fail closed: an unreadable answer must not pass as "all rules met".
  if (met === null || met.length !== checks.length) return checks;
  return checks.filter((_, index) => met[index] !== true);
}
