import { describe, it, expect } from 'vitest';
import { MiniPythonEvaluator } from '../MiniPythonEvaluator';

describe('MiniPythonEvaluator', () => {
  function run(code: string): string {
    const evaluator = new MiniPythonEvaluator();
    const result = evaluator.execute(code);
    return result.stdout.trim();
  }

  describe('Chapter 1: Basics', () => {
    it('ch01_01 hello world', () => {
      expect(run('print("Hello, World!")')).toBe('Hello, World!');
    });

    it('ch01_02 variables', () => {
      expect(run('alias = "Ghost"\nprint("Alias:", alias)')).toBe('Alias: Ghost');
    });

    it('ch01_03 math ops', () => {
      expect(run('access_level = 7\noffset = 3\nsecurity_code = access_level * 10 + offset\nprint(security_code)')).toBe('73');
    });

    it('ch01_04 types', () => {
      expect(run('codename = "Viper"\nclearance = 5\nprint(type(codename))\nprint(type(clearance))')).toBe("<class 'str'>\n<class 'int'>");
    });

    it('ch01_05 float math', () => {
      expect(run('celsius = 100\nfahrenheit = (celsius * 9/5) + 32\nprint(fahrenheit)')).toBe('212.0');
    });

    it('ch01_06 string concat', () => {
      expect(run('first_name = "Aleksa"\nlast_name = "Volkov"\nfull_name = first_name + " " + last_name\nprint(full_name)')).toBe('Aleksa Volkov');
    });
  });

  describe('Chapter 2: Strings', () => {
    it('string methods upper/lower/title', () => {
      expect(run('s = "shadow wolf"\nprint(s.upper())\nprint(s.lower())\nprint(s.title())')).toBe('SHADOW WOLF\nshadow wolf\nShadow Wolf');
    });

    it('f-strings', () => {
      expect(run('name = "Agent"\nprint(f"Welcome, {name}!")')).toBe('Welcome, Agent!');
    });

    it('type conversion int()', () => {
      expect(run('s = "42"\nn = int(s)\nprint(n + 8)')).toBe('50');
    });

    it('string slicing', () => {
      expect(run('s = "CLASSIFIED"\nprint(s[0:5])')).toBe('CLASS');
    });
  });

  describe('Chapter 3: Control Flow', () => {
    it('if/else true branch', () => {
      expect(run('locked = True\nif locked:\n    print("Locked")\nelse:\n    print("Open")')).toBe('Locked');
    });

    it('if/elif/else', () => {
      expect(run('c = 3\nif c >= 5:\n    print("Top")\nelif c >= 3:\n    print("Mid")\nelse:\n    print("Low")')).toBe('Mid');
    });

    it('boolean operators', () => {
      expect(run('a = True\nb = False\nprint(a and b)\nprint(a or b)\nprint(not b)')).toBe('False\nTrue\nTrue');
    });
  });

  describe('Chapter 4: Loops', () => {
    it('for range', () => {
      expect(run('for i in range(3):\n    print(f"Camera {i}")')).toBe('Camera 0\nCamera 1\nCamera 2');
    });

    it('while loop', () => {
      expect(run('c = 3\nwhile c > 0:\n    print(f"T-{c}...")\n    c -= 1\nprint("Launch!")')).toBe('T-3...\nT-2...\nT-1...\nLaunch!');
    });

    it('for with list accumulation', () => {
      expect(run('nums = [10, 20, 30]\ntotal = 0\nfor n in nums:\n    total += n\nprint(total)')).toBe('60');
    });
  });

  describe('Chapter 5: Functions', () => {
    it('basic function', () => {
      expect(run('def greet(name):\n    return f"Hello, {name}!"\nprint(greet("Agent"))')).toBe('Hello, Agent!');
    });

    it('function with default params', () => {
      expect(run('def power(base, exp=2):\n    return base ** exp\nprint(power(3))\nprint(power(2, 10))')).toBe('9\n1024');
    });

    it('lambda and sorted', () => {
      expect(run('pairs = [(1, "b"), (3, "a"), (2, "c")]\nresult = sorted(pairs, key=lambda x: x[1])\nfor p in result:\n    print(p[1])')).toBe('a\nb\nc');
    });
  });

  describe('Chapter 6: Data Structures', () => {
    it('dictionary', () => {
      expect(run('d = {"name": "Aleksa", "rank": 5}\nprint(d["name"])\nprint(d["rank"])')).toBe('Aleksa\n5');
    });

    it('list comprehension', () => {
      expect(run('nums = [1, 2, 3, 4, 5]\nevens = [x for x in nums if x % 2 == 0]\nprint(evens)')).toBe('[2, 4]');
    });
  });

  describe('Chapter 7-8: Advanced', () => {
    it('try/except', () => {
      expect(run('try:\n    x = int("abc")\nexcept ValueError:\n    print("Invalid")')).toBe('Invalid');
    });

    it('string split and join', () => {
      expect(run('msg = "a:b:c"\nparts = msg.split(":")\nprint(" | ".join(parts))')).toBe('a | b | c');
    });
  });

  describe('Chapter 9-10: OOP', () => {
    it('basic class', () => {
      expect(run('class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return f"{self.name} says Woof!"\nd = Dog("Rex")\nprint(d.bark())')).toBe('Rex says Woof!');
    });
  });
});
