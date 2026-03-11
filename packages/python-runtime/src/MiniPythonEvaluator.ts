// Mini Python evaluator for challenge validation
// Supports: variables, arithmetic, strings, print(), type(), control flow,
// functions, lists, dicts, f-strings, classes, try/except, and more.

// ─── Value Types ────────────────────────────────────────────────────────────

interface IntVal { readonly kind: 'int'; value: number }
interface FloatVal { readonly kind: 'float'; value: number }
interface StrVal { readonly kind: 'str'; value: string }
interface BoolVal { readonly kind: 'bool'; value: boolean }
interface NoneVal { readonly kind: 'none' }
interface ListVal { readonly kind: 'list'; items: Val[] }
interface DictVal { readonly kind: 'dict'; entries: [Val, Val][] }
interface TupleVal { readonly kind: 'tuple'; items: Val[] }
interface SetVal { readonly kind: 'set'; items: Val[] }
interface FuncVal {
  readonly kind: 'func'
  name: string
  params: ParamDef[]
  body: Line[]
  closure: Env
  decoratorName?: string
}
interface ClassVal {
  readonly kind: 'class'
  name: string
  parentName?: string
  body: Line[]
  env: Env
  methods: Map<string, FuncVal>
  attrs: Map<string, Val>
}
interface ObjVal {
  readonly kind: 'obj'
  cls: ClassVal
  attrs: Map<string, Val>
}
interface TypeVal { readonly kind: 'type'; name: string }
interface ModuleVal { readonly kind: 'module'; name: string; attrs: Map<string, Val> }
interface GeneratorVal { readonly kind: 'generator'; items?: Val[]; index?: number; iter?: Iterator<Val> }

type Val = IntVal | FloatVal | StrVal | BoolVal | NoneVal | ListVal | DictVal |
  TupleVal | SetVal | FuncVal | ClassVal | ObjVal | TypeVal | ModuleVal | GeneratorVal;

interface ParamDef { name: string; defaultVal?: Val; isArgs?: boolean; isKwargs?: boolean }
interface Line { indent: number; text: string; lineNo: number }

// ─── Control Flow Signals ───────────────────────────────────────────────────

class ReturnSignal { constructor(public value: Val) {} }
class BreakSignal {}
class ContinueSignal {}
class YieldSignal { constructor(public value: Val) {} }
class PyError {
  constructor(public type: string, public message: string, public line?: number, public obj?: ObjVal) {}
}

// ─── Constructors ───────────────────────────────────────────────────────────

function mkInt(v: number): IntVal { return { kind: 'int', value: Math.trunc(v) }; }
function mkFloat(v: number): FloatVal { return { kind: 'float', value: v }; }
function mkStr(v: string): StrVal { return { kind: 'str', value: v }; }
function mkBool(v: boolean): BoolVal { return { kind: 'bool', value: v }; }
const NONE: NoneVal = { kind: 'none' };
function mkList(items: Val[]): ListVal { return { kind: 'list', items }; }
function mkDict(entries: [Val, Val][]): DictVal { return { kind: 'dict', entries }; }
function mkTuple(items: Val[]): TupleVal { return { kind: 'tuple', items }; }
function mkSet(items: Val[]): SetVal {
  const unique: Val[] = [];
  for (const item of items) {
    if (!unique.some(u => pyEqual(u, item))) unique.push(item);
  }
  return { kind: 'set', items: unique };
}

// ─── Environment ────────────────────────────────────────────────────────────

class Env {
  vars = new Map<string, Val>();
  constructor(public parent?: Env) {}

  get(name: string): Val | undefined {
    const v = this.vars.get(name);
    if (v !== undefined) return v;
    return this.parent?.get(name);
  }

  set(name: string, val: Val): void {
    this.vars.set(name, val);
  }

  has(name: string): boolean {
    if (this.vars.has(name)) return true;
    return this.parent?.has(name) ?? false;
  }

  update(name: string, val: Val): boolean {
    if (this.vars.has(name)) { this.vars.set(name, val); return true; }
    return this.parent?.update(name, val) ?? false;
  }
}

// ─── String Conversion ──────────────────────────────────────────────────────

function pyStr(v: Val, callMethod?: (obj: ObjVal, method: string) => Val): string {
  switch (v.kind) {
    case 'int': return String(v.value);
    case 'float': {
      const s = String(v.value);
      return s.includes('.') || s.includes('e') || s.includes('E') ? s : s + '.0';
    }
    case 'str': return v.value;
    case 'bool': return v.value ? 'True' : 'False';
    case 'none': return 'None';
    case 'list': return '[' + v.items.map(i => pyRepr(i, callMethod)).join(', ') + ']';
    case 'dict': return '{' + v.entries.map(([k, val]) => pyRepr(k, callMethod) + ': ' + pyRepr(val, callMethod)).join(', ') + '}';
    case 'tuple': return v.items.length === 1 ? '(' + pyRepr(v.items[0]!, callMethod) + ',)' : '(' + v.items.map(i => pyRepr(i, callMethod)).join(', ') + ')';
    case 'set': return '{' + v.items.map(i => pyRepr(i, callMethod)).join(', ') + '}';
    case 'func': return `<function ${v.name}>`;
    case 'class': return `<class '${v.name}'>`;
    case 'obj': {
      if (callMethod) {
        try {
          const result = callMethod(v, '__str__');
          if (result.kind === 'str') return result.value;
          if (result.kind !== 'none') return pyStr(result);
        } catch {
          // no __str__, try __repr__ as fallback
          try {
            const result = callMethod(v, '__repr__');
            if (result.kind === 'str') return result.value;
            if (result.kind !== 'none') return pyStr(result);
          } catch { /* no __repr__ either */ }
        }
      }
      return `<${v.cls.name} object>`;
    }
    case 'type': return `<class '${v.name}'>`;
    case 'module': return `<module '${v.name}'>`;
    case 'generator': return '<generator object>';
  }
}

function pyRepr(v: Val, callMethod?: (obj: ObjVal, method: string) => Val): string {
  if (v.kind === 'str') return "'" + v.value.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  if (v.kind === 'obj') {
    if (callMethod) {
      try {
        const result = callMethod(v, '__repr__');
        if (result.kind === 'str') return result.value;
        if (result.kind !== 'none') return pyStr(result, callMethod);
      } catch { /* no __repr__, fall through to __str__ */ }
    }
    return pyStr(v, callMethod);
  }
  return pyStr(v, callMethod);
}

function pyBool(v: Val): boolean {
  switch (v.kind) {
    case 'bool': return v.value;
    case 'none': return false;
    case 'int': return v.value !== 0;
    case 'float': return v.value !== 0;
    case 'str': return v.value.length > 0;
    case 'list': return v.items.length > 0;
    case 'dict': return v.entries.length > 0;
    case 'tuple': return v.items.length > 0;
    case 'set': return v.items.length > 0;
    default: return true;
  }
}

function pyTypeName(v: Val): string {
  switch (v.kind) {
    case 'int': return 'int';
    case 'float': return 'float';
    case 'str': return 'str';
    case 'bool': return 'bool';
    case 'none': return 'NoneType';
    case 'list': return 'list';
    case 'dict': return 'dict';
    case 'tuple': return 'tuple';
    case 'set': return 'set';
    case 'func': return 'function';
    case 'class': return 'type';
    case 'obj': return v.cls.name;
    case 'type': return 'type';
    case 'module': return 'module';
    case 'generator': return 'generator';
  }
}

function pyEqual(a: Val, b: Val): boolean {
  if (a.kind === 'int' && b.kind === 'float') return a.value === b.value;
  if (a.kind === 'float' && b.kind === 'int') return a.value === b.value;
  // bool is subclass of int in Python: True == 1, False == 0
  if (a.kind === 'bool' && (b.kind === 'int' || b.kind === 'float')) return (a.value ? 1 : 0) === b.value;
  if ((a.kind === 'int' || a.kind === 'float') && b.kind === 'bool') return a.value === (b.value ? 1 : 0);
  if (a.kind !== b.kind) return false;
  if (a.kind === 'int' || a.kind === 'float') return a.value === (b as IntVal | FloatVal).value;
  if (a.kind === 'str') return a.value === (b as StrVal).value;
  if (a.kind === 'bool') return a.value === (b as BoolVal).value;
  if (a.kind === 'none') return true;
  return a === b;
}

function pyLt(a: Val, b: Val): boolean {
  const an = (a.kind === 'int' || a.kind === 'float') ? a.value : a.kind === 'bool' ? (a.value ? 1 : 0) : NaN;
  const bn = (b.kind === 'int' || b.kind === 'float') ? b.value : b.kind === 'bool' ? (b.value ? 1 : 0) : NaN;
  if (!isNaN(an) && !isNaN(bn)) return an < bn;
  if (a.kind === 'str' && b.kind === 'str') return a.value < b.value;
  // Lexicographic comparison for tuples and lists
  if ((a.kind === 'tuple' || a.kind === 'list') && (b.kind === 'tuple' || b.kind === 'list')) {
    const len = Math.min(a.items.length, b.items.length);
    for (let i = 0; i < len; i++) {
      if (pyEqual(a.items[i]!, b.items[i]!)) continue;
      return pyLt(a.items[i]!, b.items[i]!);
    }
    return a.items.length < b.items.length;
  }
  throw new PyError('TypeError', `'<' not supported between '${pyTypeName(a)}' and '${pyTypeName(b)}'`);
}

function pyContains(container: Val, item: Val): boolean {
  if (container.kind === 'list' || container.kind === 'tuple') return container.items.some(i => pyEqual(i, item));
  if (container.kind === 'set') return container.items.some(i => pyEqual(i, item));
  if (container.kind === 'str' && item.kind === 'str') return container.value.includes(item.value);
  if (container.kind === 'dict') return container.entries.some(([k]) => pyEqual(k, item));
  return false;
}

function toNum(v: Val): number {
  if (v.kind === 'int' || v.kind === 'float') return v.value;
  if (v.kind === 'bool') return v.value ? 1 : 0;
  throw new PyError('TypeError', `unsupported operand type: '${pyTypeName(v)}'`);
}

// ─── Tokenizer ──────────────────────────────────────────────────────────────

type TokType = 'num' | 'str' | 'id' | 'op' | 'del' | 'fstr' | 'eof';
interface Tok { type: TokType; val: string; pos: number }

const KEYWORDS = new Set([
  'and', 'or', 'not', 'in', 'is', 'if', 'elif', 'else', 'for', 'while',
  'def', 'class', 'return', 'import', 'from', 'try', 'except', 'finally',
  'raise', 'break', 'continue', 'pass', 'lambda', 'True', 'False', 'None',
  'yield', 'assert', 'with', 'as', 'del', 'match', 'case', 'global',
]);

const OPS = ['**', '//', '!=', '==', '<=', '>=', '+=', '-=', '*=', '/=',
  '//=', '%=', '**=', '->', '<<', '>>', '|', '&', '^', '~',
  '+', '-', '*', '/', '%', '<', '>', '=', '!', '@'];

function tokenize(src: string): Tok[] {
  const tokens: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    // Skip whitespace (not newlines)
    if (src[i] === ' ' || src[i] === '\t') { i++; continue; }
    // Skip comments
    if (src[i] === '#') { while (i < src.length && src[i] !== '\n') i++; continue; }
    const pos = i;

    // f-strings
    if ((src[i] === 'f' || src[i] === 'F') && (src[i + 1] === '"' || src[i + 1] === "'")) {
      const q = src[i + 1]!;
      const triple = src[i + 2] === q && src[i + 3] === q;
      const end = triple ? q + q + q : q;
      i += triple ? 4 : 2;
      let s = '';
      while (i < src.length) {
        if (src.startsWith(end, i)) { i += end.length; break; }
        if (src[i] === '\\') { s += src[i]! + (src[i + 1] ?? ''); i += 2; continue; }
        s += src[i]; i++;
      }
      tokens.push({ type: 'fstr', val: s, pos });
      continue;
    }

    // r-strings
    if ((src[i] === 'r' || src[i] === 'R') && (src[i + 1] === '"' || src[i + 1] === "'")) {
      const q = src[i + 1]!;
      const triple = src[i + 2] === q && src[i + 3] === q;
      const end = triple ? q + q + q : q;
      i += triple ? 4 : 2;
      let s = '';
      while (i < src.length) {
        if (src.startsWith(end, i)) { i += end.length; break; }
        s += src[i]; i++;
      }
      tokens.push({ type: 'str', val: s, pos });
      continue;
    }

    // Strings
    if (src[i] === '"' || src[i] === "'") {
      const q = src[i]!;
      const triple = src[i + 1] === q && src[i + 2] === q;
      const end = triple ? q + q + q : q;
      i += triple ? 3 : 1;
      let s = '';
      while (i < src.length) {
        if (src.startsWith(end, i)) { i += end.length; break; }
        if (src[i] === '\\') {
          const next = src[i + 1];
          if (next === 'n') { s += '\n'; i += 2; }
          else if (next === 't') { s += '\t'; i += 2; }
          else if (next === '\\') { s += '\\'; i += 2; }
          else if (next === "'") { s += "'"; i += 2; }
          else if (next === '"') { s += '"'; i += 2; }
          else if (next === 'r') { s += '\r'; i += 2; }
          else if (next === '0') { s += '\0'; i += 2; }
          else if (next === 'u') {
            const hex = src.substring(i + 2, i + 6);
            s += String.fromCharCode(parseInt(hex, 16));
            i += 6;
          }
          else if (next === 'U') {
            const hex = src.substring(i + 2, i + 10);
            s += String.fromCodePoint(parseInt(hex, 16));
            i += 10;
          }
          else if (next === 'x') {
            const hex = src.substring(i + 2, i + 4);
            s += String.fromCharCode(parseInt(hex, 16));
            i += 4;
          }
          else { s += src[i]! + (next ?? ''); i += 2; }
          continue;
        }
        s += src[i]; i++;
      }
      tokens.push({ type: 'str', val: s, pos });
      continue;
    }

    // Numbers
    if (/[0-9]/.test(src[i]!)) {
      let num = '';
      while (i < src.length && /[0-9]/.test(src[i]!)) { num += src[i]; i++; }
      if (src[i] === '.' && /[0-9]/.test(src[i + 1] ?? '')) {
        num += '.'; i++;
        while (i < src.length && /[0-9]/.test(src[i]!)) { num += src[i]; i++; }
        if (src[i] === 'e' || src[i] === 'E') {
          num += src[i]!; i++;
          if (src[i] === '+' || src[i] === '-') { num += src[i]!; i++; }
          while (i < src.length && /[0-9]/.test(src[i]!)) { num += src[i]; i++; }
        }
        tokens.push({ type: 'num', val: num, pos });
      } else {
        tokens.push({ type: 'num', val: num, pos });
      }
      continue;
    }

    // Identifiers and keywords
    if (/[a-zA-Z_]/.test(src[i]!)) {
      let id = '';
      while (i < src.length && /[a-zA-Z0-9_]/.test(src[i]!)) { id += src[i]; i++; }
      tokens.push({ type: 'id', val: id, pos });
      continue;
    }

    // Operators (multi-char first)
    let matched = false;
    for (const op of OPS) {
      if (src.startsWith(op, i)) {
        tokens.push({ type: 'op', val: op, pos });
        i += op.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Delimiters
    if ('()[]{}:,.;'.includes(src[i]!)) {
      tokens.push({ type: 'del', val: src[i]!, pos });
      i++;
      continue;
    }

    // Unknown char — skip
    i++;
  }
  tokens.push({ type: 'eof', val: '', pos: i });
  return tokens;
}

// ─── Expression Parser/Evaluator ────────────────────────────────────────────

class ExprParser {
  private toks: Tok[] = [];
  private pos = 0;
  private executor: Executor;

  constructor(executor: Executor) { this.executor = executor; }

  eval(expr: string, env: Env): Val {
    // Save/restore parser state to support re-entrant calls
    // (e.g., user-defined function call inside print() arguments)
    const savedToks = this.toks;
    const savedPos = this.pos;
    this.toks = tokenize(expr);
    this.pos = 0;
    if (this.peek().type === 'eof') {
      this.toks = savedToks;
      this.pos = savedPos;
      return NONE;
    }
    try {
      const result = this.parseExpr(env);
      return result;
    } finally {
      this.toks = savedToks;
      this.pos = savedPos;
    }
  }

  evalTokens(toks: Tok[], env: Env): Val {
    this.toks = toks;
    this.pos = 0;
    if (this.peek().type === 'eof') return NONE;
    return this.parseExpr(env);
  }

  private peek(): Tok { return this.toks[this.pos] ?? { type: 'eof', val: '', pos: -1 }; }
  private advance(): Tok { const t = this.peek(); this.pos++; return t; }
  private expect(val: string): Tok {
    const t = this.advance();
    if (t.val !== val) throw new PyError('SyntaxError', `expected '${val}', got '${t.val}'`);
    return t;
  }
  private atEnd(): boolean { return this.peek().type === 'eof'; }
  private match(val: string): boolean {
    if (this.peek().val === val) { this.advance(); return true; }
    return false;
  }

  parseExpr(env: Env): Val {
    // Handle ternary: expr if cond else expr
    const val = this.parseTernary(env);
    return val;
  }

  private parseTernary(env: Env): Val {
    const val = this.parseOr(env);
    if (this.peek().val === 'if') {
      this.advance();
      const cond = this.parseOr(env);
      this.expect('else');
      const alt = this.parseTernary(env);
      return pyBool(cond) ? val : alt;
    }
    return val;
  }

  private parseOr(env: Env): Val {
    let left = this.parseAnd(env);
    while (this.peek().val === 'or') { this.advance(); const r = this.parseAnd(env); left = pyBool(left) ? left : r; }
    return left;
  }

  private parseAnd(env: Env): Val {
    let left = this.parseNot(env);
    while (this.peek().val === 'and') { this.advance(); const r = this.parseNot(env); left = pyBool(left) ? r : left; }
    return left;
  }

  private parseNot(env: Env): Val {
    if (this.peek().val === 'not') { this.advance(); return mkBool(!pyBool(this.parseNot(env))); }
    return this.parseComparison(env);
  }

  private parseComparison(env: Env): Val {
    let left = this.parseAdd(env);
    const ops = ['==', '!=', '<', '>', '<=', '>=', 'in', 'is'];
    while (ops.includes(this.peek().val) && this.peek().type !== 'str' && this.peek().type !== 'num' && this.peek().type !== 'fstr') {
      const op = this.advance().val;
      if (op === 'not') { this.expect('in'); const right = this.parseAdd(env); left = mkBool(!pyContains(right, left)); continue; }
      if (op === 'is') {
        if (this.peek().val === 'not') { this.advance(); const right = this.parseAdd(env); left = mkBool(!pyEqual(left, right)); continue; }
        const right = this.parseAdd(env); left = mkBool(left === right || pyEqual(left, right)); continue;
      }
      if (op === 'in') { const right = this.parseAdd(env); left = mkBool(pyContains(right, left)); continue; }
      const right = this.parseAdd(env);
      if (op === '==') left = mkBool(pyEqual(left, right));
      else if (op === '!=') left = mkBool(!pyEqual(left, right));
      else if (op === '<') left = mkBool(pyLt(left, right));
      else if (op === '>') left = mkBool(pyLt(right, left));
      else if (op === '<=') left = mkBool(pyEqual(left, right) || pyLt(left, right));
      else if (op === '>=') left = mkBool(pyEqual(left, right) || pyLt(right, left));
    }
    // Handle 'not in'
    if (this.peek().val === 'not') {
      const save = this.pos;
      this.advance();
      if (this.peek().val === 'in') {
        this.advance();
        const right = this.parseAdd(env);
        return mkBool(!pyContains(right, left));
      }
      this.pos = save;
    }
    return left;
  }

  private parseAdd(env: Env): Val {
    let left = this.parseMul(env);
    while ((this.peek().val === '+' || this.peek().val === '-') && this.peek().type === 'op') {
      const op = this.advance().val;
      const right = this.parseMul(env);
      left = this.applyBinOp(op, left, right);
    }
    return left;
  }

  private parseMul(env: Env): Val {
    let left = this.parsePow(env);
    while (['*', '/', '//', '%'].includes(this.peek().val) && this.peek().type === 'op') {
      const op = this.advance().val;
      const right = this.parsePow(env);
      left = this.applyBinOp(op, left, right);
    }
    return left;
  }

  private parsePow(env: Env): Val {
    const base = this.parseUnary(env);
    if (this.peek().val === '**' && this.peek().type === 'op') {
      this.advance();
      const exp = this.parsePow(env); // right-assoc
      return this.applyBinOp('**', base, exp);
    }
    return base;
  }

  private parseUnary(env: Env): Val {
    if (this.peek().val === '-' && this.peek().type === 'op') { this.advance(); const v = this.parseUnary(env); return this.applyUnaryMinus(v); }
    if (this.peek().val === '+' && this.peek().type === 'op') { this.advance(); return this.parseUnary(env); }
    return this.parsePostfix(env);
  }

  private applyUnaryMinus(v: Val): Val {
    if (v.kind === 'int') return mkInt(-v.value);
    if (v.kind === 'float') return mkFloat(-v.value);
    throw new PyError('TypeError', `bad operand type for unary -: '${pyTypeName(v)}'`);
  }

  private parsePostfix(env: Env): Val {
    let val = this.parsePrimary(env);
    while (true) {
      if (this.peek().val === '(') {
        this.advance();
        const args = this.parseCallArgs(env);
        val = this.executor.callValue(val, args.positional, args.keyword, env);
      } else if (this.peek().val === '[') {
        this.advance();
        val = this.parseSubscript(val, env);
      } else if (this.peek().val === '.') {
        this.advance();
        const attr = this.advance().val;
        val = this.getAttr(val, attr, env);
      } else break;
    }
    return val;
  }

  private parseCallArgs(env: Env): { positional: Val[]; keyword: Map<string, Val> } {
    const positional: Val[] = [];
    const keyword = new Map<string, Val>();
    if (this.peek().val !== ')') {
      // Check if the first argument is a generator expression
      if (this.isGeneratorExpr()) {
        positional.push(this.parseGeneratorExpr(env));
        this.expect(')');
        return { positional, keyword };
      }
      while (true) {
        // Check for *args or **kwargs unpacking
        if (this.peek().val === '*' && this.peek().type === 'op') {
          this.advance();
          const iterVal = this.parseExpr(env);
          if (iterVal.kind === 'list' || iterVal.kind === 'tuple') {
            positional.push(...iterVal.items);
          }
        } else if (this.peek().val === '**' && this.peek().type === 'op') {
          this.advance();
          const dictVal = this.parseExpr(env);
          if (dictVal.kind === 'dict') {
            for (const [k, v] of dictVal.entries) {
              if (k.kind === 'str') keyword.set(k.value, v);
            }
          }
        } else {
          // Check for keyword arg: name=value
          const save = this.pos;
          if (this.peek().type === 'id') {
            const name = this.advance().val;
            if (this.peek().val === '=' && !['==', '!=', '<=', '>='].includes(this.toks[this.pos]?.val ?? '')) {
              this.advance();
              keyword.set(name, this.parseExpr(env));
            } else {
              this.pos = save;
              positional.push(this.parseExpr(env));
            }
          } else {
            positional.push(this.parseExpr(env));
          }
        }
        if (!this.match(',')) break;
        if (this.peek().val === ')') break;
      }
    }
    this.expect(')');
    return { positional, keyword };
  }

  private parseSubscript(container: Val, env: Env): Val {
    // Handle slicing: [start:stop:step]
    if (this.peek().val === ':') {
      return this.parseSlice(container, NONE, env);
    }
    const idx = this.parseExpr(env);
    if (this.peek().val === ':') {
      return this.parseSlice(container, idx, env);
    }
    this.expect(']');
    return this.getIndex(container, idx);
  }

  private parseSlice(container: Val, start: Val, env: Env): Val {
    this.expect(':');
    let stop: Val = NONE;
    if (this.peek().val !== ']' && this.peek().val !== ':') stop = this.parseExpr(env);
    let step: Val = NONE;
    if (this.match(':')) {
      if (this.peek().val !== ']') step = this.parseExpr(env);
    }
    this.expect(']');
    return this.applySlice(container, start, stop, step);
  }

  private applySlice(container: Val, startV: Val, stopV: Val, stepV: Val): Val {
    const items = container.kind === 'str' ? container.value.split('') :
      (container.kind === 'list' || container.kind === 'tuple') ? container.items : [];
    const len = items.length;
    const step = stepV.kind === 'none' ? 1 : toNum(stepV);
    let start: number, stop: number;
    if (step > 0) {
      start = startV.kind === 'none' ? 0 : toNum(startV);
      stop = stopV.kind === 'none' ? len : toNum(stopV);
    } else {
      start = startV.kind === 'none' ? len - 1 : toNum(startV);
      stop = stopV.kind === 'none' ? -(len + 1) : toNum(stopV);
    }
    if (start < 0) start = Math.max(0, len + start);
    if (stop < 0) stop = Math.max(-1, len + stop);
    if (start >= len) start = step > 0 ? len : len - 1;
    if (stop > len) stop = len;

    const result: (string | Val)[] = [];
    if (step > 0) { for (let i = start; i < stop; i += step) { const item = items[i]; if (item !== undefined) result.push(item); } }
    else { for (let i = start; i > stop; i += step) { const item = items[i]; if (item !== undefined) result.push(item); } }

    if (container.kind === 'str') return mkStr((result as string[]).join(''));
    if (container.kind === 'tuple') return mkTuple(result as Val[]);
    return mkList(result as Val[]);
  }

  private getIndex(container: Val, idx: Val): Val {
    if (container.kind === 'str') {
      const i = this.resolveIndex(container.value.length, idx);
      const ch = container.value[i];
      if (ch === undefined) throw new PyError('IndexError', 'string index out of range');
      return mkStr(ch);
    }
    if (container.kind === 'list' || container.kind === 'tuple') {
      const i = this.resolveIndex(container.items.length, idx);
      const item = container.items[i];
      if (item === undefined) throw new PyError('IndexError', `${container.kind} index out of range`);
      return item;
    }
    if (container.kind === 'dict') {
      const entry = container.entries.find(([k]) => pyEqual(k, idx));
      if (!entry) throw new PyError('KeyError', pyRepr(idx));
      return entry[1]!;
    }
    throw new PyError('TypeError', `'${pyTypeName(container)}' object is not subscriptable`);
  }

  private resolveIndex(len: number, idx: Val): number {
    let i = toNum(idx);
    if (i < 0) i = len + i;
    return i;
  }

  getAttr(val: Val, attr: string, env: Env): Val {
    // String methods
    if (val.kind === 'str') return this.strMethod(val, attr);
    // List methods
    if (val.kind === 'list') return this.listMethod(val, attr);
    // Dict methods
    if (val.kind === 'dict') return this.dictMethod(val, attr);
    // Set methods
    if (val.kind === 'set') return this.setMethod(val, attr);
    // Object attributes
    if (val.kind === 'obj') {
      const a = val.attrs.get(attr);
      if (a !== undefined) return a;
      const m = val.cls.methods.get(attr);
      if (m) return this.bindMethod(m, val);
      // Walk parent chain
      let parentName = val.cls.parentName;
      while (parentName) {
        const parent = env.get(parentName) ?? this.executor.env.get(parentName);
        if (parent?.kind === 'class') {
          const pm = parent.methods.get(attr);
          if (pm) return this.bindMethod(pm, val);
          const pa = parent.attrs.get(attr);
          if (pa !== undefined) return pa;
          parentName = parent.parentName;
        } else break;
      }
      throw new PyError('AttributeError', `'${val.cls.name}' object has no attribute '${attr}'`);
    }
    // Class attributes
    if (val.kind === 'class') {
      const m = val.methods.get(attr);
      if (m) return m;
      const a = val.attrs.get(attr);
      if (a !== undefined) return a;
      throw new PyError('AttributeError', `type object '${val.name}' has no attribute '${attr}'`);
    }
    // Module attributes
    if (val.kind === 'module') {
      const a = val.attrs.get(attr);
      if (a !== undefined) return a;
      throw new PyError('AttributeError', `module '${val.name}' has no attribute '${attr}'`);
    }
    // Function attributes
    if (val.kind === 'func') {
      if (attr === '__name__') return mkStr(val.name);
      if (attr === '__doc__') return NONE;
    }
    throw new PyError('AttributeError', `'${pyTypeName(val)}' has no attribute '${attr}'`);
  }

  private bindMethod(func: FuncVal, obj: ObjVal): FuncVal {
    return { ...func, closure: (() => { const e = new Env(func.closure); e.set('__self__', obj); return e; })() };
  }

  private strMethod(s: StrVal, name: string): Val {
    const sv = s.value;
    const self = s;

    // Return a special callable
    const builtinFn = (args: Val[], _kw: Map<string, Val>): Val => {
      switch (name) {
        case 'upper': return mkStr(sv.toUpperCase());
        case 'lower': return mkStr(sv.toLowerCase());
        case 'title': return mkStr(sv.replace(/\b\w/g, c => c.toUpperCase()));
        case 'strip': return mkStr(sv.trim());
        case 'lstrip': return mkStr(sv.replace(/^\s+/, ''));
        case 'rstrip': return mkStr(sv.replace(/\s+$/, ''));
        case 'split': {
          const sep = args[0]?.kind === 'str' ? args[0].value : undefined;
          const parts = sep !== undefined ? sv.split(sep) : sv.trim().split(/\s+/);
          return mkList(parts.map(mkStr));
        }
        case 'join': {
          const items = args[0];
          if (items?.kind === 'list' || items?.kind === 'tuple')
            return mkStr(items.items.map(i => pyStr(i)).join(sv));
          return mkStr('');
        }
        case 'replace': {
          const old = args[0]?.kind === 'str' ? args[0].value : '';
          const nw = args[1]?.kind === 'str' ? args[1].value : '';
          const count = args[2]?.kind === 'int' ? args[2].value : -1;
          if (count < 0) return mkStr(sv.split(old).join(nw));
          let result = sv; let remaining = count;
          while (remaining > 0) {
            const idx = result.indexOf(old);
            if (idx === -1) break;
            result = result.substring(0, idx) + nw + result.substring(idx + old.length);
            remaining--;
          }
          return mkStr(result);
        }
        case 'count': {
          const sub = args[0]?.kind === 'str' ? args[0].value : '';
          if (!sub) return mkInt(0);
          let c = 0; let idx = 0;
          while ((idx = sv.indexOf(sub, idx)) !== -1) { c++; idx += sub.length; }
          return mkInt(c);
        }
        case 'find': {
          const sub = args[0]?.kind === 'str' ? args[0].value : '';
          return mkInt(sv.indexOf(sub));
        }
        case 'index': {
          const sub = args[0]?.kind === 'str' ? args[0].value : '';
          const idx = sv.indexOf(sub);
          if (idx === -1) throw new PyError('ValueError', 'substring not found');
          return mkInt(idx);
        }
        case 'startswith': return mkBool(sv.startsWith(args[0]?.kind === 'str' ? args[0].value : ''));
        case 'endswith': return mkBool(sv.endsWith(args[0]?.kind === 'str' ? args[0].value : ''));
        case 'format': {
          let result = sv;
          let argIdx = 0;
          result = result.replace(/\{(\d*)\}/g, (_m, idx) => {
            const i = idx !== '' ? parseInt(idx) : argIdx++;
            const arg = args[i];
            return arg !== undefined ? pyStr(arg) : '';
          });
          return mkStr(result);
        }
        case 'isdigit': return mkBool(/^\d+$/.test(sv));
        case 'isalpha': return mkBool(/^[a-zA-Z]+$/.test(sv));
        case 'isalnum': return mkBool(/^[a-zA-Z0-9]+$/.test(sv));
        case 'isupper': return mkBool(sv === sv.toUpperCase() && /[a-zA-Z]/.test(sv));
        case 'islower': return mkBool(sv === sv.toLowerCase() && /[a-zA-Z]/.test(sv));
        case 'capitalize': return mkStr(sv.charAt(0).toUpperCase() + sv.slice(1).toLowerCase());
        case 'center': {
          const width = args[0]?.kind === 'int' ? args[0].value : 0;
          const fill = args[1]?.kind === 'str' ? args[1].value : ' ';
          if (sv.length >= width) return self;
          const total = width - sv.length;
          const left = Math.floor(total / 2);
          return mkStr(fill.repeat(left) + sv + fill.repeat(total - left));
        }
        case 'zfill': {
          const width = args[0]?.kind === 'int' ? args[0].value : 0;
          return mkStr(sv.padStart(width, '0'));
        }
        case 'encode': return mkStr(sv); // simplified
        default: throw new PyError('AttributeError', `'str' object has no attribute '${name}'`);
      }
    };
    // Return a native function wrapper
    return { kind: 'func', name, params: [], body: [], closure: new Env(), _native: builtinFn } as FuncVal & { _native: Function };
  }

  private listMethod(list: ListVal, name: string): Val {
    const builtinFn = (args: Val[]): Val => {
      switch (name) {
        case 'append': list.items.push(args[0] ?? NONE); return NONE;
        case 'pop': {
          const idx = args[0]?.kind === 'int' ? args[0].value : list.items.length - 1;
          const item = list.items.splice(idx, 1)[0];
          return item ?? NONE;
        }
        case 'insert': {
          const idx = args[0]?.kind === 'int' ? args[0].value : 0;
          list.items.splice(idx, 0, args[1] ?? NONE);
          return NONE;
        }
        case 'remove': {
          const idx = list.items.findIndex(i => pyEqual(i, args[0] ?? NONE));
          if (idx === -1) throw new PyError('ValueError', 'list.remove(x): x not in list');
          list.items.splice(idx, 1);
          return NONE;
        }
        case 'extend': {
          const other = args[0];
          if (other?.kind === 'list' || other?.kind === 'tuple') list.items.push(...other.items);
          return NONE;
        }
        case 'sort': {
          list.items.sort((a, b) => {
            if (pyEqual(a, b)) return 0;
            try { return pyLt(a, b) ? -1 : 1; } catch { return 0; }
          });
          return NONE;
        }
        case 'reverse': { list.items.reverse(); return NONE; }
        case 'index': {
          const idx = list.items.findIndex(i => pyEqual(i, args[0] ?? NONE));
          if (idx === -1) throw new PyError('ValueError', 'not in list');
          return mkInt(idx);
        }
        case 'count': return mkInt(list.items.filter(i => pyEqual(i, args[0] ?? NONE)).length);
        case 'copy': return mkList([...list.items]);
        case 'clear': { list.items.length = 0; return NONE; }
        default: throw new PyError('AttributeError', `'list' object has no attribute '${name}'`);
      }
    };
    return { kind: 'func', name, params: [], body: [], closure: new Env(), _native: builtinFn } as FuncVal & { _native: Function };
  }

  private dictMethod(dict: DictVal, name: string): Val {
    const builtinFn = (args: Val[]): Val => {
      switch (name) {
        case 'keys': return mkList(dict.entries.map(([k]) => k));
        case 'values': return mkList(dict.entries.map(([, v]) => v));
        case 'items': return mkList(dict.entries.map(([k, v]) => mkTuple([k, v])));
        case 'get': {
          const key = args[0] ?? NONE;
          const def = args[1] ?? NONE;
          const entry = dict.entries.find(([k]) => pyEqual(k, key));
          return entry ? entry[1]! : def;
        }
        case 'update': {
          const other = args[0];
          if (other?.kind === 'dict') {
            for (const [k, v] of other.entries) {
              const existing = dict.entries.findIndex(([ek]) => pyEqual(ek, k));
              if (existing >= 0) dict.entries[existing] = [k, v];
              else dict.entries.push([k, v]);
            }
          }
          return NONE;
        }
        case 'pop': {
          const key = args[0] ?? NONE;
          const idx = dict.entries.findIndex(([k]) => pyEqual(k, key));
          if (idx >= 0) { const entry = dict.entries.splice(idx, 1)[0]; return entry ? entry[1]! : NONE; }
          if (args[1] !== undefined) return args[1];
          throw new PyError('KeyError', pyRepr(key));
        }
        case 'setdefault': {
          const key = args[0] ?? NONE;
          const def = args[1] ?? NONE;
          const entry = dict.entries.find(([k]) => pyEqual(k, key));
          if (entry) return entry[1]!;
          dict.entries.push([key, def]);
          return def;
        }
        case 'copy': return mkDict([...dict.entries.map(([k, v]) => [k, v] as [Val, Val])]);
        case 'clear': { dict.entries.length = 0; return NONE; }
        default: throw new PyError('AttributeError', `'dict' object has no attribute '${name}'`);
      }
    };
    return { kind: 'func', name, params: [], body: [], closure: new Env(), _native: builtinFn } as FuncVal & { _native: Function };
  }

  private setMethod(s: SetVal, name: string): Val {
    const builtinFn = (args: Val[]): Val => {
      switch (name) {
        case 'add': { if (!s.items.some(i => pyEqual(i, args[0] ?? NONE))) s.items.push(args[0] ?? NONE); return NONE; }
        case 'remove': {
          const idx = s.items.findIndex(i => pyEqual(i, args[0] ?? NONE));
          if (idx === -1) throw new PyError('KeyError', pyRepr(args[0] ?? NONE));
          s.items.splice(idx, 1); return NONE;
        }
        case 'discard': {
          const idx = s.items.findIndex(i => pyEqual(i, args[0] ?? NONE));
          if (idx >= 0) s.items.splice(idx, 1); return NONE;
        }
        case 'union': {
          const other = args[0];
          const result = [...s.items];
          if (other?.kind === 'set' || other?.kind === 'list') {
            for (const item of other.items) if (!result.some(i => pyEqual(i, item))) result.push(item);
          }
          return mkSet(result);
        }
        case 'intersection': {
          const other = args[0];
          if (other?.kind === 'set' || other?.kind === 'list') return mkSet(s.items.filter(i => other.items.some(j => pyEqual(i, j))));
          return mkSet([]);
        }
        case 'difference': {
          const other = args[0];
          if (other?.kind === 'set' || other?.kind === 'list') return mkSet(s.items.filter(i => !other.items.some(j => pyEqual(i, j))));
          return mkSet([...s.items]);
        }
        default: throw new PyError('AttributeError', `'set' object has no attribute '${name}'`);
      }
    };
    return { kind: 'func', name, params: [], body: [], closure: new Env(), _native: builtinFn } as FuncVal & { _native: Function };
  }

  applyBinOp(op: string, l: Val, r: Val): Val {
    // String ops
    if (op === '+' && l.kind === 'str' && r.kind === 'str') return mkStr(l.value + r.value);
    if (op === '*' && l.kind === 'str' && r.kind === 'int') return mkStr(l.value.repeat(Math.max(0, r.value)));
    if (op === '*' && l.kind === 'int' && r.kind === 'str') return mkStr(r.value.repeat(Math.max(0, l.value)));
    // List ops
    if (op === '+' && l.kind === 'list' && r.kind === 'list') return mkList([...l.items, ...r.items]);
    if (op === '*' && l.kind === 'list' && r.kind === 'int') { const res: Val[] = []; for (let i = 0; i < r.value; i++) res.push(...l.items); return mkList(res); }
    // Tuple ops
    if (op === '+' && l.kind === 'tuple' && r.kind === 'tuple') return mkTuple([...l.items, ...r.items]);

    // Numeric ops
    const ln = toNum(l);
    const rn = toNum(r);
    const isFloat = l.kind === 'float' || r.kind === 'float';

    switch (op) {
      case '+': return isFloat ? mkFloat(ln + rn) : mkInt(ln + rn);
      case '-': return isFloat ? mkFloat(ln - rn) : mkInt(ln - rn);
      case '*': return isFloat ? mkFloat(ln * rn) : mkInt(ln * rn);
      case '/': {
        if (rn === 0) throw new PyError('ZeroDivisionError', 'division by zero');
        return mkFloat(ln / rn);
      }
      case '//': {
        if (rn === 0) throw new PyError('ZeroDivisionError', 'integer division or modulo by zero');
        const result = Math.floor(ln / rn);
        return isFloat ? mkFloat(result) : mkInt(result);
      }
      case '%': {
        if (rn === 0) throw new PyError('ZeroDivisionError', 'integer division or modulo by zero');
        const result = ((ln % rn) + rn) % rn; // Python-style modulo
        return isFloat ? mkFloat(result) : mkInt(result);
      }
      case '**': {
        const result = Math.pow(ln, rn);
        return isFloat ? mkFloat(result) : mkInt(result);
      }
      default: throw new PyError('TypeError', `unsupported operator: ${op}`);
    }
  }

  parsePrimary(env: Env): Val {
    const tok = this.peek();

    // Numeric literal
    if (tok.type === 'num') {
      this.advance();
      return tok.val.includes('.') ? mkFloat(parseFloat(tok.val)) : mkInt(parseInt(tok.val, 10));
    }

    // String literal
    if (tok.type === 'str') {
      this.advance();
      return mkStr(tok.val);
    }

    // f-string
    if (tok.type === 'fstr') {
      this.advance();
      return this.evalFString(tok.val, env);
    }

    // Parenthesized expression, tuple, or generator
    if (tok.val === '(') {
      this.advance();
      if (this.peek().val === ')') { this.advance(); return mkTuple([]); }
      // Check for generator expression: (expr for x in ...)
      const savePos = this.pos;
      if (this.isGeneratorExpr()) {
        this.pos = savePos;
        const result = this.parseGeneratorExpr(env);
        this.expect(')');
        return result;
      }
      this.pos = savePos;
      const first = this.parseExpr(env);
      if (this.peek().val === ',') {
        const items = [first];
        while (this.match(',')) {
          if (this.peek().val === ')') break;
          items.push(this.parseExpr(env));
        }
        this.expect(')');
        return mkTuple(items);
      }
      this.expect(')');
      return first;
    }

    // List literal or list comprehension
    if (tok.val === '[') {
      this.advance();
      if (this.peek().val === ']') { this.advance(); return mkList([]); }
      // Save position to detect comprehension before evaluating
      const savePos = this.pos;
      // Try to detect comprehension: scan for a 'for' keyword at bracket depth 0
      if (this.isComprehension()) {
        this.pos = savePos;
        return this.parseListCompFull(env);
      }
      this.pos = savePos;
      const first = this.parseExpr(env);
      const items = [first];
      while (this.match(',')) {
        if (this.peek().val === ']') break;
        items.push(this.parseExpr(env));
      }
      this.expect(']');
      return mkList(items);
    }

    // Dict/set literal or comprehension
    if (tok.val === '{') {
      this.advance();
      if (this.peek().val === '}') { this.advance(); return mkDict([]); }
      // Check for dict/set comprehension via lookahead
      const savePos = this.pos;
      if (this.isDictOrSetComprehension()) {
        this.pos = savePos;
        return this.parseDictCompFull(env);
      }
      this.pos = savePos;
      const first = this.parseExpr(env);
      if (this.peek().val === ':') {
        this.advance();
        const val = this.parseExpr(env);
        if (this.peek().val === 'for') { return this.parseDictComp(first, val, env); }
        const entries: [Val, Val][] = [[first, val]];
        while (this.match(',')) {
          if (this.peek().val === '}') break;
          const k = this.parseExpr(env);
          this.expect(':');
          const v = this.parseExpr(env);
          entries.push([k, v]);
        }
        this.expect('}');
        return mkDict(entries);
      }
      // Set literal or set comprehension
      if (this.peek().val === 'for') {
        // Set comprehension — but first was already evaluated, so fallback
        // In practice, set comprehensions will be handled by isDictOrSetComprehension above
      }
      const items = [first];
      while (this.match(',')) {
        if (this.peek().val === '}') break;
        items.push(this.parseExpr(env));
      }
      this.expect('}');
      return mkSet(items);
    }

    // Keywords
    if (tok.val === 'True') { this.advance(); return mkBool(true); }
    if (tok.val === 'False') { this.advance(); return mkBool(false); }
    if (tok.val === 'None') { this.advance(); return NONE; }

    // Lambda
    if (tok.val === 'lambda') {
      this.advance();
      const params = this.parseLambdaParams(env);
      this.expect(':');
      // Capture body tokens without evaluating (lambda body may reference params not yet bound)
      const bodyStart = this.pos;
      let depth = 0;
      while (!this.atEnd()) {
        const t = this.peek();
        if (t.val === '(' || t.val === '[' || t.val === '{') depth++;
        else if (t.val === ')' || t.val === ']' || t.val === '}') {
          if (depth === 0) break;
          depth--;
        } else if (t.val === ',' && depth === 0) break;
        this.advance();
      }
      const bodyToks = [...this.toks.slice(bodyStart, this.pos), { type: 'eof' as const, val: '', pos: -1 }];
      const closureEnv = env;
      return {
        kind: 'func',
        name: '<lambda>',
        params,
        body: [],
        closure: closureEnv,
        _lambdaToks: bodyToks,
      } as FuncVal & { _lambdaToks: Tok[] };
    }

    // Identifier
    if (tok.type === 'id' && !KEYWORDS.has(tok.val)) {
      this.advance();
      const val = env.get(tok.val);
      if (val === undefined) throw new PyError('NameError', `name '${tok.val}' is not defined`);
      return val;
    }

    throw new PyError('SyntaxError', `unexpected token: '${tok.val}'`);
  }

  private parseLambdaParams(_env: Env): ParamDef[] {
    const params: ParamDef[] = [];
    while (this.peek().val !== ':' && !this.atEnd()) {
      if (this.peek().val === '*') {
        this.advance();
        if (this.peek().type === 'id') {
          params.push({ name: this.advance().val, isArgs: true });
        }
      } else if (this.peek().val === '**') {
        this.advance();
        params.push({ name: this.advance().val, isKwargs: true });
      } else if (this.peek().type === 'id') {
        params.push({ name: this.advance().val });
      }
      this.match(',');
    }
    return params;
  }

  private isComprehension(): boolean {
    // Scan forward to see if there's a 'for' keyword at depth 0 before hitting ']'
    let depth = 0;
    const save = this.pos;
    while (!this.atEnd()) {
      const t = this.peek();
      if (t.val === '(' || t.val === '[' || t.val === '{') depth++;
      else if (t.val === ')' || t.val === '}') depth--;
      else if (t.val === ']') {
        if (depth === 0) { this.pos = save; return false; }
        depth--;
      } else if (t.val === 'for' && depth === 0) { this.pos = save; return true; }
      this.advance();
    }
    this.pos = save;
    return false;
  }

  private isGeneratorExpr(): boolean {
    // Scan forward from current pos to see if there's a 'for' before ')' at depth 0
    let depth = 0;
    const save = this.pos;
    while (!this.atEnd()) {
      const t = this.peek();
      if (t.val === '(' || t.val === '[' || t.val === '{') depth++;
      else if (t.val === ']' || t.val === '}') depth--;
      else if (t.val === ')') {
        if (depth === 0) { this.pos = save; return false; }
        depth--;
      } else if (t.val === 'for' && depth === 0) { this.pos = save; return true; }
      this.advance();
    }
    this.pos = save;
    return false;
  }

  private parseGeneratorExpr(env: Env): Val {
    // Capture expression tokens until 'for' at depth 0
    const exprStart = this.pos;
    let depth = 0;
    while (!this.atEnd()) {
      const t = this.peek();
      if (t.val === '(' || t.val === '[' || t.val === '{') depth++;
      else if (t.val === ')' || t.val === ']' || t.val === '}') depth--;
      else if (t.val === 'for' && depth === 0) break;
      this.advance();
    }
    const exprToks = [...this.toks.slice(exprStart, this.pos), { type: 'eof' as const, val: '', pos: -1 }];

    this.expect('for');
    const varNames = this.parseTargetNames();
    this.expect('in');
    const iter = this.parseOr(env);

    let condToks: Tok[] | undefined;
    if (this.peek().val === 'if') {
      this.advance();
      const condStart = this.pos;
      let cd = 0;
      while (!this.atEnd()) {
        const t = this.peek();
        if (t.val === '(' || t.val === '[' || t.val === '{') cd++;
        else if (t.val === ']' || t.val === '}') cd--;
        else if (t.val === ')' && cd === 0) break;
        this.advance();
      }
      condToks = [...this.toks.slice(condStart, this.pos), { type: 'eof' as const, val: '', pos: -1 }];
    }

    // Build a list (generator consumed immediately since we return a list)
    const items: Val[] = [];
    const iterItems = this.getIterable(iter);
    for (const item of iterItems) {
      const loopEnv = new Env(env);
      this.assignTarget(varNames, item, loopEnv);
      if (condToks) {
        const p = new ExprParser(this.executor);
        if (!pyBool(p.evalTokens(condToks, loopEnv))) continue;
      }
      const p = new ExprParser(this.executor);
      items.push(p.evalTokens(exprToks, loopEnv));
    }
    return mkList(items);
  }

  private parseListCompFull(env: Env): Val {
    // Capture expression tokens until 'for' at depth 0
    const exprStart = this.pos;
    let depth = 0;
    while (!this.atEnd()) {
      const t = this.peek();
      if (t.val === '(' || t.val === '[' || t.val === '{') depth++;
      else if (t.val === ')' || t.val === ']' || t.val === '}') depth--;
      else if (t.val === 'for' && depth === 0) break;
      this.advance();
    }
    const exprToks = [...this.toks.slice(exprStart, this.pos), { type: 'eof' as const, val: '', pos: -1 }];

    // Parse clauses: for VAR in ITER [if COND] [for VAR2 in ITER2 [if COND2]] ...
    const clauses: ({ kind: 'for'; varNames: string[]; iterExpr: (env: Env) => Val; iterToks: Tok[] } | { kind: 'if'; condToks: Tok[] })[] = [];

    while (this.peek().val === 'for' || this.peek().val === 'if') {
      if (this.peek().val === 'for') {
        this.advance(); // consume 'for'
        const varNames = this.parseTargetNames();
        this.expect('in');
        // Capture iter tokens until 'if', 'for', or ']' at depth 0
        const iterStart = this.pos;
        let id = 0;
        while (!this.atEnd()) {
          const t = this.peek();
          if (t.val === '(' || t.val === '[' || t.val === '{') id++;
          else if (t.val === ')' || t.val === '}') id--;
          else if (t.val === ']') {
            if (id === 0) break;
            id--;
          }
          else if ((t.val === 'for' || t.val === 'if') && id === 0) break;
          this.advance();
        }
        const iterToks = [...this.toks.slice(iterStart, this.pos), { type: 'eof' as const, val: '', pos: -1 }];
        clauses.push({
          kind: 'for', varNames, iterToks,
          iterExpr: (e: Env) => { const p = new ExprParser(this.executor); return p.evalTokens(iterToks, e); },
        });
      } else {
        this.advance(); // consume 'if'
        const condStart = this.pos;
        let cd = 0;
        while (!this.atEnd()) {
          const t = this.peek();
          if (t.val === '(' || t.val === '[' || t.val === '{') cd++;
          else if (t.val === ')' || t.val === '}') cd--;
          else if (t.val === ']') {
            if (cd === 0) break;
            cd--;
          }
          else if ((t.val === 'for' || t.val === 'if') && cd === 0) break;
          this.advance();
        }
        const condToks = [...this.toks.slice(condStart, this.pos), { type: 'eof' as const, val: '', pos: -1 }];
        clauses.push({ kind: 'if', condToks });
      }
    }
    this.expect(']');

    // Execute comprehension recursively
    const items: Val[] = [];
    const execClauses = (idx: number, currentEnv: Env): void => {
      if (idx >= clauses.length) {
        const p = new ExprParser(this.executor);
        items.push(p.evalTokens(exprToks, currentEnv));
        return;
      }
      const clause = clauses[idx]!;
      if (clause.kind === 'for') {
        const iterVal = clause.iterExpr(currentEnv);
        const iterItems = this.getIterable(iterVal);
        for (const item of iterItems) {
          const loopEnv = new Env(currentEnv);
          this.assignTarget(clause.varNames, item, loopEnv);
          execClauses(idx + 1, loopEnv);
        }
      } else {
        const p = new ExprParser(this.executor);
        if (pyBool(p.evalTokens(clause.condToks, currentEnv))) {
          execClauses(idx + 1, currentEnv);
        }
      }
    };
    execClauses(0, env);
    return mkList(items);
  }

  private parseListComp(_expr: Val, env: Env): Val {
    // Legacy path — should no longer be called but kept for safety
    return this.parseListCompFull(env);
  }

  private isDictOrSetComprehension(): boolean {
    // Scan forward to see if there's a 'for' keyword at depth 0 before hitting '}'
    let depth = 0;
    const save = this.pos;
    while (!this.atEnd()) {
      const t = this.peek();
      if (t.val === '(' || t.val === '[' || t.val === '{') depth++;
      else if (t.val === ')' || t.val === ']') depth--;
      else if (t.val === '}') {
        if (depth === 0) { this.pos = save; return false; }
        depth--;
      } else if (t.val === 'for' && depth === 0) { this.pos = save; return true; }
      this.advance();
    }
    this.pos = save;
    return false;
  }

  private parseDictCompFull(env: Env): Val {
    // Capture key and value expression tokens until 'for' at depth 0
    // Pattern: {keyExpr: valExpr for var in iter [if cond]}
    // Or set comp: {expr for var in iter [if cond]}
    const exprStart = this.pos;
    let depth = 0;
    let colonPos = -1;
    while (!this.atEnd()) {
      const t = this.peek();
      if (t.val === '(' || t.val === '[' || t.val === '{') depth++;
      else if (t.val === ')' || t.val === ']' || t.val === '}') depth--;
      else if (t.val === ':' && depth === 0 && colonPos < 0) colonPos = this.pos;
      else if (t.val === 'for' && depth === 0) break;
      this.advance();
    }

    if (colonPos >= 0) {
      // Dict comprehension: key: val for var in iter
      const keyToks = [...this.toks.slice(exprStart, colonPos), { type: 'eof' as const, val: '', pos: -1 }];
      const valToks = [...this.toks.slice(colonPos + 1, this.pos), { type: 'eof' as const, val: '', pos: -1 }];

      this.expect('for');
      const varNames = this.parseTargetNames();
      this.expect('in');
      const iter = this.parseOr(env);

      let condToks: Tok[] | undefined;
      if (this.peek().val === 'if') {
        this.advance();
        const condStart = this.pos;
        let cd = 0;
        while (!this.atEnd()) {
          const t = this.peek();
          if (t.val === '(' || t.val === '[' || t.val === '{') cd++;
          else if (t.val === ')' || t.val === ']') cd--;
          else if (t.val === '}' && cd === 0) break;
          this.advance();
        }
        condToks = [...this.toks.slice(condStart, this.pos), { type: 'eof' as const, val: '', pos: -1 }];
      }
      this.expect('}');

      const entries: [Val, Val][] = [];
      const iterItems = this.getIterable(iter);
      for (const item of iterItems) {
        const loopEnv = new Env(env);
        this.assignTarget(varNames, item, loopEnv);
        if (condToks) {
          const p = new ExprParser(this.executor);
          if (!pyBool(p.evalTokens(condToks, loopEnv))) continue;
        }
        const kp = new ExprParser(this.executor);
        const vp = new ExprParser(this.executor);
        entries.push([kp.evalTokens(keyToks, loopEnv), vp.evalTokens(valToks, loopEnv)]);
      }
      return mkDict(entries);
    } else {
      // Set comprehension: expr for var in iter
      const exprToks = [...this.toks.slice(exprStart, this.pos), { type: 'eof' as const, val: '', pos: -1 }];

      this.expect('for');
      const varNames = this.parseTargetNames();
      this.expect('in');
      const iter = this.parseOr(env);

      let condToks: Tok[] | undefined;
      if (this.peek().val === 'if') {
        this.advance();
        const condStart = this.pos;
        let cd = 0;
        while (!this.atEnd()) {
          const t = this.peek();
          if (t.val === '(' || t.val === '[' || t.val === '{') cd++;
          else if (t.val === ')' || t.val === ']') cd--;
          else if (t.val === '}' && cd === 0) break;
          this.advance();
        }
        condToks = [...this.toks.slice(condStart, this.pos), { type: 'eof' as const, val: '', pos: -1 }];
      }
      this.expect('}');

      const items: Val[] = [];
      const iterItems = this.getIterable(iter);
      for (const item of iterItems) {
        const loopEnv = new Env(env);
        this.assignTarget(varNames, item, loopEnv);
        if (condToks) {
          const p = new ExprParser(this.executor);
          if (!pyBool(p.evalTokens(condToks, loopEnv))) continue;
        }
        const p = new ExprParser(this.executor);
        items.push(p.evalTokens(exprToks, loopEnv));
      }
      return mkSet(items);
    }
  }

  private parseDictComp(_keyExpr: Val, _valExpr: Val, env: Env): Val {
    this.expect('for');
    const varNames = this.parseTargetNames();
    this.expect('in');
    const iter = this.parseOr(env);
    this.expect('}');
    const entries: [Val, Val][] = [];
    const iterItems = this.getIterable(iter);
    for (const item of iterItems) {
      const loopEnv = new Env(env);
      this.assignTarget(varNames, item, loopEnv);
      entries.push([item, NONE]);
    }
    return mkDict(entries);
  }

  private parseTargetNames(): string[] {
    const names: string[] = [];
    names.push(this.advance().val);
    while (this.peek().val === ',') {
      this.advance();
      if (this.peek().type === 'id' && this.peek().val !== 'in') {
        names.push(this.advance().val);
      }
    }
    return names;
  }

  assignTarget(names: string[], val: Val, env: Env): void {
    if (names.length === 1) {
      env.set(names[0]!, val);
    } else {
      const items = (val.kind === 'tuple' || val.kind === 'list') ? val.items : [val];
      for (let i = 0; i < names.length; i++) {
        env.set(names[i]!, items[i] ?? NONE);
      }
    }
  }

  getIterable(v: Val): Val[] {
    if (v.kind === 'list' || v.kind === 'tuple' || v.kind === 'set') return v.items;
    if (v.kind === 'str') return v.value.split('').map(mkStr);
    if (v.kind === 'dict') return v.entries.map(([k]) => k);
    if (v.kind === 'generator') {
      if (v.items) return v.items;
      // Consume iterator
      const result: Val[] = [];
      if (v.iter) {
        let next = v.iter.next();
        while (!next.done) { result.push(next.value); next = v.iter.next(); }
      }
      return result;
    }
    return [];
  }

  private evalFString(template: string, env: Env): Val {
    let result = '';
    let i = 0;
    while (i < template.length) {
      if (template[i] === '{' && template[i + 1] === '{') { result += '{'; i += 2; continue; }
      if (template[i] === '}' && template[i + 1] === '}') { result += '}'; i += 2; continue; }
      if (template[i] === '{') {
        i++;
        let expr = '';
        let depth = 1;
        while (i < template.length && depth > 0) {
          if (template[i] === '{') depth++;
          else if (template[i] === '}') { depth--; if (depth === 0) break; }
          expr += template[i]; i++;
        }
        i++; // skip closing }
        // Handle format spec
        const colonIdx = this.findFormatColon(expr);
        let formatSpec = '';
        if (colonIdx >= 0) {
          formatSpec = expr.substring(colonIdx + 1);
          expr = expr.substring(0, colonIdx);
        }
        // Save/restore parser state so nested eval doesn't clobber outer token stream
        const savedToks = this.toks;
        const savedPos = this.pos;
        const val = this.eval(expr.trim(), env);
        this.toks = savedToks;
        this.pos = savedPos;
        result += formatSpec ? this.applyFormat(val, formatSpec) : pyStr(val, this.executor.makeCallMethod(env));
      } else if (template[i] === '\\') {
        // Process escape sequences in f-string literal parts
        const next = template[i + 1];
        if (next === 'n') { result += '\n'; i += 2; }
        else if (next === 't') { result += '\t'; i += 2; }
        else if (next === '\\') { result += '\\'; i += 2; }
        else if (next === "'") { result += "'"; i += 2; }
        else if (next === '"') { result += '"'; i += 2; }
        else if (next === 'r') { result += '\r'; i += 2; }
        else if (next === 'u') {
          const hex = template.substring(i + 2, i + 6);
          result += String.fromCharCode(parseInt(hex, 16));
          i += 6;
        } else if (next === 'U') {
          const hex = template.substring(i + 2, i + 10);
          result += String.fromCodePoint(parseInt(hex, 16));
          i += 10;
        } else if (next === 'x') {
          const hex = template.substring(i + 2, i + 4);
          result += String.fromCharCode(parseInt(hex, 16));
          i += 4;
        } else {
          result += template[i]; i++;
        }
      } else {
        result += template[i]; i++;
      }
    }
    return mkStr(result);
  }

  private findFormatColon(expr: string): number {
    let depth = 0;
    for (let i = 0; i < expr.length; i++) {
      if (expr[i] === '(' || expr[i] === '[' || expr[i] === '{') depth++;
      else if (expr[i] === ')' || expr[i] === ']' || expr[i] === '}') depth--;
      else if (expr[i] === ':' && depth === 0) return i;
    }
    return -1;
  }

  private applyFormat(val: Val, spec: string): string {
    const s = pyStr(val);
    // Format spec: [[fill]align][sign][#][0][width][grouping_option][.precision][type]
    const m = /^([^{}]?[<>^=]|[<>^=])?([+\- ])?([#])?(0)?(\d+)?([_,])?(?:\.(\d+))?([bcdeEfFgGnosxX%])?$/.exec(spec);
    if (!m) return s;
    const [, alignSpec, _sign, _hash, zeroFlag, widthStr, _group, precStr, ftype] = m;
    const width = widthStr ? parseInt(widthStr) : 0;

    let fill = ' ';
    let align = '';
    if (alignSpec) {
      if (alignSpec.length === 2) { fill = alignSpec[0]!; align = alignSpec[1]!; }
      else { align = alignSpec; }
    }
    if (zeroFlag && !align) { fill = '0'; align = '='; }

    let formatted = s;
    if (ftype === 'f' || ftype === 'F' || ftype === '%') {
      const n = (val.kind === 'int' || val.kind === 'float') ? val.value : parseFloat(s);
      const mult = ftype === '%' ? 100 : 1;
      const prec = precStr ? parseInt(precStr) : 6;
      formatted = (n * mult).toFixed(prec) + (ftype === '%' ? '%' : '');
    } else if (ftype === 'd') {
      const n = (val.kind === 'int' || val.kind === 'float') ? Math.trunc(val.value) : parseInt(s);
      formatted = String(n);
    } else if (ftype === 'x' || ftype === 'X') {
      const n = (val.kind === 'int' || val.kind === 'float') ? Math.trunc(val.value) : parseInt(s);
      formatted = ftype === 'X' ? n.toString(16).toUpperCase() : n.toString(16);
    } else if (ftype === 'b') {
      const n = (val.kind === 'int' || val.kind === 'float') ? Math.trunc(val.value) : parseInt(s);
      formatted = n.toString(2);
    } else if (ftype === 'o') {
      const n = (val.kind === 'int' || val.kind === 'float') ? Math.trunc(val.value) : parseInt(s);
      formatted = n.toString(8);
    } else if (precStr && !ftype && (val.kind === 'float' || val.kind === 'int')) {
      formatted = (val.value).toFixed(parseInt(precStr));
    }

    if (width > formatted.length) {
      const pad = width - formatted.length;
      if (align === '<') formatted = formatted + fill.repeat(pad);
      else if (align === '^') { const l = Math.floor(pad / 2); formatted = fill.repeat(l) + formatted + fill.repeat(pad - l); }
      else if (align === '=' || fill === '0') {
        // Numeric padding: insert after sign
        const isNeg = formatted.startsWith('-');
        if (isNeg) formatted = '-' + fill.repeat(pad) + formatted.substring(1);
        else formatted = fill.repeat(pad) + formatted;
      }
      else formatted = fill.repeat(pad) + formatted;
    }
    return formatted;
  }
}


// ─── Statement Executor ─────────────────────────────────────────────────────

class Executor {
  stdout: string[] = [];
  env: Env;
  private parser: ExprParser;
  private inputQueue: string[] = [];
  private stepCount = 0;
  private readonly maxSteps = 100000;
  private envStack: Env[] = [];

  constructor() {
    this.env = new Env();
    this.parser = new ExprParser(this);
    this.registerBuiltins();
  }

  queueInput(val: string): void { this.inputQueue.push(val); }

  execute(code: string): { stdout: string; success: boolean; error?: { type: string; message: string; line?: number } } {
    this.stdout = [];
    this.env = new Env();
    this.stepCount = 0;
    this.registerBuiltins();

    const lines = this.parseLines(code);
    try {
      this.executeBlock(lines, 0, lines.length, this.env);
      return { stdout: this.stdout.join(''), success: true };
    } catch (e) {
      if (e instanceof PyError) {
        return { stdout: this.stdout.join(''), success: false, error: { type: e.type, message: e.message, ...(e.line !== undefined ? { line: e.line } : {}) } };
      }
      if (e instanceof ReturnSignal) {
        return { stdout: this.stdout.join(''), success: true };
      }
      const msg = e instanceof Error ? e.message : String(e);
      return { stdout: this.stdout.join(''), success: false, error: { type: 'InternalError', message: msg } };
    }
  }

  private parseLines(code: string): Line[] {
    const rawLines = code.split('\n');
    const lines: Line[] = [];
    let pending = '';
    let pendingIndent = 0;
    let pendingLineNo = 0;
    let bracketDepth = 0;

    for (let i = 0; i < rawLines.length; i++) {
      const raw = rawLines[i]!;
      const trimmed = raw.trimStart();
      if (trimmed === '' || trimmed.startsWith('#')) {
        if (bracketDepth > 0 && pending !== '') continue; // skip blank/comment lines inside open brackets
        continue;
      }
      const indent = raw.length - raw.trimStart().length;
      const text = this.removeInlineComment(trimmed).trim();
      if (text === '') {
        if (bracketDepth > 0) continue;
        continue;
      }

      // Handle explicit line continuation
      if (text.endsWith('\\')) {
        if (pending === '') { pendingIndent = indent; pendingLineNo = i + 1; }
        pending += text.slice(0, -1).trim() + ' ';
        continue;
      }

      if (pending !== '' && bracketDepth === 0 && !text.endsWith('\\')) {
        // Had line continuation, this is the last piece
        if (bracketDepth === 0) {
          pending += text;
          // Count brackets in pending
          const bd = this.countBracketDepth(pending);
          if (bd <= 0) {
            lines.push({ indent: pendingIndent, text: pending, lineNo: pendingLineNo });
            pending = '';
            bracketDepth = 0;
            continue;
          }
          bracketDepth = bd;
          pending += ' ';
          continue;
        }
      }

      if (bracketDepth > 0) {
        // Continue accumulating
        pending += ' ' + text;
        bracketDepth = this.countBracketDepth(pending);
        if (bracketDepth <= 0) {
          lines.push({ indent: pendingIndent, text: pending, lineNo: pendingLineNo });
          pending = '';
          bracketDepth = 0;
        }
        continue;
      }

      // Check if this line has unbalanced brackets
      const bd = this.countBracketDepth(text);
      if (bd > 0) {
        pending = text;
        pendingIndent = indent;
        pendingLineNo = i + 1;
        bracketDepth = bd;
        continue;
      }

      lines.push({ indent, text, lineNo: i + 1 });
    }
    // flush remaining
    if (pending !== '') {
      lines.push({ indent: pendingIndent, text: pending, lineNo: pendingLineNo });
    }
    return lines;
  }

  private countBracketDepth(text: string): number {
    let depth = 0;
    let inStr = false;
    let strChar = '';
    let inTriple = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]!;
      if (inStr) {
        if (ch === '\\') { i++; continue; }
        if (inTriple) {
          if (ch === strChar && text[i + 1] === strChar && text[i + 2] === strChar) {
            inStr = false; inTriple = false; i += 2;
          }
        } else {
          if (ch === strChar) inStr = false;
        }
      } else {
        if ((ch === '"' || ch === "'") && text[i + 1] === ch && text[i + 2] === ch) {
          inStr = true; inTriple = true; strChar = ch; i += 2;
        } else if (ch === '"' || ch === "'") {
          inStr = true; strChar = ch;
        } else if (ch === '(' || ch === '[' || ch === '{') {
          depth++;
        } else if (ch === ')' || ch === ']' || ch === '}') {
          depth--;
        } else if (ch === '#') {
          break; // rest is comment
        }
      }
    }
    return depth;
  }

  private removeInlineComment(line: string): string {
    let inStr = false;
    let strChar = '';
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]!;
      if (inStr) {
        if (ch === '\\') { i++; continue; }
        if (ch === strChar) inStr = false;
      } else {
        if (ch === '"' || ch === "'") { inStr = true; strChar = ch; }
        else if (ch === '#') return line.substring(0, i);
      }
    }
    return line;
  }

  executeBlock(lines: Line[], start: number, end: number, env: Env): ReturnSignal | BreakSignal | ContinueSignal | undefined {
    let i = start;
    while (i < end) {
      this.stepCount++;
      if (this.stepCount > this.maxSteps) throw new PyError('RuntimeError', 'maximum execution steps exceeded');

      const lineResult = this.executeLine(lines, i, end, env);
      if (lineResult.signal) return lineResult.signal;
      i = lineResult.nextLine;
    }
    return undefined;
  }

  collectYields(lines: Line[], start: number, end: number, env: Env, yields: Val[]): void {
    let i = start;
    while (i < end) {
      this.stepCount++;
      if (this.stepCount > this.maxSteps) throw new PyError('RuntimeError', 'maximum execution steps exceeded');
      const line = lines[i]!;
      const text = line.text;

      // Handle for loops specially to collect yields from the body
      if (text.startsWith('for ') && text.endsWith(':')) {
        const forBodyStart = i + 1;
        const forBodyEnd = this.findBlockEnd(lines, i, end);
        const fm = /^for\s+(\w+(?:\s*,\s*\w+)*)\s+in\s+(.+):$/.exec(text);
        if (fm) {
          const varNames = fm[1]!.split(',').map(s => s.trim());
          const iterExpr = fm[2]!;
          const iterItems = this.parser.getIterable(this.evalExpr(iterExpr, env));
          for (const item of iterItems) {
            if (varNames.length === 1) {
              env.set(varNames[0]!, item);
            } else {
              if (item.kind === 'tuple' || item.kind === 'list') {
                for (let k = 0; k < varNames.length; k++) env.set(varNames[k]!, item.items[k] ?? NONE);
              }
            }
            this.collectYields(lines, forBodyStart, forBodyEnd, env, yields);
          }
          i = forBodyEnd;
          continue;
        }
      }

      // Handle if/elif/else
      if (text.startsWith('if ') && text.endsWith(':')) {
        const condStr = text.substring(3, text.length - 1).trim();
        const cond = this.evalExpr(condStr, env);
        const ifBodyStart = i + 1;
        const ifBodyEnd = this.findBlockEnd(lines, i, end);
        if (pyBool(cond)) {
          this.collectYields(lines, ifBodyStart, ifBodyEnd, env, yields);
        }
        i = ifBodyEnd;
        // Handle elif/else
        while (i < end && lines[i]!.indent === line.indent) {
          const cl = lines[i]!;
          if (cl.text.startsWith('elif ') && cl.text.endsWith(':')) {
            const elifCond = cl.text.substring(5, cl.text.length - 1).trim();
            const elifBodyStart = i + 1;
            const elifBodyEnd = this.findBlockEnd(lines, i, end);
            if (!pyBool(cond) && pyBool(this.evalExpr(elifCond, env))) {
              this.collectYields(lines, elifBodyStart, elifBodyEnd, env, yields);
            }
            i = elifBodyEnd;
          } else if (cl.text === 'else:') {
            const elseBodyStart = i + 1;
            const elseBodyEnd = this.findBlockEnd(lines, i, end);
            if (!pyBool(cond)) {
              this.collectYields(lines, elseBodyStart, elseBodyEnd, env, yields);
            }
            i = elseBodyEnd;
          } else break;
        }
        continue;
      }

      // yield
      if (text.startsWith('yield ')) {
        const expr = text.substring(6).trim();
        yields.push(this.evalExpr(expr, env));
        i++;
        continue;
      }
      if (text === 'yield') {
        yields.push(NONE);
        i++;
        continue;
      }

      // Other statements — execute normally
      const lineResult = this.executeLine(lines, i, end, env);
      if (lineResult.signal instanceof ReturnSignal) return;
      if (lineResult.signal instanceof BreakSignal) return;
      i = lineResult.nextLine;
    }
  }

  private executeLine(lines: Line[], lineIdx: number, end: number, env: Env): { nextLine: number; signal?: ReturnSignal | BreakSignal | ContinueSignal } {
    const line = lines[lineIdx]!;
    const text = line.text;

    // pass
    if (text === 'pass') return { nextLine: lineIdx + 1 };
    // break
    if (text === 'break') return { nextLine: lineIdx + 1, signal: new BreakSignal() };
    // continue
    if (text === 'continue') return { nextLine: lineIdx + 1, signal: new ContinueSignal() };

    // return
    if (text === 'return' || text.startsWith('return ')) {
      const expr = text === 'return' ? '' : text.substring(7).trim();
      if (!expr) return { nextLine: lineIdx + 1, signal: new ReturnSignal(NONE) };
      // Check for tuple return: return a, b, c
      const commaIdx = this.findTopLevelComma(expr);
      if (commaIdx >= 0) {
        // It's a tuple return
        const parts = this.splitTopLevel(expr, ',');
        const items = parts.map(p => this.evalExpr(p.trim(), env));
        return { nextLine: lineIdx + 1, signal: new ReturnSignal(mkTuple(items)) };
      }
      const val = this.evalExpr(expr, env);
      return { nextLine: lineIdx + 1, signal: new ReturnSignal(val) };
    }

    // yield — signal to collect value
    if (text.startsWith('yield ')) {
      const expr = text.substring(6).trim();
      const val = this.evalExpr(expr, env);
      return { nextLine: lineIdx + 1, signal: new YieldSignal(val) as any };
    }
    if (text === 'yield') {
      return { nextLine: lineIdx + 1, signal: new YieldSignal(NONE) as any };
    }

    // assert
    if (text.startsWith('assert ')) {
      const rest = text.substring(7);
      const commaIdx = this.findTopLevelComma(rest);
      const condStr = commaIdx >= 0 ? rest.substring(0, commaIdx) : rest;
      const msgStr = commaIdx >= 0 ? rest.substring(commaIdx + 1).trim() : '';
      const cond = this.evalExpr(condStr.trim(), env);
      if (!pyBool(cond)) {
        const msg = msgStr ? pyStr(this.evalExpr(msgStr, env)) : '';
        throw new PyError('AssertionError', msg);
      }
      return { nextLine: lineIdx + 1 };
    }

    // del
    if (text.startsWith('del ')) {
      const varName = text.substring(4).trim();
      env.vars.delete(varName);
      return { nextLine: lineIdx + 1 };
    }

    // global
    if (text.startsWith('global ')) {
      return { nextLine: lineIdx + 1 }; // simplified
    }

    // import
    if (text.startsWith('import ') || text.startsWith('from ')) {
      this.handleImport(text, env);
      return { nextLine: lineIdx + 1 };
    }

    // raise
    if (text.startsWith('raise ')) {
      const exprStr = text.substring(6).trim();
      const val = this.evalExpr(exprStr, env);
      if (val.kind === 'obj' && (val as any)._exType) {
        throw new PyError((val as any)._exType, (val as any)._exMessage ?? '', undefined, val as ObjVal);
      }
      if (val.kind === 'obj') throw new PyError(val.cls.name, pyStr(val.attrs.get('message') ?? val.attrs.get('args') ?? mkStr('')), undefined, val);
      if (val.kind === 'str') throw new PyError('Exception', val.value);
      throw new PyError('Exception', pyStr(val));
    }
    if (text === 'raise') throw new PyError('Exception', '');

    // Decorator
    if (text.startsWith('@')) {
      const decoratorExpr = text.substring(1).trim();
      // Next line should be a def or class
      const nextIdx = lineIdx + 1;
      if (nextIdx < end) {
        const nextLine = lines[nextIdx]!;
        if (nextLine.text.startsWith('def ')) {
          const result = this.executeDef(lines, nextIdx, end, env);
          const funcName = this.extractDefName(nextLine.text);
          const func = env.get(funcName);
          if (func) {
            // Evaluate decorator (may be a simple name or a call like @require_clearance(8))
            const decorator = this.evalExpr(decoratorExpr, env);
            if (decorator) {
              const decorated = this.callValue(decorator, [func], new Map(), env);
              env.set(funcName, decorated);
            }
          }
          return { nextLine: result.nextLine };
        }
      }
      return { nextLine: lineIdx + 1 };
    }

    // if/elif/else
    if (text.startsWith('if ') && text.endsWith(':')) {
      return this.executeIf(lines, lineIdx, end, env);
    }

    // for loop
    if (text.startsWith('for ') && text.includes(' in ') && text.endsWith(':')) {
      return this.executeFor(lines, lineIdx, end, env);
    }

    // while loop
    if (text.startsWith('while ') && text.endsWith(':')) {
      return this.executeWhile(lines, lineIdx, end, env);
    }

    // def
    if (text.startsWith('def ')) {
      return this.executeDef(lines, lineIdx, end, env);
    }

    // class
    if (text.startsWith('class ')) {
      return this.executeClass(lines, lineIdx, end, env);
    }

    // try/except
    if (text === 'try:') {
      return this.executeTry(lines, lineIdx, end, env);
    }

    // with statement (simplified)
    if (text.startsWith('with ') && text.endsWith(':')) {
      return this.executeWith(lines, lineIdx, end, env);
    }

    // match/case (simplified)
    if (text.startsWith('match ') && text.endsWith(':')) {
      return this.executeMatch(lines, lineIdx, end, env);
    }

    // Assignment or expression
    return this.executeAssignmentOrExpr(lines, lineIdx, env);
  }

  private extractDefName(text: string): string {
    const m = /^def\s+(\w+)/.exec(text);
    return m?.[1] ?? '';
  }

  private findBlockEnd(lines: Line[], start: number, end: number): number {
    if (start >= end) return start;
    const baseIndent = lines[start]!.indent;
    let i = start + 1;
    while (i < end && lines[i]!.indent > baseIndent) i++;
    return i;
  }

  private executeIf(lines: Line[], lineIdx: number, end: number, env: Env): { nextLine: number; signal?: ReturnSignal | BreakSignal | ContinueSignal } {
    const line = lines[lineIdx]!;
    const baseIndent = line.indent;
    let condStr = line.text.substring(3, line.text.length - 1).trim();
    let cond = this.evalExpr(condStr, env);

    const bodyStart = lineIdx + 1;
    const bodyEnd = this.findBlockEnd(lines, lineIdx, end);

    if (pyBool(cond)) {
      const signal = this.executeBlock(lines, bodyStart, bodyEnd, env);
      // Skip remaining elif/else
      let i = bodyEnd;
      while (i < end) {
        const l = lines[i]!;
        if (l.indent !== baseIndent) break;
        if (l.text.startsWith('elif ') || l.text === 'else:') {
          i = this.findBlockEnd(lines, i, end);
        } else break;
      }
      return { nextLine: i, ...(signal !== undefined ? { signal } : {}) };
    }

    // Try elif/else
    let i = bodyEnd;
    while (i < end) {
      const l = lines[i]!;
      if (l.indent !== baseIndent) break;

      if (l.text.startsWith('elif ') && l.text.endsWith(':')) {
        condStr = l.text.substring(5, l.text.length - 1).trim();
        cond = this.evalExpr(condStr, env);
        const elifBodyStart = i + 1;
        const elifBodyEnd = this.findBlockEnd(lines, i, end);
        if (pyBool(cond)) {
          const signal = this.executeBlock(lines, elifBodyStart, elifBodyEnd, env);
          // Skip remaining
          let j = elifBodyEnd;
          while (j < end) {
            const jl = lines[j]!;
            if (jl.indent !== baseIndent) break;
            if (jl.text.startsWith('elif ') || jl.text === 'else:') {
              j = this.findBlockEnd(lines, j, end);
            } else break;
          }
          return { nextLine: j, ...(signal !== undefined ? { signal } : {}) };
        }
        i = elifBodyEnd;
      } else if (l.text === 'else:') {
        const elseBodyStart = i + 1;
        const elseBodyEnd = this.findBlockEnd(lines, i, end);
        const signal = this.executeBlock(lines, elseBodyStart, elseBodyEnd, env);
        return { nextLine: elseBodyEnd, ...(signal !== undefined ? { signal } : {}) };
      } else break;
    }
    return { nextLine: i };
  }

  private executeFor(lines: Line[], lineIdx: number, end: number, env: Env): { nextLine: number; signal?: ReturnSignal | BreakSignal | ContinueSignal } {
    const line = lines[lineIdx]!;
    const text = line.text;
    // Parse: for VAR in EXPR:
    const m = /^for\s+(.+?)\s+in\s+(.+):$/.exec(text);
    if (!m) return { nextLine: lineIdx + 1 };
    const targetStr = m[1]!.trim();
    const iterStr = m[2]!.trim();
    const targetNames = targetStr.split(',').map(s => s.trim());
    const iterable = this.evalExpr(iterStr, env);
    const items = this.parser.getIterable(iterable);

    const bodyStart = lineIdx + 1;
    const bodyEnd = this.findBlockEnd(lines, lineIdx, end);

    // Check for else clause
    let elseStart = -1;
    let elseEnd = bodyEnd;
    if (bodyEnd < end && lines[bodyEnd]!.indent === line.indent && lines[bodyEnd]!.text === 'else:') {
      elseStart = bodyEnd + 1;
      elseEnd = this.findBlockEnd(lines, bodyEnd, end);
    }

    let brokeOut = false;
    for (const item of items) {
      this.parser.assignTarget(targetNames, item, env);
      const signal = this.executeBlock(lines, bodyStart, bodyEnd, env);
      if (signal instanceof BreakSignal) { brokeOut = true; break; }
      if (signal instanceof ContinueSignal) continue;
      if (signal instanceof ReturnSignal) return { nextLine: elseEnd, signal };
    }

    if (!brokeOut && elseStart >= 0) {
      const signal = this.executeBlock(lines, elseStart, elseEnd, env);
      if (signal) return { nextLine: elseEnd, signal };
    }

    return { nextLine: elseEnd };
  }

  private executeWhile(lines: Line[], lineIdx: number, end: number, env: Env): { nextLine: number; signal?: ReturnSignal | BreakSignal | ContinueSignal } {
    const line = lines[lineIdx]!;
    const condStr = line.text.substring(6, line.text.length - 1).trim();
    const bodyStart = lineIdx + 1;
    const bodyEnd = this.findBlockEnd(lines, lineIdx, end);
    let iterations = 0;

    while (pyBool(this.evalExpr(condStr, env))) {
      iterations++;
      if (iterations > this.maxSteps) throw new PyError('RuntimeError', 'infinite loop detected');
      const signal = this.executeBlock(lines, bodyStart, bodyEnd, env);
      if (signal instanceof BreakSignal) break;
      if (signal instanceof ContinueSignal) continue;
      if (signal instanceof ReturnSignal) return { nextLine: bodyEnd, signal };
    }
    return { nextLine: bodyEnd };
  }

  private executeDef(lines: Line[], lineIdx: number, end: number, env: Env): { nextLine: number } {
    const line = lines[lineIdx]!;
    const text = line.text;
    // Parse: def name(params) -> type:
    const m = /^def\s+(\w+)\s*\(([^)]*)\)(?:\s*->\s*[^:]+)?\s*:$/.exec(text);
    if (!m) return { nextLine: lineIdx + 1 };
    const name = m[1]!;
    const paramsStr = m[2]!;

    const bodyStart = lineIdx + 1;
    const bodyEnd = this.findBlockEnd(lines, lineIdx, end);
    const bodyLines = lines.slice(bodyStart, bodyEnd);

    const params = this.parseParams(paramsStr, env);
    const func: FuncVal = { kind: 'func', name, params, body: bodyLines, closure: env };
    // Check if body contains yield — mark as generator
    if (bodyLines.some(l => /\byield\b/.test(l.text))) {
      (func as any)._isGenerator = true;
    }
    env.set(name, func);
    return { nextLine: bodyEnd };
  }

  private parseParams(paramsStr: string, env: Env): ParamDef[] {
    if (!paramsStr.trim()) return [];
    const params: ParamDef[] = [];
    // Split by commas, respecting parentheses
    const parts = this.splitArgs(paramsStr);
    for (const part of parts) {
      const p = part.trim();
      if (!p) continue;
      // Remove type annotations
      let nameStr = p.replace(/\s*:\s*[^=]+/, '').trim();
      if (nameStr.startsWith('**')) {
        params.push({ name: nameStr.substring(2).trim(), isKwargs: true });
      } else if (nameStr.startsWith('*')) {
        params.push({ name: nameStr.substring(1).trim(), isArgs: true });
      } else if (nameStr.includes('=')) {
        const eqIdx = nameStr.indexOf('=');
        const paramName = nameStr.substring(0, eqIdx).trim();
        const defaultStr = nameStr.substring(eqIdx + 1).trim();
        const defaultVal = this.evalExpr(defaultStr, env);
        params.push({ name: paramName, defaultVal });
      } else {
        // Remove type hint after colon
        const colonIdx = nameStr.indexOf(':');
        if (colonIdx >= 0) nameStr = nameStr.substring(0, colonIdx).trim();
        params.push({ name: nameStr });
      }
    }
    return params;
  }

  private splitArgs(s: string): string[] {
    const parts: string[] = [];
    let depth = 0; let current = '';
    for (const ch of s) {
      if (ch === '(' || ch === '[' || ch === '{') depth++;
      else if (ch === ')' || ch === ']' || ch === '}') depth--;
      else if (ch === ',' && depth === 0) { parts.push(current); current = ''; continue; }
      current += ch;
    }
    if (current.trim()) parts.push(current);
    return parts;
  }

  private executeClass(lines: Line[], lineIdx: number, end: number, env: Env): { nextLine: number } {
    const line = lines[lineIdx]!;
    const m = /^class\s+(\w+)(?:\s*\(([^)]*)\))?\s*:$/.exec(line.text);
    if (!m) return { nextLine: lineIdx + 1 };
    const name = m[1]!;
    const parentName = m[2]?.trim() || undefined;

    const bodyStart = lineIdx + 1;
    const bodyEnd = this.findBlockEnd(lines, lineIdx, end);
    const bodyLines = lines.slice(bodyStart, bodyEnd);

    const classEnv = new Env(env);
    const methods = new Map<string, FuncVal>();
    const attrs = new Map<string, Val>();

    // Execute class body to collect methods and class-level attrs
    let i = 0;
    while (i < bodyLines.length) {
      const bl = bodyLines[i]!;
      if (bl.text.startsWith('def ')) {
        const defResult = this.executeDef(bodyLines, i, bodyLines.length, classEnv);
        const funcName = this.extractDefName(bl.text);
        const func = classEnv.get(funcName);
        if (func?.kind === 'func') methods.set(funcName, func);
        i = defResult.nextLine;
      } else if (bl.text === 'pass') {
        i++;
      } else {
        // Class-level assignment or expression
        const result = this.executeAssignmentOrExpr(bodyLines, i, classEnv);
        i = result.nextLine;
        // Copy new vars to attrs
        for (const [k, v] of classEnv.vars) {
          if (!methods.has(k)) attrs.set(k, v);
        }
      }
    }

    const cls: ClassVal = { kind: 'class', name, ...(parentName !== undefined ? { parentName } : {}), body: bodyLines, env: classEnv, methods, attrs };
    env.set(name, cls);
    return { nextLine: bodyEnd };
  }

  private executeTry(lines: Line[], lineIdx: number, end: number, env: Env): { nextLine: number; signal?: ReturnSignal | BreakSignal | ContinueSignal } {
    const line = lines[lineIdx]!;
    const baseIndent = line.indent;
    const tryBodyStart = lineIdx + 1;
    const tryBodyEnd = this.findBlockEnd(lines, lineIdx, end);

    // Find except/else/finally clauses
    interface Clause { type: 'except' | 'else' | 'finally'; start: number; end: number; exType?: string; varName?: string }
    const clauses: Clause[] = [];
    let i = tryBodyEnd;
    while (i < end) {
      const cl = lines[i]!;
      if (cl.indent !== baseIndent) break;
      if (cl.text.startsWith('except') && (cl.text.endsWith(':') || cl.text === 'except:')) {
        const clauseEnd = this.findBlockEnd(lines, i, end);
        const em = /^except(?:\s+(\w+)(?:\s+as\s+(\w+))?)?\s*:$/.exec(cl.text);
        const exType = em?.[1];
        const varName = em?.[2];
        clauses.push({ type: 'except', start: i + 1, end: clauseEnd, ...(exType !== undefined ? { exType } : {}), ...(varName !== undefined ? { varName } : {}) });
        i = clauseEnd;
      } else if (cl.text === 'else:') {
        const clauseEnd = this.findBlockEnd(lines, i, end);
        clauses.push({ type: 'else', start: i + 1, end: clauseEnd });
        i = clauseEnd;
      } else if (cl.text === 'finally:') {
        const clauseEnd = this.findBlockEnd(lines, i, end);
        clauses.push({ type: 'finally', start: i + 1, end: clauseEnd });
        i = clauseEnd;
      } else break;
    }

    let signal: ReturnSignal | BreakSignal | ContinueSignal | undefined;
    try {
      signal = this.executeBlock(lines, tryBodyStart, tryBodyEnd, env);
      // Execute else clause if no exception
      const elseClause = clauses.find(c => c.type === 'else');
      if (elseClause) {
        const elseSignal = this.executeBlock(lines, elseClause.start, elseClause.end, env);
        if (elseSignal) signal = elseSignal;
      }
    } catch (e) {
      if (e instanceof PyError) {
        let caught = false;
        for (const clause of clauses) {
          if (clause.type !== 'except') continue;
          if (!clause.exType || clause.exType === e.type || clause.exType === 'Exception' || clause.exType === 'BaseException' || this.isSubclassOf(e.type, clause.exType, env)) {
            if (clause.varName) {
              if (e.obj) {
                env.set(clause.varName, e.obj);
              } else {
                // Try to find the registered exception class for proper __str__ support
                const registeredCls = env.get(e.type) ?? this.env.get(e.type);
                const errCls = registeredCls?.kind === 'class' ? registeredCls
                  : { kind: 'class' as const, name: e.type, body: [] as Line[], env: new Env(), methods: new Map<string, FuncVal>(), attrs: new Map<string, Val>() };
                const errObj: ObjVal = {
                  kind: 'obj',
                  cls: errCls,
                  attrs: new Map([['message', mkStr(e.message)], ['args', mkTuple([mkStr(e.message)])]]),
                };
                env.set(clause.varName, errObj);
              }
            }
            const catchSignal = this.executeBlock(lines, clause.start, clause.end, env);
            if (catchSignal) signal = catchSignal;
            caught = true;
            break;
          }
        }
        if (!caught) {
          // Execute finally and re-throw
          const finallyClause = clauses.find(c => c.type === 'finally');
          if (finallyClause) this.executeBlock(lines, finallyClause.start, finallyClause.end, env);
          throw e;
        }
      } else throw e;
    }

    // Execute finally
    const finallyClause = clauses.find(c => c.type === 'finally');
    if (finallyClause) {
      const finSignal = this.executeBlock(lines, finallyClause.start, finallyClause.end, env);
      if (finSignal instanceof ReturnSignal) signal = finSignal;
    }

    return { nextLine: i, ...(signal !== undefined ? { signal } : {}) };
  }

  private executeWith(lines: Line[], lineIdx: number, end: number, env: Env): { nextLine: number; signal?: ReturnSignal | BreakSignal | ContinueSignal } {
    const line = lines[lineIdx]!;
    const bodyStart = lineIdx + 1;
    const bodyEnd = this.findBlockEnd(lines, lineIdx, end);
    // Parse: with EXPR as VAR:
    const withMatch = /^with\s+(.+?)\s+as\s+(\w+)\s*:$/.exec(line.text);
    if (withMatch) {
      const exprStr = withMatch[1]!;
      const varName = withMatch[2]!;
      const val = this.evalExpr(exprStr, env);
      env.set(varName, val);
    } else {
      // with EXPR: (no as)
      const exprMatch = /^with\s+(.+?)\s*:$/.exec(line.text);
      if (exprMatch) {
        this.evalExpr(exprMatch[1]!, env);
      }
    }
    const signal = this.executeBlock(lines, bodyStart, bodyEnd, env);
    return { nextLine: bodyEnd, ...(signal !== undefined ? { signal } : {}) };
  }

  private executeMatch(lines: Line[], lineIdx: number, end: number, env: Env): { nextLine: number; signal?: ReturnSignal | BreakSignal | ContinueSignal } {
    const line = lines[lineIdx]!;
    const baseIndent = line.indent;
    const subjStr = line.text.substring(6, line.text.length - 1).trim();
    const subject = this.evalExpr(subjStr, env);

    let i = lineIdx + 1;
    while (i < end) {
      const caseLine = lines[i]!;
      if (caseLine.indent <= baseIndent) break;
      if (!caseLine.text.startsWith('case ')) { i++; continue; }

      let caseText = caseLine.text.substring(5, caseLine.text.length - 1).trim();
      const caseBodyStart = i + 1;
      const caseBodyEnd = this.findBlockEnd(lines, i, end);

      // Check for guard: case PATTERN if CONDITION:
      let guard: string | undefined;
      const ifIdx = caseText.lastIndexOf(' if ');
      if (ifIdx >= 0) {
        guard = caseText.substring(ifIdx + 4).trim();
        caseText = caseText.substring(0, ifIdx).trim();
      }

      let matched = false;
      if (caseText === '_') {
        matched = true;
      } else if (caseText.startsWith('{')) {
        // Dict pattern matching
        matched = this.matchDictPattern(subject, caseText, env);
      } else {
        try {
          const patternVal = this.evalExpr(caseText, env);
          matched = pyEqual(subject, patternVal);
        } catch {
          // If it's an identifier, bind it
          if (/^\w+$/.test(caseText)) {
            env.set(caseText, subject);
            matched = true;
          }
        }
      }

      if (matched) {
        if (guard) {
          if (!pyBool(this.evalExpr(guard, env))) { i = caseBodyEnd; continue; }
        }
        const signal = this.executeBlock(lines, caseBodyStart, caseBodyEnd, env);
        // Skip remaining cases
        i = caseBodyEnd;
        while (i < end && lines[i]!.indent > baseIndent) i++;
        return { nextLine: i, ...(signal !== undefined ? { signal } : {}) };
      }
      i = caseBodyEnd;
    }
    // Skip remaining
    while (i < end && lines[i]!.indent > baseIndent) i++;
    return { nextLine: i };
  }

  private matchDictPattern(subject: Val, pattern: string, env: Env): boolean {
    if (subject.kind !== 'dict') return false;
    // Simple dict pattern: {"key": value_var, ...}
    try {
      const patternDict = this.evalExpr(pattern, env);
      if (patternDict.kind !== 'dict') return false;
      for (const [pk, pv] of patternDict.entries) {
        const entry = subject.entries.find(([k]) => pyEqual(k, pk));
        if (!entry) return false;
        // If pattern value is a variable name (identifier), bind it
        if (!pyEqual(entry[1]!, pv)) return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  private executeAssignmentOrExpr(lines: Line[], lineIdx: number, env: Env): { nextLine: number; signal?: ReturnSignal | BreakSignal | ContinueSignal } {
    const text = lines[lineIdx]!.text;

    // Augmented assignment: x += expr, x -= expr, etc.
    const augOps = ['+=', '-=', '*=', '/=', '//=', '%=', '**='];
    for (const op of augOps) {
      const idx = this.findAssignOp(text, op);
      if (idx >= 0) {
        const target = text.substring(0, idx).trim();
        const valStr = text.substring(idx + op.length).trim();
        const current = this.evalExpr(target, env);
        const rhs = this.evalExpr(valStr, env);
        const binOp = op.substring(0, op.length - 1);
        const computed = this.parser.applyBinOp(binOp, current, rhs);
        this.assignToTarget(target, computed, env);
        return { nextLine: lineIdx + 1 };
      }
    }

    // Simple assignment: x = expr or x: type = expr
    const eqIdx = this.findAssignOp(text, '=');
    if (eqIdx >= 0 && text[eqIdx + 1] !== '=' && (eqIdx === 0 || text[eqIdx - 1] !== '!' && text[eqIdx - 1] !== '<' && text[eqIdx - 1] !== '>')) {
      const lhs = text.substring(0, eqIdx).trim();
      const rhs = text.substring(eqIdx + 1).trim();

      // Check if lhs is a valid assignment target (not a comparison)
      if (this.isAssignTarget(lhs)) {
        const val = this.evalExpr(rhs, env);
        this.assignToTarget(lhs, val, env);
        return { nextLine: lineIdx + 1 };
      }
    }

    // Expression statement
    this.evalExpr(text, env);
    return { nextLine: lineIdx + 1 };
  }

  private isAssignTarget(s: string): boolean {
    // Simple var: x
    if (/^[a-zA-Z_]\w*$/.test(s)) return true;
    // Type-annotated: x: int
    if (/^[a-zA-Z_]\w*\s*:\s*.+$/.test(s)) return true;
    // Subscript: x[0], x["key"]
    if (/^[a-zA-Z_]\w*\[.+\]$/.test(s)) return true;
    // Attribute: x.y
    if (/^[a-zA-Z_]\w*(\.\w+)+$/.test(s)) return true;
    // Tuple unpacking: a, b, c
    if (s.includes(',') && !s.includes('(') && !s.includes('[')) {
      return s.split(',').every(p => /^\s*[a-zA-Z_]\w*\s*$/.test(p));
    }
    return false;
  }

  private assignToTarget(target: string, val: Val, env: Env): void {
    target = target.trim();

    // Type annotation: x: int = ...
    const colonIdx = target.indexOf(':');
    if (colonIdx >= 0 && /^[a-zA-Z_]\w*$/.test(target.substring(0, colonIdx).trim())) {
      target = target.substring(0, colonIdx).trim();
    }

    // Simple variable
    if (/^[a-zA-Z_]\w*$/.test(target)) {
      if (!env.update(target, val)) env.set(target, val);
      return;
    }

    // Subscript: x[idx]
    const subM = /^(\w+(?:\.\w+)*)\[(.+)\]$/.exec(target);
    if (subM) {
      const obj = this.evalExpr(subM[1]!, env);
      const idx = this.evalExpr(subM[2]!, env);
      if (obj.kind === 'list' && (idx.kind === 'int' || idx.kind === 'float')) {
        let i = Math.trunc(idx.value);
        if (i < 0) i = obj.items.length + i;
        obj.items[i] = val;
      } else if (obj.kind === 'dict') {
        const existing = obj.entries.findIndex(([k]) => pyEqual(k, idx));
        if (existing >= 0) obj.entries[existing] = [idx, val];
        else obj.entries.push([idx, val]);
      }
      return;
    }

    // Attribute: x.y
    const attrM = /^(.+)\.(\w+)$/.exec(target);
    if (attrM) {
      const obj = this.evalExpr(attrM[1]!, env);
      if (obj.kind === 'obj') { obj.attrs.set(attrM[2]!, val); return; }
      if (obj.kind === 'class') { obj.attrs.set(attrM[2]!, val); return; }
      return;
    }

    // Tuple unpacking: a, b = val
    if (target.includes(',')) {
      const names = target.split(',').map(s => s.trim());
      if (val.kind === 'tuple' || val.kind === 'list') {
        for (let i = 0; i < names.length; i++) {
          const n = names[i]!;
          if (n) this.assignToTarget(n, val.items[i] ?? NONE, env);
        }
      }
      return;
    }
  }

  private findAssignOp(text: string, op: string): number {
    let depth = 0;
    let inStr = false;
    let strCh = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]!;
      if (inStr) {
        if (ch === '\\') { i++; continue; }
        if (ch === strCh) inStr = false;
        continue;
      }
      if (ch === '"' || ch === "'") { inStr = true; strCh = ch; continue; }
      if (ch === '(' || ch === '[' || ch === '{') { depth++; continue; }
      if (ch === ')' || ch === ']' || ch === '}') { depth--; continue; }
      if (depth === 0 && text.startsWith(op, i)) {
        // For '=', make sure it's not ==, !=, <=, >=
        if (op === '=') {
          if (i > 0 && '!<>='.includes(text[i - 1]!)) continue;
          if (text[i + 1] === '=') continue;
        }
        return i;
      }
    }
    return -1;
  }

  private findTopLevelComma(text: string): number {
    let depth = 0;
    let inStr = false;
    let strCh = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]!;
      if (inStr) { if (ch === '\\') { i++; continue; } if (ch === strCh) inStr = false; continue; }
      if (ch === '"' || ch === "'") { inStr = true; strCh = ch; continue; }
      if (ch === '(' || ch === '[' || ch === '{') depth++;
      if (ch === ')' || ch === ']' || ch === '}') depth--;
      if (ch === ',' && depth === 0) return i;
    }
    return -1;
  }

  private splitTopLevel(text: string, sep: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let inStr = false;
    let strCh = '';
    let start = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]!;
      if (inStr) { if (ch === '\\') { i++; continue; } if (ch === strCh) inStr = false; continue; }
      if (ch === '"' || ch === "'") { inStr = true; strCh = ch; continue; }
      if (ch === '(' || ch === '[' || ch === '{') depth++;
      if (ch === ')' || ch === ']' || ch === '}') depth--;
      if (ch === sep && depth === 0) {
        parts.push(text.substring(start, i));
        start = i + 1;
      }
    }
    parts.push(text.substring(start));
    return parts;
  }

  evalExpr(expr: string, env: Env): Val {
    return this.parser.eval(expr, env);
  }

  makeCallMethod(env: Env): (obj: ObjVal, methodName: string) => Val {
    const self = this;
    return (obj: ObjVal, methodName: string): Val => {
      let method: Val | undefined = obj.cls.methods.get(methodName) ?? obj.attrs.get(methodName);
      // Walk parent chain
      if (!method || method.kind !== 'func') {
        let parentName = obj.cls.parentName;
        while (parentName && (!method || method.kind !== 'func')) {
          const parentCls = env.get(parentName) ?? self.env.get(parentName);
          if (parentCls?.kind === 'class') {
            method = parentCls.methods.get(methodName);
            parentName = parentCls.parentName;
          } else break;
        }
      }
      if (!method || method.kind !== 'func') throw new PyError('AttributeError', `'${obj.cls.name}' has no '${methodName}'`);
      // Bind self via closure like bindMethod does
      const bound: FuncVal = { ...method, closure: (() => { const e = new Env(method.closure); e.set('__self__', obj); return e; })() };
      return self.callValue(bound, [], new Map(), env);
    };
  }

  callValue(callee: Val, args: Val[], kwargs: Map<string, Val>, _env: Env): Val {
    // Native function (from method wrappers)
    const native = (callee as any)?._native;
    if (typeof native === 'function') {
      return native(args, kwargs);
    }

    // Built-in function
    if (callee.kind === 'func' && (callee as any)._builtin) {
      const boundSelf = callee.closure?.get?.('__self__');
      return (callee as any)._builtin(args, kwargs, _env, boundSelf);
    }

    // User-defined function
    if (callee.kind === 'func') {
      const func = callee;

      // Generator function — return a generator object with pre-collected values
      if ((func as any)._isGenerator) {
        const genEnv = new Env(func.closure);
        // Bind params
        for (let i = 0; i < func.params.length; i++) {
          const p = func.params[i]!;
          if (p.isArgs) {
            genEnv.set(p.name, mkTuple(args.slice(i)));
          } else if (p.isKwargs) {
            const entries: [Val, Val][] = [];
            for (const [k, v] of kwargs) entries.push([mkStr(k), v]);
            genEnv.set(p.name, mkDict(entries));
          } else {
            genEnv.set(p.name, args[i] ?? kwargs.get(p.name) ?? p.defaultVal ?? NONE);
          }
        }
        // Execute the body, collecting yields
        const yieldedValues: Val[] = [];
        this.collectYields(func.body, 0, func.body.length, genEnv, yieldedValues);
        const gen: GeneratorVal = { kind: 'generator', items: yieldedValues, index: 0 };
        return gen;
      }

      const funcEnv = new Env(func.closure);

      // Handle lambda with captured tokens
      if ((func as any)._lambdaToks) {
        // Bind params
        for (let i = 0; i < func.params.length; i++) {
          const p = func.params[i]!;
          if (p.isArgs) {
            funcEnv.set(p.name, mkTuple(args.slice(i)));
          } else if (p.isKwargs) {
            const entries: [Val, Val][] = [];
            for (const [k, v] of kwargs) entries.push([mkStr(k), v]);
            funcEnv.set(p.name, mkDict(entries));
          } else {
            funcEnv.set(p.name, args[i] ?? kwargs.get(p.name) ?? p.defaultVal ?? NONE);
          }
        }
        const p = new ExprParser(this);
        return p.evalTokens((func as any)._lambdaToks, funcEnv);
      }

      // Bind self for bound methods
      const selfVal = func.closure.get('__self__');
      let paramOffset = 0;
      if (selfVal?.kind === 'obj' && func.params.length > 0) {
        funcEnv.set(func.params[0]!.name, selfVal);
        paramOffset = 1;
      }

      // Bind params
      for (let i = paramOffset; i < func.params.length; i++) {
        const p = func.params[i]!;
        const argIdx = i - paramOffset;
        if (p.isArgs) {
          funcEnv.set(p.name, mkTuple(args.slice(argIdx)));
        } else if (p.isKwargs) {
          const entries: [Val, Val][] = [];
          for (const [k, v] of kwargs) entries.push([mkStr(k), v]);
          funcEnv.set(p.name, mkDict(entries));
        } else {
          funcEnv.set(p.name, args[argIdx] ?? kwargs.get(p.name) ?? p.defaultVal ?? NONE);
        }
      }

      // Execute body
      const bodyLines = func.body;
      try {
        this.envStack.push(funcEnv);
        const signal = this.executeBlock(bodyLines, 0, bodyLines.length, funcEnv);
        this.envStack.pop();
        if (signal instanceof ReturnSignal) return signal.value;
      } catch (e) {
        this.envStack.pop();
        if (e instanceof ReturnSignal) return e.value;
        throw e;
      }
      return NONE;
    }

    // Class instantiation
    if (callee.kind === 'class') {
      const cls = callee;
      const obj: ObjVal = { kind: 'obj', cls, attrs: new Map(cls.attrs) };

      // Inherit parent attrs and methods
      if (cls.parentName) {
        const parentCls = _env.get(cls.parentName) ?? this.env.get(cls.parentName);
        if (parentCls?.kind === 'class') {
          // Copy parent attrs that aren't already defined
          for (const [k, v] of parentCls.attrs) {
            if (!obj.attrs.has(k)) obj.attrs.set(k, v);
          }
        }
      }

      // Call __init__ — check parent chain
      let init = cls.methods.get('__init__');
      if (!init && cls.parentName) {
        let parentName: string | undefined = cls.parentName;
        while (!init && parentName) {
          const parentCls = _env.get(parentName) ?? this.env.get(parentName);
          if (parentCls?.kind === 'class') {
            init = parentCls.methods.get('__init__');
            parentName = parentCls.parentName;
          } else break;
        }
      }
      if (init) {
        if ((init as any)._builtin) {
          // Built-in __init__ — call it directly with args
          this.envStack.push(new Env());
          this.envStack[this.envStack.length - 1]!.set('self', obj);
          (init as any)._builtin(args, kwargs);
          this.envStack.pop();
        } else {
          const initEnv = new Env(init.closure);
          initEnv.set('self', obj);
          // Bind params (skip self)
          for (let i = 1; i < init.params.length; i++) {
            const p = init.params[i]!;
            initEnv.set(p.name, args[i - 1] ?? kwargs.get(p.name) ?? p.defaultVal ?? NONE);
          }
          try {
            this.envStack.push(initEnv);
            this.executeBlock(init.body, 0, init.body.length, initEnv);
            this.envStack.pop();
          } catch (e) {
            this.envStack.pop();
            if (!(e instanceof ReturnSignal)) throw e;
          }
        }
      }

      return obj;
    }

    throw new PyError('TypeError', `'${pyTypeName(callee)}' object is not callable`);
  }

  private isSubclassOf(childType: string, parentType: string, env: Env): boolean {
    const childCls = env.get(childType) ?? this.env.get(childType);
    if (!childCls || childCls.kind !== 'class') return false;
    let current = childCls.parentName;
    while (current) {
      if (current === parentType) return true;
      const parentCls = env.get(current) ?? this.env.get(current);
      if (!parentCls || parentCls.kind !== 'class') return false;
      current = parentCls.parentName;
    }
    return false;
  }

  private handleImport(text: string, env: Env): void {
    // import json / import io, json
    const m1 = /^import\s+(.+)$/.exec(text);
    if (m1 && !text.startsWith('from ')) {
      const modules = m1[1]!.split(',').map(s => s.trim());
      for (const modSpec of modules) {
        const asMatch = /^(\w+)(?:\s+as\s+(\w+))?$/.exec(modSpec);
        if (asMatch) {
          const modName = asMatch[1]!;
          const alias = asMatch[2] ?? modName;
          env.set(alias, this.getModule(modName));
        }
      }
      return;
    }
    // from X import Y / from X import *
    const m2 = /^from\s+([\w.]+)\s+import\s+(.+)$/.exec(text);
    if (m2) {
      const modName = m2[1]!;
      const importStr = m2[2]!.trim();
      const mod = this.getModule(modName);
      if (importStr === '*') {
        // Import all
        if (mod.kind === 'module') {
          for (const [k, v] of mod.attrs) env.set(k, v);
        }
      } else {
        const imports = importStr.split(',').map(s => s.trim());
        for (const imp of imports) {
          const parts = imp.split(/\s+as\s+/);
          const name = parts[0]!.trim();
          const alias = (parts[1] ?? name).trim();
          if (mod.kind === 'module') {
            const val = mod.attrs.get(name);
            if (val !== undefined) env.set(alias, val);
          }
        }
      }
    }
  }

  private getModule(name: string): Val {
    if (name === 'json') return this.createJsonModule();
    if (name === 're') return this.createReModule();
    if (name === 'math') return this.createMathModule();
    if (name === 'random') return this.createRandomModule();
    if (name === 'io') return this.createIoModule();
    if (name === 'os') return this.createOsModule();
    if (name === 'string') return this.createStringModule();
    return { kind: 'module', name, attrs: new Map() };
  }

  private createJsonModule(): ModuleVal {
    const attrs = new Map<string, Val>();
    const loads: FuncVal = {
      kind: 'func', name: 'loads', params: [{ name: 's' }], body: [], closure: new Env(),
      _builtin: (args: Val[]) => {
        const s = args[0]?.kind === 'str' ? args[0].value : '';
        try {
          return this.jsToVal(JSON.parse(s));
        } catch {
          throw new PyError('json.JSONDecodeError', 'Invalid JSON');
        }
      },
    } as FuncVal & { _builtin: Function };
    const dumps: FuncVal = {
      kind: 'func', name: 'dumps', params: [{ name: 'obj' }], body: [], closure: new Env(),
      _builtin: (args: Val[]) => mkStr(JSON.stringify(this.valToJs(args[0] ?? NONE))),
    } as FuncVal & { _builtin: Function };
    attrs.set('loads', loads);
    attrs.set('dumps', dumps);
    return { kind: 'module', name: 'json', attrs };
  }

  private createReModule(): ModuleVal {
    const attrs = new Map<string, Val>();
    const findall: FuncVal = {
      kind: 'func', name: 'findall', params: [{ name: 'pattern' }, { name: 'string' }], body: [], closure: new Env(),
      _builtin: (args: Val[]) => {
        const pat = args[0]?.kind === 'str' ? args[0].value : '';
        const str = args[1]?.kind === 'str' ? args[1].value : '';
        try {
          const re = new RegExp(pat, 'g');
          const matches = str.match(re) ?? [];
          return mkList(matches.map(mkStr));
        } catch { return mkList([]); }
      },
    } as FuncVal & { _builtin: Function };
    const search: FuncVal = {
      kind: 'func', name: 'search', params: [{ name: 'pattern' }, { name: 'string' }], body: [], closure: new Env(),
      _builtin: (args: Val[]) => {
        const pat = args[0]?.kind === 'str' ? args[0].value : '';
        const str = args[1]?.kind === 'str' ? args[1].value : '';
        try {
          const re = new RegExp(pat);
          const m = re.exec(str);
          if (!m) return NONE;
          return mkStr(m[0]!);
        } catch { return NONE; }
      },
    } as FuncVal & { _builtin: Function };
    const sub: FuncVal = {
      kind: 'func', name: 'sub', params: [{ name: 'pattern' }, { name: 'repl' }, { name: 'string' }], body: [], closure: new Env(),
      _builtin: (args: Val[]) => {
        const pat = args[0]?.kind === 'str' ? args[0].value : '';
        const repl = args[1]?.kind === 'str' ? args[1].value : '';
        const str = args[2]?.kind === 'str' ? args[2].value : '';
        try { return mkStr(str.replace(new RegExp(pat, 'g'), repl)); } catch { return mkStr(str); }
      },
    } as FuncVal & { _builtin: Function };
    attrs.set('findall', findall);
    attrs.set('search', search);
    attrs.set('sub', sub);
    attrs.set('match', search); // simplified
    return { kind: 'module', name: 're', attrs };
  }

  private createMathModule(): ModuleVal {
    const attrs = new Map<string, Val>();
    attrs.set('pi', mkFloat(Math.PI));
    attrs.set('e', mkFloat(Math.E));
    attrs.set('inf', mkFloat(Infinity));
    const mathFn = (name: string, fn: (n: number) => number, returnInt = false): FuncVal => ({
      kind: 'func', name, params: [{ name: 'x' }], body: [], closure: new Env(),
      _builtin: (args: Val[]) => {
        const r = fn(toNum(args[0] ?? mkInt(0)));
        return returnInt ? mkInt(r) : mkFloat(r);
      },
    } as FuncVal & { _builtin: Function });
    attrs.set('sqrt', mathFn('sqrt', Math.sqrt));
    attrs.set('floor', mathFn('floor', Math.floor, true));
    attrs.set('ceil', mathFn('ceil', Math.ceil, true));
    attrs.set('abs', mathFn('abs', Math.abs));
    attrs.set('log', mathFn('log', Math.log));
    attrs.set('log2', mathFn('log2', Math.log2));
    attrs.set('log10', mathFn('log10', Math.log10));
    attrs.set('sin', mathFn('sin', Math.sin));
    attrs.set('cos', mathFn('cos', Math.cos));
    attrs.set('tan', mathFn('tan', Math.tan));
    attrs.set('pow', {
      kind: 'func', name: 'pow', params: [{ name: 'x' }, { name: 'y' }], body: [], closure: new Env(),
      _builtin: (args: Val[]) => mkFloat(Math.pow(toNum(args[0] ?? mkInt(0)), toNum(args[1] ?? mkInt(0)))),
    } as FuncVal & { _builtin: Function });
    return { kind: 'module', name: 'math', attrs };
  }

  private createRandomModule(): ModuleVal {
    // Use a seeded PRNG for reproducible results
    let seed = 0;
    let state = 0;
    const nextRand = () => {
      // Simple LCG for deterministic random
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return state / 0x7fffffff;
    };
    const attrs = new Map<string, Val>();
    attrs.set('seed', {
      kind: 'func', name: 'seed', params: [{ name: 's' }], body: [], closure: new Env(),
      _builtin: (args: Val[]) => {
        seed = toNum(args[0] ?? mkInt(0));
        state = seed;
        return NONE;
      },
    } as FuncVal & { _builtin: Function });
    attrs.set('randint', {
      kind: 'func', name: 'randint', params: [{ name: 'a' }, { name: 'b' }], body: [], closure: new Env(),
      _builtin: (args: Val[]) => {
        const a = toNum(args[0] ?? mkInt(0));
        const b = toNum(args[1] ?? mkInt(0));
        return mkInt(Math.floor(nextRand() * (b - a + 1)) + a);
      },
    } as FuncVal & { _builtin: Function });
    attrs.set('choice', {
      kind: 'func', name: 'choice', params: [{ name: 'seq' }], body: [], closure: new Env(),
      _builtin: (args: Val[]) => {
        const seq = args[0];
        if (seq?.kind === 'list' || seq?.kind === 'tuple') {
          const idx = Math.floor(nextRand() * seq.items.length);
          return seq.items[idx] ?? NONE;
        }
        return NONE;
      },
    } as FuncVal & { _builtin: Function });
    attrs.set('shuffle', {
      kind: 'func', name: 'shuffle', params: [{ name: 'lst' }], body: [], closure: new Env(),
      _builtin: (args: Val[]) => {
        const lst = args[0];
        if (lst?.kind === 'list') {
          for (let i = lst.items.length - 1; i > 0; i--) {
            const j = Math.floor(nextRand() * (i + 1));
            [lst.items[i], lst.items[j]] = [lst.items[j]!, lst.items[i]!];
          }
        }
        return NONE;
      },
    } as FuncVal & { _builtin: Function });
    attrs.set('random', {
      kind: 'func', name: 'random', params: [], body: [], closure: new Env(),
      _builtin: () => mkFloat(nextRand()),
    } as FuncVal & { _builtin: Function });
    return { kind: 'module', name: 'random', attrs };
  }

  private createIoModule(): ModuleVal {
    const attrs = new Map<string, Val>();
    const self = this;
    // io.StringIO — a simple in-memory text stream
    const stringIOClass: ClassVal = {
      kind: 'class', name: 'StringIO', body: [], env: new Env(),
      methods: new Map(),
      attrs: new Map(),
    };
    // Make StringIO callable (class instantiation)
    const stringIOFactory: FuncVal = {
      kind: 'func', name: 'StringIO', params: [{ name: 'initial' }], body: [], closure: new Env(),
      _builtin: (args: Val[]) => {
        const initial = args[0]?.kind === 'str' ? args[0].value : '';
        const obj: ObjVal = { kind: 'obj', cls: stringIOClass, attrs: new Map() };
        obj.attrs.set('_data', mkStr(initial));
        obj.attrs.set('_pos', mkInt(0));
        obj.attrs.set('read', {
          kind: 'func', name: 'read', params: [], body: [], closure: new Env(),
          _native: () => {
            const data = obj.attrs.get('_data');
            return data?.kind === 'str' ? data : mkStr('');
          },
        } as FuncVal & { _native: Function });
        obj.attrs.set('write', {
          kind: 'func', name: 'write', params: [{ name: 's' }], body: [], closure: new Env(),
          _native: (a: Val[]) => {
            const s = a[0]?.kind === 'str' ? a[0].value : '';
            const current = obj.attrs.get('_data');
            const existing = current?.kind === 'str' ? current.value : '';
            obj.attrs.set('_data', mkStr(existing + s));
            return mkInt(s.length);
          },
        } as FuncVal & { _native: Function });
        obj.attrs.set('getvalue', {
          kind: 'func', name: 'getvalue', params: [], body: [], closure: new Env(),
          _native: () => {
            const data = obj.attrs.get('_data');
            return data?.kind === 'str' ? data : mkStr('');
          },
        } as FuncVal & { _native: Function });
        obj.attrs.set('readlines', {
          kind: 'func', name: 'readlines', params: [], body: [], closure: new Env(),
          _native: () => {
            const data = obj.attrs.get('_data');
            const s = data?.kind === 'str' ? data.value : '';
            return mkList(s.split('\n').map(line => mkStr(line + '\n')));
          },
        } as FuncVal & { _native: Function });
        obj.attrs.set('readline', {
          kind: 'func', name: 'readline', params: [], body: [], closure: new Env(),
          _native: () => {
            const data = obj.attrs.get('_data');
            const pos = obj.attrs.get('_pos');
            const s = data?.kind === 'str' ? data.value : '';
            const p = pos?.kind === 'int' ? pos.value : 0;
            const nextNl = s.indexOf('\n', p);
            if (nextNl < 0) {
              obj.attrs.set('_pos', mkInt(s.length));
              return mkStr(s.substring(p));
            }
            obj.attrs.set('_pos', mkInt(nextNl + 1));
            return mkStr(s.substring(p, nextNl + 1));
          },
        } as FuncVal & { _native: Function });
        return obj;
      },
    } as FuncVal & { _builtin: Function };
    attrs.set('StringIO', stringIOFactory);
    return { kind: 'module', name: 'io', attrs };
  }

  private createOsModule(): ModuleVal {
    const attrs = new Map<string, Val>();
    const path = new Map<string, Val>();
    path.set('join', {
      kind: 'func', name: 'join', params: [{ name: 'a' }, { name: 'b' }], body: [], closure: new Env(),
      _builtin: (args: Val[]) => {
        const parts = args.map(a => a.kind === 'str' ? a.value : pyStr(a));
        return mkStr(parts.join('/'));
      },
    } as FuncVal & { _builtin: Function });
    path.set('exists', {
      kind: 'func', name: 'exists', params: [{ name: 'p' }], body: [], closure: new Env(),
      _builtin: () => mkBool(false),
    } as FuncVal & { _builtin: Function });
    attrs.set('path', { kind: 'module', name: 'os.path', attrs: path });
    return { kind: 'module', name: 'os', attrs };
  }

  private createStringModule(): ModuleVal {
    const attrs = new Map<string, Val>();
    attrs.set('ascii_letters', mkStr('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'));
    attrs.set('ascii_lowercase', mkStr('abcdefghijklmnopqrstuvwxyz'));
    attrs.set('ascii_uppercase', mkStr('ABCDEFGHIJKLMNOPQRSTUVWXYZ'));
    attrs.set('digits', mkStr('0123456789'));
    attrs.set('punctuation', mkStr('!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'));
    return { kind: 'module', name: 'string', attrs };
  }

  private jsToVal(v: unknown): Val {
    if (v === null || v === undefined) return NONE;
    if (typeof v === 'string') return mkStr(v);
    if (typeof v === 'number') return Number.isInteger(v) ? mkInt(v) : mkFloat(v);
    if (typeof v === 'boolean') return mkBool(v);
    if (Array.isArray(v)) return mkList(v.map(i => this.jsToVal(i)));
    if (typeof v === 'object') {
      const entries: [Val, Val][] = Object.entries(v).map(([k, val]) => [mkStr(k), this.jsToVal(val)]);
      return mkDict(entries);
    }
    return mkStr(String(v));
  }

  private valToJs(v: Val): unknown {
    switch (v.kind) {
      case 'str': return v.value;
      case 'int': case 'float': return v.value;
      case 'bool': return v.value;
      case 'none': return null;
      case 'list': case 'tuple': return v.items.map(i => this.valToJs(i));
      case 'dict': { const o: Record<string, unknown> = {}; for (const [k, val] of v.entries) o[pyStr(k)] = this.valToJs(val); return o; }
      default: return pyStr(v);
    }
  }

  private registerBuiltins(): void {
    const env = this.env;
    const self = this;

    const builtin = (name: string, fn: (args: Val[], kw: Map<string, Val>) => Val): void => {
      env.set(name, {
        kind: 'func', name, params: [], body: [], closure: new Env(),
        _builtin: fn,
      } as FuncVal & { _builtin: Function });
    };

    builtin('print', (args, kw) => {
      const sepVal = kw.get('sep');
      const endVal = kw.get('end');
      const sep = sepVal?.kind === 'str' ? sepVal.value : ' ';
      const end = endVal?.kind === 'str' ? endVal.value : '\n';
      const cm = self.makeCallMethod(env);
      self.stdout.push(args.map(a => pyStr(a, cm)).join(sep) + end);
      return NONE;
    });

    builtin('type', (args) => {
      const v = args[0] ?? NONE;
      return { kind: 'type', name: pyTypeName(v) };
    });

    builtin('isinstance', (args) => {
      const obj = args[0] ?? NONE;
      const cls = args[1] ?? NONE;
      if (cls.kind === 'class' && obj.kind === 'obj') {
        if (obj.cls.name === cls.name) return mkBool(true);
        // Check parent chain
        let current: ClassVal | undefined = obj.cls;
        while (current?.parentName) {
          if (current.parentName === cls.name) return mkBool(true);
          const parentVal = env.get(current.parentName);
          current = parentVal?.kind === 'class' ? parentVal : undefined;
        }
        return mkBool(false);
      }
      if (cls.kind === 'type') {
        return mkBool(pyTypeName(obj) === cls.name);
      }
      // Support isinstance(x, dict/list/str/int/float/bool/tuple/set) via builtin name
      const typeMap: Record<string, string> = { dict: 'dict', list: 'list', str: 'str', int: 'int', float: 'float', bool: 'bool', tuple: 'tuple', set: 'set' };
      const clsName = cls.kind === 'class' ? cls.name : cls.kind === 'func' ? cls.name : '';
      const expected = typeMap[clsName];
      if (expected) return mkBool(pyTypeName(obj) === expected);
      return mkBool(false);
    });

    builtin('hasattr', (args) => {
      const obj = args[0] ?? NONE;
      const name = args[1]?.kind === 'str' ? args[1].value : '';
      if (obj.kind === 'obj') return mkBool(obj.attrs.has(name) || obj.cls.methods.has(name));
      return mkBool(false);
    });

    builtin('getattr', (args) => {
      const obj = args[0] ?? NONE;
      const name = args[1]?.kind === 'str' ? args[1].value : '';
      const def = args[2];
      try {
        return self.parser.getAttr(obj, name, env);
      } catch {
        return def ?? NONE;
      }
    });

    builtin('len', (args) => {
      const v = args[0] ?? NONE;
      if (v.kind === 'str') return mkInt(v.value.length);
      if (v.kind === 'list' || v.kind === 'tuple' || v.kind === 'set') return mkInt(v.items.length);
      if (v.kind === 'dict') return mkInt(v.entries.length);
      throw new PyError('TypeError', `object of type '${pyTypeName(v)}' has no len()`);
    });

    builtin('int', (args) => {
      const v = args[0] ?? mkInt(0);
      if (v.kind === 'int') return v;
      if (v.kind === 'float') return mkInt(Math.trunc(v.value));
      if (v.kind === 'bool') return mkInt(v.value ? 1 : 0);
      if (v.kind === 'str') {
        const base = args[1]?.kind === 'int' ? args[1].value : 10;
        const n = parseInt(v.value.trim(), base);
        if (isNaN(n)) throw new PyError('ValueError', `invalid literal for int() with base ${base}: '${v.value}'`);
        return mkInt(n);
      }
      throw new PyError('TypeError', `int() argument must be a string or a number, not '${pyTypeName(v)}'`);
    });

    builtin('float', (args) => {
      const v = args[0] ?? mkFloat(0);
      if (v.kind === 'float') return v;
      if (v.kind === 'int') return mkFloat(v.value);
      if (v.kind === 'bool') return mkFloat(v.value ? 1.0 : 0.0);
      if (v.kind === 'str') {
        const n = parseFloat(v.value.trim());
        if (isNaN(n) && v.value.trim() !== 'nan') throw new PyError('ValueError', `could not convert string to float: '${v.value}'`);
        return mkFloat(n);
      }
      throw new PyError('TypeError', `float() argument must be a string or a number, not '${pyTypeName(v)}'`);
    });

    builtin('str', (args) => {
      if (args.length === 0) return mkStr('');
      return mkStr(pyStr(args[0]!, self.makeCallMethod(env)));
    });

    builtin('bool', (args) => {
      if (args.length === 0) return mkBool(false);
      return mkBool(pyBool(args[0]!));
    });

    builtin('abs', (args) => {
      const v = args[0] ?? mkInt(0);
      if (v.kind === 'int') return mkInt(Math.abs(v.value));
      if (v.kind === 'float') return mkFloat(Math.abs(v.value));
      throw new PyError('TypeError', `bad operand type for abs(): '${pyTypeName(v)}'`);
    });

    builtin('round', (args) => {
      const v = args[0] ?? mkFloat(0);
      const ndigits = args[1]?.kind === 'int' ? args[1].value : 0;
      const n = toNum(v);
      const factor = Math.pow(10, ndigits);
      const rounded = Math.round(n * factor) / factor;
      return ndigits > 0 ? mkFloat(rounded) : mkInt(Math.round(n));
    });

    builtin('min', (args) => {
      const items = args.length === 1 && (args[0]?.kind === 'list' || args[0]?.kind === 'tuple') ? args[0].items : args;
      if (items.length === 0) throw new PyError('ValueError', 'min() arg is an empty sequence');
      return items.reduce((a, b) => pyLt(a, b) ? a : b);
    });

    builtin('max', (args) => {
      const items = args.length === 1 && (args[0]?.kind === 'list' || args[0]?.kind === 'tuple') ? args[0].items : args;
      if (items.length === 0) throw new PyError('ValueError', 'max() arg is an empty sequence');
      return items.reduce((a, b) => pyLt(b, a) ? a : b);
    });

    builtin('sum', (args) => {
      const items = args[0];
      const start = args[1] ?? mkInt(0);
      if (!items) return start;
      const iterable = self.parser.getIterable(items);
      return iterable.reduce((acc: Val, item) => {
        return (self.parser as any).applyBinOp('+', acc, item);
      }, start);
    });

    builtin('range', (args) => {
      let start = 0, stop = 0, step = 1;
      if (args.length === 1) { stop = toNum(args[0]!); }
      else if (args.length === 2) { start = toNum(args[0]!); stop = toNum(args[1]!); }
      else if (args.length >= 3) { start = toNum(args[0]!); stop = toNum(args[1]!); step = toNum(args[2]!); }
      if (step === 0) throw new PyError('ValueError', 'range() arg 3 must not be zero');
      const items: Val[] = [];
      if (step > 0) { for (let i = start; i < stop; i += step) items.push(mkInt(i)); }
      else { for (let i = start; i > stop; i += step) items.push(mkInt(i)); }
      return mkList(items);
    });

    builtin('enumerate', (args) => {
      const iter = args[0];
      const start = args[1]?.kind === 'int' ? args[1].value : 0;
      const items = self.parser.getIterable(iter ?? mkList([]));
      return mkList(items.map((item, idx) => mkTuple([mkInt(idx + start), item])));
    });

    builtin('zip', (args) => {
      const iters = args.map(a => self.parser.getIterable(a));
      const minLen = Math.min(...iters.map(i => i.length));
      const items: Val[] = [];
      for (let i = 0; i < minLen; i++) {
        items.push(mkTuple(iters.map(iter => iter[i] ?? NONE)));
      }
      return mkList(items);
    });

    builtin('sorted', (args, kw) => {
      const iter = args[0] ?? mkList([]);
      const items = [...self.parser.getIterable(iter)];
      const keyFn = kw.get('key') ?? args[1];
      const reverse = kw.get('reverse');
      if (keyFn?.kind === 'func') {
        items.sort((a, b) => {
          const ka = self.callValue(keyFn, [a], new Map(), env);
          const kb = self.callValue(keyFn, [b], new Map(), env);
          if (pyEqual(ka, kb)) return 0;
          return pyLt(ka, kb) ? -1 : 1;
        });
      } else {
        items.sort((a, b) => {
          if (pyEqual(a, b)) return 0;
          try { return pyLt(a, b) ? -1 : 1; } catch { return 0; }
        });
      }
      if (reverse && pyBool(reverse)) items.reverse();
      return mkList(items);
    });

    builtin('reversed', (args) => {
      const iter = args[0] ?? mkList([]);
      return mkList([...self.parser.getIterable(iter)].reverse());
    });

    builtin('list', (args) => {
      if (args.length === 0) return mkList([]);
      const v = args[0]!;
      if (v.kind === 'list') return mkList([...v.items]);
      return mkList(self.parser.getIterable(v));
    });

    builtin('tuple', (args) => {
      if (args.length === 0) return mkTuple([]);
      const v = args[0]!;
      return mkTuple(self.parser.getIterable(v));
    });

    builtin('set', (args) => {
      if (args.length === 0) return mkSet([]);
      const v = args[0]!;
      const items = self.parser.getIterable(v);
      const unique: Val[] = [];
      for (const item of items) {
        if (!unique.some(u => pyEqual(u, item))) unique.push(item);
      }
      return mkSet(unique);
    });

    builtin('dict', (args) => {
      if (args.length === 0) return mkDict([]);
      const v = args[0]!;
      if (v.kind === 'dict') return mkDict([...v.entries]);
      if (v.kind === 'list') {
        const entries: [Val, Val][] = v.items.map(item => {
          if (item.kind === 'tuple' || item.kind === 'list') return [item.items[0] ?? NONE, item.items[1] ?? NONE] as [Val, Val];
          return [item, NONE] as [Val, Val];
        });
        return mkDict(entries);
      }
      return mkDict([]);
    });

    builtin('map', (args) => {
      const fn = args[0];
      const iter = args[1] ?? mkList([]);
      if (!fn) return mkList([]);
      const items = self.parser.getIterable(iter);
      return mkList(items.map(item => self.callValue(fn, [item], new Map(), env)));
    });

    builtin('filter', (args) => {
      const fn = args[0];
      const iter = args[1] ?? mkList([]);
      const items = self.parser.getIterable(iter);
      if (!fn || fn.kind === 'none') return mkList(items.filter(item => pyBool(item)));
      return mkList(items.filter(item => pyBool(self.callValue(fn, [item], new Map(), env))));
    });

    builtin('input', (args) => {
      // Don't print prompt to stdout — challenge runner compares stdout directly
      return mkStr(self.inputQueue.shift() ?? '');
    });

    builtin('id', (_args) => mkInt(Math.floor(Math.random() * 1000000)));

    builtin('hex', (args) => mkStr('0x' + (toNum(args[0] ?? mkInt(0))).toString(16)));
    builtin('oct', (args) => mkStr('0o' + (toNum(args[0] ?? mkInt(0))).toString(8)));
    builtin('bin', (args) => mkStr('0b' + (toNum(args[0] ?? mkInt(0))).toString(2)));
    builtin('chr', (args) => mkStr(String.fromCharCode(toNum(args[0] ?? mkInt(0)))));
    builtin('ord', (args) => mkInt(args[0]?.kind === 'str' ? args[0].value.charCodeAt(0) : 0));

    builtin('repr', (args) => mkStr(pyRepr(args[0] ?? NONE, self.makeCallMethod(env))));

    builtin('any', (args) => {
      const items = self.parser.getIterable(args[0] ?? mkList([]));
      return mkBool(items.some(pyBool));
    });

    builtin('all', (args) => {
      const items = self.parser.getIterable(args[0] ?? mkList([]));
      return mkBool(items.every(pyBool));
    });

    builtin('next', (args) => {
      const gen = args[0];
      const defaultVal = args[1];
      if (gen?.kind === 'generator') {
        if (gen.items && gen.index !== undefined) {
          if (gen.index < gen.items.length) {
            const val = gen.items[gen.index]!;
            (gen as any).index = gen.index + 1;
            return val;
          }
        }
        if (gen.iter) {
          const result = gen.iter.next();
          if (!result.done) return result.value;
        }
        if (defaultVal !== undefined) return defaultVal;
        throw new PyError('StopIteration', '');
      }
      if (defaultVal !== undefined) return defaultVal;
      throw new PyError('StopIteration', '');
    });

    // super() — simplified
    builtin('super', () => {
      // Search the envStack for 'self'
      let selfObj: Val | undefined;
      for (let i = self.envStack.length - 1; i >= 0; i--) {
        selfObj = self.envStack[i]!.get('self');
        if (selfObj?.kind === 'obj') break;
      }
      if (!selfObj) selfObj = env.get('self');
      if (selfObj?.kind === 'obj' && selfObj.cls.parentName) {
        const parentCls = env.get(selfObj.cls.parentName) ?? self.env.get(selfObj.cls.parentName);
        if (parentCls?.kind === 'class') {
          // Create a proxy that binds methods from parent class to self
          const superObj: ObjVal = { kind: 'obj', cls: parentCls, attrs: selfObj.attrs };
          return superObj;
        }
      }
      return NONE;
    });

    // Exception types as proper classes
    const exceptionTypes = [
      'Exception', 'BaseException', 'ValueError', 'TypeError', 'KeyError',
      'IndexError', 'AttributeError', 'NameError', 'RuntimeError',
      'ZeroDivisionError', 'FileNotFoundError', 'IOError', 'OSError',
      'StopIteration', 'NotImplementedError', 'OverflowError',
      'ImportError', 'ModuleNotFoundError', 'PermissionError',
      'ConnectionError', 'TimeoutError', 'ArithmeticError', 'AssertionError',
    ];
    for (const exName of exceptionTypes) {
      const initFunc: FuncVal = {
        kind: 'func', name: '__init__', params: [{ name: 'self' }, { name: 'message', defaultVal: mkStr('') }],
        body: [], closure: new Env(),
        _builtin: (args: Val[]) => {
          // self is the first arg (from bound method call)
          // message is in args[0] after self is bound
          return NONE;
        },
      } as FuncVal & { _builtin: Function };
      const strFunc: FuncVal = {
        kind: 'func', name: '__str__', params: [{ name: 'self' }],
        body: [], closure: new Env(),
      } as FuncVal;
      (strFunc as any)._builtin = (_args: Val[], _kw: Map<string, Val>, _callEnv?: Env, boundSelf?: Val) => {
        // boundSelf is passed from makeCallMethod via __self__ binding
        if (boundSelf?.kind === 'obj') {
          const msg = boundSelf.attrs.get('message');
          if (msg) return msg;
        }
        // Fallback: check envStack
        for (let i = self.envStack.length - 1; i >= 0; i--) {
          const selfObj = self.envStack[i]!.get('self');
          if (selfObj?.kind === 'obj') {
            const msg = selfObj.attrs.get('message');
            if (msg) return msg;
          }
        }
        return mkStr('');
      };
      const methods = new Map<string, FuncVal>([['__init__', initFunc], ['__str__', strFunc]]);
      const parentName = exName === 'BaseException' ? undefined : exName === 'Exception' ? 'BaseException' : 'Exception';
      const exCls: ClassVal = {
        kind: 'class', name: exName, body: [], env: new Env(), methods, attrs: new Map(),
        ...(parentName !== undefined ? { parentName } : {}),
      };
      // Override __init__ to store message on self
      const realInit: FuncVal = {
        kind: 'func', name: '__init__', params: [{ name: 'self' }, { name: '*args' }],
        body: [], closure: new Env(),
      } as FuncVal;
      (realInit as any)._builtin = (args: Val[], _kw: Map<string, Val>, _callEnv?: Env, boundSelf?: Val) => {
        // Find self from boundSelf, envStack, or fallback
        let selfObj: Val | undefined = boundSelf;
        if (!selfObj || selfObj.kind !== 'obj') {
          for (let i = self.envStack.length - 1; i >= 0; i--) {
            selfObj = self.envStack[i]!.get('self');
            if (selfObj?.kind === 'obj') break;
          }
        }
        if (selfObj?.kind === 'obj') {
          const msg = args.length > 0 ? pyStr(args[0]!) : '';
          selfObj.attrs.set('message', mkStr(msg));
          selfObj.attrs.set('args', mkTuple(args));
        }
        return NONE;
      };
      exCls.methods.set('__init__', realInit);
      env.set(exName, exCls);
    }
  }
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export class MiniPythonEvaluator {
  private executor = new Executor();

  queueInput(value: string): void {
    this.executor.queueInput(value);
  }

  execute(code: string): { stdout: string; success: boolean; error?: { type: string; message: string; line?: number } } {
    return this.executor.execute(code);
  }
}
