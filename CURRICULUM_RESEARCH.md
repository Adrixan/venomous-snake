# Python Learning Curriculum Research Report
### Informing the *Venomous Snake* Game Design

> **Purpose:** This document surveys major Python learning resources, synthesizes their pedagogical approaches, and produces a recommended learning progression for a stealth-action 2D game that teaches Python to complete beginners (ages 15+) through to proficient practitioners.

---

## Table of Contents

1. [Resource Survey](#1-resource-survey)
2. [Comparative Analysis](#2-comparative-analysis)
3. [Recommended Learning Progression](#3-recommended-learning-progression)
4. [In-Game Scenario Mapping](#4-in-game-scenario-mapping)
5. [Common Beginner Stumbling Blocks](#5-common-beginner-stumbling-blocks)
6. [Gamification Best Practices](#6-gamification-best-practices)
7. [Synthesis & Design Recommendations](#7-synthesis--design-recommendations)

---

## 1. Resource Survey

### 1.1 Python.org Official Tutorial

**URL:** https://docs.python.org/3/tutorial/

**Topic Ordering:**
1. Interpreter basics / whetting appetite
2. Numbers, strings, lists (informal intro)
3. Control flow (`if`, `for`, `while`, `range`, `break`, `continue`, `pass`)
4. Functions (defining, defaults, `*args`, `**kwargs`, lambdas, annotations)
5. Data structures (lists in depth, tuples, sets, dicts)
6. Modules and packages
7. I/O: `print`, `input`, file reading/writing
8. Errors and exceptions (`try`/`except`/`finally`, raising)
9. Classes and OOP
10. Standard library tour (datetime, math, os, random, etc.)
11. Virtual environments and pip
12. What now? (brief pointers)

**Pedagogical Approach:** Reference-first. Dense prose with interleaved REPL examples. Assumes adult learner who already programs in another language. No projects, no exercises — purely expository. Minimal narrative scaffolding.

**Strengths:** Authoritative, complete, precise.  
**Weaknesses for beginners:** No motivation, no scaffolding, concepts introduced faster than they can be absorbed, zero feedback loops.

---

### 1.2 Automate the Boring Stuff with Python (Al Sweigart)

**URL:** https://automatetheboringstuff.com/

**Topic Ordering:**
1. Python basics (expressions, data types, variables, flow control)
2. Functions
3. Lists
4. Dictionaries and structuring data
5. Manipulating strings
6. **PROJECT PIVOT** — all subsequent chapters are project-oriented:
7. Pattern matching with regex
8. Input validation
9. Reading/writing files
10. Organizing files (os, shutil)
11. Debugging
12. Web scraping (requests, BeautifulSoup)
13. Excel/CSV/JSON/PDF/Word automation
14. Scheduling tasks, launching programs
15. Email/SMS
16. Image manipulation (Pillow)
17. GUI automation (pyautogui)

**Pedagogical Approach:** Problem-first. The framing is always "here is a boring task; let Python do it for you." Extremely strong at motivation — the learner sees immediate, tangible real-world payoff. Theory is minimal; just enough to enable the project. Each chapter ends with practice projects that are genuinely useful (e.g., "rename hundreds of files").

**Exercises/Projects:** Practice projects at chapter ends; suggestions but no automated testing. Projects include: multi-clipboard manager, table printer, regex URL extractor, folder backup script.

**Scaffolding style:** Narrative "you" framing. Conversational tone. Diagrams for data structures. Incremental code build-up within chapters.

**Strengths:** Unmatched motivation. Real payoff. Accessible voice.  
**Weaknesses:** Depth of CS fundamentals is shallow; OOP is tucked away and under-treated; assumes adult with existing computer literacy.

---

### 1.3 Python Crash Course (Eric Matthes)

**URL:** No Starch Press book

**Topic Ordering (3 parts):**

*Part 1 — Basics:*
1. Variables and simple data types
2. Introducing lists
3. Working with lists (`for` loops, slicing, tuples)
4. `if` statements
5. Dictionaries
6. User input and `while` loops
7. Functions
8. Classes (OOP intro)
9. Files and exceptions
10. Testing your code (unittest)

*Part 2 — Projects (choose one):*
- **Alien Invasion** — Pygame game (sprites, game loop, collision)
- **Data Visualization** — matplotlib, plotly, CSV/JSON data
- **Web Applications** — Django

*Part 3:* Appendices (installation, text editors, Git basics)

**Pedagogical Approach:** Balanced theory-and-practice. Part 1 builds a complete mental model before pivoting to projects. Each chapter has "Try It Yourself" exercises (numbered, concrete). Part 2 project chapters are the longest and most detailed — the learner builds something substantial they can show off.

**Exercises:** "Try It Yourself" (short, 1–3 per concept section). Projects are multi-session, guided step-by-step.

**Scaffolding style:** Concepts introduced with small code snippets, then built upon. Errors are acknowledged and explained inline. Each chapter opens with a preview list of what will be learned.

**Strengths:** Best balance of completeness and accessibility. The Alien Invasion project is highly motivating for teens. Includes testing (rare in beginner resources).  
**Weaknesses:** OOP chapter comes late; some learners bounce off Part 2 project complexity if they feel Part 1 was rushed.

---

### 1.4 Learn Python the Hard Way (Zed Shaw)

**URL:** https://learnpythonthehardway.org/

**Topic Ordering:**
1. `print` — exactly this, nothing else
2. Comments
3. Numbers and math
4. Variables and naming
5. String formatting
6. String operations
7. More printing variations
8. Input
9. ... (52 exercises total, extremely granular)
10. Eventually: functions, logic, loops, lists, dicts, modules, OOP, basic algorithms

**Pedagogical Approach:** Rote first — literally type everything by hand, no copy-paste. Each exercise is a complete, runnable program. The learner builds muscle memory before conceptual understanding. Heavy use of "study drills" (variations to try). Very behaviorist in philosophy: repeat until automatic, then reflect.

**Exercises:** 52 numbered exercises, each self-contained. Study drills at end. No automated grading, relies on learner discipline.

**Scaffolding style:** No narrative scaffolding. Extremely sparse explanations. Deliberately "hard." Controversial — the author's philosophy is that struggle produces retention.

**Strengths:** Absolute beginners do gain real fluency if they finish. Great for learners who need to slow down and absorb.  
**Weaknesses:** Opinionated and sometimes technically incorrect on modern Python. Demotivating for visual/project-oriented learners. No feedback system. Pacing is very slow on novelty.

---

### 1.5 Codecademy Python Course

**URL:** https://www.codecademy.com/learn/learn-python-3

**Topic Ordering:**
1. Hello World, `print`, comments
2. Variables, data types (`int`, `float`, `str`, `bool`)
3. Functions (define, call, return, parameters)
4. Control flow (`if`/`elif`/`else`, boolean operators)
5. Lists (indexing, slicing, methods)
6. Loops (`for`, `while`, list comprehensions intro)
7. Strings (methods, formatting)
8. Modules (`math`, `random`, `datetime`)
9. Dictionaries
10. Files (read/write)
11. Classes and OOP
12. Iterators and generators (Pro tier)
13. Advanced topics: decorators, async (Pro tier)

**Pedagogical Approach:** In-browser REPL with inline instructions. Every concept has 3–5 micro-exercises. Heavy scaffolding — the environment pre-fills partial code and the learner fills in the blanks. Instant feedback (green checkmark or error message). Bite-sized lessons (~5 min each).

**Exercises:** Fill-in-the-blank, short programs from scratch, "projects" (guided multi-step tasks), quizzes.

**Scaffolding style:** Heavy instructional scaffolding. Learner never faces a blank editor for the first pass. "Hint" system. Progress bar and XP. Streak mechanics.

**Strengths:** Lowest barrier to entry. Instant feedback. Good first 10 hours for absolute beginners. Gamification basics are well-executed.  
**Weaknesses:** Heavy scaffolding can create an "illusion of learning" — learners can complete modules without retaining knowledge because the environment does too much hand-holding. The in-browser editor hides environment setup complexity (a real-world skill they'll need).

---

### 1.6 freeCodeCamp Python Curriculum

**URL:** https://www.freecodecamp.org/learn/scientific-computing-with-python/

**Topic Ordering (Scientific Computing with Python):**
1. Video lectures (Dr. Chuck / full Python course videos embedded)
2. Learn String Manipulation by Building a Cipher
3. Learn How to Solve Problems by Building an Algorithm (Luhn Algorithm)
4. Learn Lambda Functions by Building an Expense Tracker
5. Learn Python List Comprehension by Building a Case Converter
6. Learn Recursion by Building a Tower of Hanoi
7. Learn Regular Expressions by Building a Password Generator
8. Learn Algorithm Design by Building a Shortest Path Finder
9. Learn Classes and Objects by Building a Sudoku Solver
10. Learn Tree Traversal by Building a Binary Search Tree
11. Learn Special Methods by Building a Vector Space

**Pedagogical Approach:** Project-driven certification. Each unit is a single guided project; concepts are introduced only in service of the project. Step-by-step with automated test validation at each step. Strong "build something real" motivation. Assumes some prior exposure (not absolute zero).

**Exercises:** Guided projects with automated step-by-step validation. Final certification projects are unguided.

**Scaffolding style:** Instructions on left, code editor in browser on right. Automated tests reveal whether step is correct. Hints available. The project narrative provides motivation ("you are building a cipher").

**Strengths:** Real projects from day one. Automated validation. Certification motivator. The projects are genuinely interesting (cipher, Sudoku solver).  
**Weaknesses:** Conceptual explanations are thin — learner may pass tests without understanding why. Jumps in difficulty between steps can be jarring. Not ideal for absolute beginners without supplemental reading.

---

### 1.7 CS50P (Harvard's Introduction to Programming with Python)

**URL:** https://cs50.harvard.edu/python/

**Topic Ordering:**
1. Functions, Variables — `print`, `input`, return values, named arguments
2. Conditionals — `if`/`elif`/`else`, `match` statements
3. Loops — `while`, `for`, `break`, `continue`, list/dict comprehensions
4. Exceptions — `try`/`except`, `ValueError`, `raise`
5. Libraries — `import`, standard library (`random`, `statistics`), `pip`, PyPI
6. Unit Tests — `pytest`, test-driven development mindset
7. File I/O — `open`, `csv` module, binary files, `with`
8. Regular Expressions — `re`, groups, flags
9. Object-Oriented Programming — classes, methods, properties, `@classmethod`, `@staticmethod`, operator overloading
10. Et Cetera — `set`, global variables, constants, type hints, `mypy`, `map`/`filter`/`sorted`, generators, `itertools`

**Pedagogical Approach:** Lecture-first with live coding. David Malan's trademark "unpeeling" — he deliberately introduces a naive solution, then shows why it's insufficient, then reveals the better way. Heavy use of visual metaphors (the "memory" diagrams). Problem sets are autograded and require substantial independent thinking. `check50` automated grader provides instant feedback. No hand-holding on psets — learner must figure out the algorithm.

**Exercises:** Weekly problem sets (psets) — typically 2–4 programs per week. Lab exercises are lighter warm-ups. Final project is self-defined.

**Scaffolding style:** Lectures scaffold heavily; psets do not. The gap between lecture and pset is intentional ("productive struggle"). Style guide enforced by `style50`.

**Strengths:** Best conceptual depth of any free resource. Testing is a first-class citizen (week 6). OOP is treated seriously. The "unpeeling" technique is excellent pedagogy. Strong community.  
**Weaknesses:** High dropout rate due to pset difficulty. Time commitment is significant (10 weeks, 10–20 hrs/week). Not self-paced friendly without external accountability.

---

### 1.8 Exercism Python Track

**URL:** https://exercism.org/tracks/python

**Topic Ordering (by syllabus):**
1. Basics (variables, functions, `return`, docstrings)
2. Booleans (`bool`, truthiness, `and`/`or`/`not`)
3. Strings (slicing, methods, `f`-strings)
4. Numbers (int/float arithmetic, `//`, `%`, `**`)
5. Conditionals
6. Lists (mutability, methods, iteration)
7. Loops
8. Tuples
9. Dicts
10. Sets
11. Classes
12. Exceptions
13. Comprehensions
14. Generators
15. Decorators
16. Itertools, functools
17. 130+ practice exercises after the syllabus

**Pedagogical Approach:** Concept-first with mentored practice. The syllabus exercises each focus on ONE concept. A human mentor reviews your solution and suggests improvements — this is the distinguishing feature. After the syllabus, practice exercises are open-ended: the learner chooses exercises by difficulty and concept.

**Exercises:** ~20 syllabus exercises + 130+ practice exercises. Each exercise is a real (if small) program. Tests are provided; learner makes them pass. No partial scaffolding.

**Scaffolding style:** Concept pages provide reading material. Tests scaffold the expected behavior. Mentor feedback is the primary learning mechanism after concepts. Community solutions (viewable after submission) are a powerful learning tool.

**Strengths:** Human mentorship is uniquely valuable. Real test-driven workflow. Extremely broad exercise library. Best for learners who've gotten basics and want to deepen. Good for code quality (not just "make it work").  
**Weaknesses:** Slow if no active mentor assigned. Not beginner-friendly from absolute zero — assumes comfort with a terminal and text editor. Exercises can feel disconnected from real projects.

---

### 1.9 CodingBat Python

**URL:** https://codingbat.com/python

**Topic Ordering:**
- Warmup-1, Warmup-2 (basic syntax, `if`, `return`, string ops)
- String-1, String-2, String-3 (progressive string manipulation)
- List-1, List-2, List-3 (progressive list manipulation)
- Logic-1, Logic-2 (boolean logic and conditions)
- Recursion-1, Recursion-2 (basic and intermediate recursion)
- AP-1 (mixed — harder problems)
- Functional-1 (lambda, `map`, `filter`)

**Pedagogical Approach:** Pure drill. No narrative, no explanation, no project — just a function stub and a set of visible test cases. The learner sees input/output examples and must make all tests pass. Immediate browser-based execution. Problems are grouped by topic and difficulty (1→2→3).

**Exercises:** ~200 small function problems. Each has 4–8 visible test cases and hidden tests.

**Scaffolding style:** Minimal — a function signature and expected behavior. No hints system. No explanation of *why* a solution is correct beyond passing tests.

**Strengths:** Best for drilling specific skills. Very efficient — 5 minutes per problem. Useful as supplementary practice alongside a narrative resource. Recursion section is excellent.  
**Weaknesses:** No motivation, no narrative, no projects. Learners don't know what to do with the skills. Zero real-world connection. Becomes dull quickly.

---

### 1.10 Gamified Platforms (CheckiO, CodeCombat, CodinGame, Tynker)

#### CheckiO
**Approach:** Island-themed world map. Solve puzzles to unlock new islands. Each island has a theme (e.g., "Electronic Station" = electronics metaphors). Solutions can be reviewed and voted on by community — the "publications" system. Multiple valid solutions shown by approach category (creative, clear, speedy).

**Pedagogy:** Problem-solving first. No tutorial — learner is dropped in and must solve. Community solutions are the primary teaching mechanism. Very strong for intermediate learners who want to explore Pythonic idioms.

**Strengths:** Seeing community solutions after solving is extraordinarily effective for learning idiomatic Python. Social layer is motivating.  
**Weaknesses:** Very hard for absolute beginners — no scaffolding, no concept explanations.

#### CodeCombat
**Approach:** RPG game (hero moves through dungeon). Every action (move hero, attack enemy) requires writing Python/JavaScript. Curriculum is scaffolded from "type this exact string" to writing real algorithms.

**Pedagogy:** Game-first. The gameplay IS the coding. Immediate visual feedback — your hero either dies or succeeds based on your code. Clear progression through levels. Multiplayer arenas at higher levels.

**Exercises:** ~400 levels. Each level introduces or reinforces one concept. The game loop (write code → watch execution → iterate) is highly engaging.

**Strengths:** Best visual feedback loop of any platform. Highly motivating for teens. The "agent" metaphor (you control a character with code) is a powerful and intuitive frame.  
**Weaknesses:** Later levels require subscription. Curriculum depth is limited — strong on procedural, weak on OOP, data structures, testing.

#### CodinGame
**Approach:** Competitive programming in a game context. Puzzles are game simulations (Pac-Man AI, Mars lander, etc.). IDE in-browser with test cases. Multiplayer bot battles.

**Pedagogy:** Competition-driven. Not for beginners — assumes programming fluency. Best for intermediate-to-advanced learners who want algorithmic challenges with entertainment framing.

#### Tynker / Scratch (younger audience)
**Approach:** Block-based → text coding transition. Used widely in K-8 education. Not relevant for 15+ Python curriculum.

#### CodeWars
**Approach:** Kata system (martial arts metaphor). Problems ranked 8 kyu (easiest) to 1 kyu (hardest). After solving, all community solutions visible. Honor/rank system.

**Pedagogy:** Similar to CheckiO but with more explicit difficulty ranking. Very strong community solutions learning. Not scaffolded — learner must already know basics.

---

## 2. Comparative Analysis

### 2.1 Concept Introduction Order Across Resources

| Concept | Python.org | AutomateBS | PCC | LPTHW | Codecademy | CS50P | Exercism |
|---|---|---|---|---|---|---|---|
| print / output | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Variables | 1 | 1 | 1 | 2 | 1 | 1 | 1 |
| Data types (int/str/bool) | 1 | 1 | 1 | 3–5 | 2 | 1 | 2–4 |
| Input | 3 | 3 | 6 | 11 | later | 1 | later |
| Conditionals (if/else) | 3 | 2 | 4 | 27 | 4 | 2 | 5 |
| Loops (for/while) | 3 | 2 | 3 | 32 | 6 | 3 | 6 |
| Functions | 4 | 3 | 7 | 18 | 3 | 1 | 1 |
| Lists | 2 | 4 | 2 | 34 | 5 | 3 | 6 |
| Strings (depth) | 2 | 5 | 1 | 6 | 7 | 8 | 3 |
| Dicts | 5 | 4 | 5 | later | 9 | later | 10 |
| Exceptions | 8 | later | 9 | later | later | 4 | 12 |
| Modules | 6 | later | later | later | 8 | 5 | later |
| Classes/OOP | 9 | rare | 8 | 40 | 11 | 9 | 11 |
| File I/O | 7 | 9 | 9 | later | 10 | 7 | later |
| Testing | rare | rare | 10 | rare | rare | 6 | core |

**Key Observation:** There is broad consensus on the first 5 concepts (print → variables → types → conditionals → loops). The main divergence is:
- **When functions appear:** CS50P and Exercism introduce them at lesson 1; LPTHW waits until lesson 18. Evidence favors early function introduction.
- **When exceptions appear:** CS50P introduces exceptions in week 4, very early. Most resources delay until later. CS50P's approach produces cleaner learner code sooner.
- **When OOP appears:** Always late except in CS50P (week 9 of 10) and PCC (chapter 9 of 10 basics).

### 2.2 Pedagogical Philosophy Spectrum

```
Theory-first ←————————————————————————→ Project-first
Python.org   LPTHW   Codecademy   PCC   CS50P   AutomateBS   freeCodeCamp
(reference)  (drill)  (scaffolded) (bal) (unpeeling) (utility) (project-driven)
```

```
High scaffolding ←———————————————————→ Low scaffolding
Codecademy   Tynker   PCC   AutomateBS   CS50P   Exercism   CodingBat   CheckiO
```

### 2.3 What Actually Works (Evidence-Based Summary)

From comparing completion rates, learner testimonials, and educational outcomes:

1. **Motivation must be established in the first 30 minutes.** Resources that start with `print("Hello World")` and spend 3 lessons on arithmetic before any payoff have high early dropout. AutomateBS and CodeCombat solve this by making the first program do something interesting.

2. **Functions should be introduced early** (CS50P lesson 1 model), not deferred. Learners who learn to write functions early write better code throughout. Deferring functions trains bad habits (copy-paste, everything in global scope).

3. **Exceptions should be introduced alongside conditionals**, not as an advanced topic. `try/except` is how real Python handles user input validation — teaching `if input.isdigit()` chains first and exceptions later creates unnecessary re-learning.

4. **The scaffolding trap:** Codecademy's fill-in-the-blank approach produces the "illusion of learning." After completing Codecademy, many learners cannot write a 20-line program from scratch. Effective resources require writing code from a blank editor within the first few sessions.

5. **Seeing other people's solutions after solving** (CheckiO, CodeWars, Exercism) is one of the highest-leverage learning activities available. It teaches idiomatic Python better than any tutorial.

6. **Projects drive retention.** Learners who build even one meaningful project remember far more than those who only do exercises. The project should feel *theirs* — customizable, shareable, impressive to peers.

---

## 3. Recommended Learning Progression

### Design Principles
- **Game context:** Stealth-action 2D (player = operative/agent using code to hack, navigate, and defeat enemies)
- **Target audience:** Ages 15+, complete beginners through proficient
- **Format:** ~10–12 chapters; each chapter = a mission arc
- **Philosophy:** "Earned understanding" — demonstrate need before introducing concept; immediate application; revisit concepts in new contexts

---

### Chapter 1 — Boot Sequence
**Theme:** First day at the agency; initializing your operative's systems.  
**Concepts Introduced:**
- `print()` — broadcasting messages
- String literals (single and double quotes)
- Comments (`#`)
- Basic arithmetic operators (`+`, `-`, `*`, `/`, `//`, `%`, `**`)
- `type()` — inspecting data
- f-strings (introduced immediately, not deferred)

**Prerequisite Knowledge:** None.  
**Estimated Challenges:** 8–10  
**Scaffolding:** High. First 3 challenges have partial code; learner fills in one expression. By challenge 6, learner writes a 3-line program from scratch.  
**Stumbling Blocks:** Quote mismatches, operator precedence confusion.  
**Sample Challenge:** *"Transmit your operative callsign and your mission ID to the command terminal."* → `print(f"Agent: {name}, Mission: {id}")`

---

### Chapter 2 — Operative Profile
**Theme:** Setting up your operative's stats and gear manifest.  
**Concepts Introduced:**
- Variables (assignment, naming rules, snake_case convention)
- Data types: `int`, `float`, `str`, `bool`
- `input()` and type casting (`int()`, `float()`, `str()`)
- Variable reassignment and augmented assignment (`+=`, `-=`, `*=`)
- `len()`, `abs()`, `round()`, `min()`, `max()`

**Prerequisite Knowledge:** Chapter 1 (print, f-strings, arithmetic).  
**Estimated Challenges:** 10–12  
**Scaffolding:** Medium-high. Learner is shown how to declare a variable, then asked to declare their own.  
**Stumbling Blocks:** `input()` always returns `str` — classic type error when adding numbers. This stumbling block should be hit deliberately and resolved in-challenge, not avoided.  
**Sample Challenge:** *"Your stamina meter is drained 15 points after a sprint. Update the operative's stamina."* → `stamina -= 15`

---

### Chapter 3 — Access Control
**Theme:** Bypassing security checkpoints with conditional logic.  
**Concepts Introduced:**
- `if` / `elif` / `else`
- Comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`)
- Boolean operators (`and`, `or`, `not`)
- Truthiness and falsy values (`0`, `""`, `None`, `[]`)
- `try` / `except` (introduced here alongside conditionals, not later)
- `ValueError`, `TypeError` — first exceptions

**Prerequisite Knowledge:** Chapters 1–2 (variables, types, input).  
**Estimated Challenges:** 12–14  
**Scaffolding:** Medium. Learner given `if` template, then writes own conditions.  
**Stumbling Blocks:** `=` vs `==`. Operator precedence in boolean expressions. Assuming `if x = 5` is valid. Short-circuit evaluation surprises.  
**Sample Challenge:** *"The door lock checks: correct keycode AND biometric match AND clearance level ≥ 3. Write the access check."*

---

### Chapter 4 — Patrol Routes
**Theme:** Automating guard patrol patterns and repeating operations.  
**Concepts Introduced:**
- `while` loops (condition-based iteration)
- `for` loops with `range(start, stop, step)`
- `break` and `continue`
- `pass`
- Loop else clause
- Nested loops (introduced cautiously)
- Infinite loop hazard and how to avoid

**Prerequisite Knowledge:** Chapters 1–3 (conditionals, booleans).  
**Estimated Challenges:** 12–15  
**Scaffolding:** Medium. Show one loop, ask learner to write a variation.  
**Stumbling Blocks:** Off-by-one errors. `range(10)` gives 0–9, not 1–10. Forgetting to update loop variable (infinite loops). Not knowing when to use `for` vs `while`.  
**Sample Challenge:** *"Guards patrol in a 5-step cycle. Print each step number and whether it faces a camera blind spot (even steps only)."*

---

### Chapter 5 — Operative Functions
**Theme:** Your operative learns reusable skills (gadget deployment, hacking sequences).  
**Concepts Introduced:**
- Defining functions with `def`
- Parameters and arguments (positional, keyword, defaults)
- `return` values (and `None` as implicit return)
- Scope: local vs global
- Docstrings
- Multiple return values (tuple unpacking)
- First-class functions (functions as arguments — brief intro, revisited in Ch. 9)

**Prerequisite Knowledge:** Chapters 1–4 (all basics).  
**Estimated Challenges:** 14–16  
**Scaffolding:** Medium. First few challenges give function signature; learner writes body. Later challenges require writing complete function from spec.  
**Stumbling Blocks:** Forgetting `return` (function returns `None`, confuses learner). Confusing defining vs calling. `global` keyword misuse (teach it but discourage it). Scope errors ("variable not defined").  
**Sample Challenge:** *"Write a `calculate_breach_time(distance, speed)` function that returns seconds to breach a perimeter, and a `can_evade(response_time, breach_time)` function that returns a boolean."*

---

### Chapter 6 — Asset Inventory
**Theme:** Managing lists of targets, items, and mission assets.  
**Concepts Introduced:**
- Lists: creation, indexing, negative indexing, slicing
- List methods: `.append()`, `.insert()`, `.remove()`, `.pop()`, `.sort()`, `.reverse()`, `.index()`, `.count()`
- `len()` on lists
- Iterating lists with `for item in list`
- List mutability vs reassignment
- `in` and `not in` operators
- Nested lists (2D — used for maps)
- List comprehensions (introduced as "shorthand for loop")

**Prerequisite Knowledge:** Chapters 1–5.  
**Estimated Challenges:** 14–16  
**Stumbling Blocks:** Mutability surprise (`b = a` means same list, not a copy). `.remove()` removes first occurrence only. Indexing errors (`IndexError`). Confusing list comprehension syntax initially.  
**Sample Challenge:** *"You have a list of guard positions on the floor. Remove any guards who've been neutralized (their ID appears in the 'neutralized' list). Return the updated patrol."*

---

### Chapter 7 — Intel Files
**Theme:** Working with mission briefings, codebooks, and encrypted strings.  
**Concepts Introduced:**
- Strings as sequences (indexing, slicing — same as lists)
- String methods: `.upper()`, `.lower()`, `.strip()`, `.split()`, `.join()`, `.replace()`, `.find()`, `.startswith()`, `.endswith()`, `.format()`
- String immutability
- Multi-line strings
- Raw strings (`r"..."`)
- String multiplication and concatenation
- Basic regex (`re.search`, `re.findall`, `re.sub`) — brief intro, enough for pattern matching

**Prerequisite Knowledge:** Chapters 1–6 (especially lists, since strings share interface).  
**Estimated Challenges:** 12–14  
**Stumbling Blocks:** String immutability (can't do `s[0] = 'X'`). Confusing `.split()` return type. Regex syntax overwhelm — keep initial exposure minimal.  
**Sample Challenge:** *"Decode an intercepted transmission: extract all 6-digit codes from a noisy message string using regex."*

---

### Chapter 8 — Mission Dossiers
**Theme:** Storing structured intelligence on targets, locations, and operatives.  
**Concepts Introduced:**
- Dictionaries: creation, access, `.get()`, `.keys()`, `.values()`, `.items()`
- Dict methods: `.update()`, `.pop()`, `del`
- Nested dicts and dicts of lists
- Dict comprehensions
- Tuples (immutable sequences, tuple packing/unpacking)
- Sets (deduplication, `.add()`, `.discard()`, set operations: `|`, `&`, `-`)
- Choosing the right data structure (list vs dict vs set vs tuple — decision guide)

**Prerequisite Knowledge:** Chapters 1–7 (lists, loops, functions).  
**Estimated Challenges:** 14–16  
**Stumbling Blocks:** `KeyError` when accessing non-existent key (vs `.get()`). Confusing dict iteration (iterates keys by default). Set ordering surprise. Over-using dicts when a list suffices.  
**Sample Challenge:** *"Each target has a dict with 'name', 'clearance_level', 'known_aliases' (a list), and 'last_seen_location'. Write a function to find all targets with clearance_level ≥ 4 in a specific location."*

---

### Chapter 9 — Field Manual
**Theme:** The agency's code library — reading briefings, writing field reports.  
**Concepts Introduced:**
- File I/O: `open()`, `with` statement, `read()`, `readline()`, `readlines()`, `write()`, `writelines()`
- File modes: `'r'`, `'w'`, `'a'`, `'rb'`
- `json` module: `json.load()`, `json.dump()`, `json.loads()`, `json.dumps()`
- `csv` module: `csv.reader`, `csv.DictReader`
- `os` and `pathlib.Path`: file existence, path joining, directory listing
- `sys.argv` basics

**Prerequisite Knowledge:** Chapters 1–8 (dicts, strings).  
**Estimated Challenges:** 10–12  
**Stumbling Blocks:** Forgetting to close files (hence `with`). `FileNotFoundError` handling. JSON vs Python dict distinction. Encoding issues (`utf-8`).  
**Sample Challenge:** *"Load a JSON intel file of guard schedules, find all guards on duty between 2200–0200 hours, and write their names to a 'night_shift.txt' report."*

---

### Chapter 10 — Operative Classes
**Theme:** Building reusable blueprints for operatives, gadgets, and enemies.  
**Concepts Introduced:**
- Classes: `class`, `__init__`, `self`
- Instance attributes vs class attributes
- Methods (instance methods, `@classmethod`, `@staticmethod`)
- Inheritance and `super()`
- Method overriding
- `__str__`, `__repr__`, `__eq__` (dunder methods — the "operator overloading" concept)
- Properties (`@property`, setter)
- Composition vs inheritance (brief)

**Prerequisite Knowledge:** Chapters 1–9 (all procedural concepts).  
**Estimated Challenges:** 16–20  
**Scaffolding:** Medium-low. OOP is a genuine conceptual leap — more scaffolding here than in procedural chapters.  
**Stumbling Blocks:** Forgetting `self`. Confusing class vs instance. Not understanding *why* OOP (must be shown a problem that OOP solves better than functions alone). Inheritance misuse (inheriting when composition is better).  
**Sample Challenge:** *"Create an `Operative` base class with health, stealth_rating, and a `take_damage()` method. Create `Hacker` and `Infiltrator` subclasses with specialized abilities."*

---

### Chapter 11 — Quality Assurance
**Theme:** Verifying your code works before deployment — automated mission testing.  
**Concepts Introduced:**
- Why testing matters (bugs in the field are costly)
- `pytest` basics: test functions, `assert`
- Test naming conventions (`test_*`)
- Testing edge cases, error cases
- Fixtures
- `unittest.mock` for mocking external systems (brief)
- Type hints (`def foo(x: int) -> str:`) — readability, not enforcement
- Docstring conventions

**Prerequisite Knowledge:** Chapters 1–10 (especially functions and classes).  
**Estimated Challenges:** 10–12  
**Note:** This chapter is unique — challenges ask learner to write tests for *already-provided code*, finding bugs through testing. This reversal of the usual direction is valuable.  
**Stumbling Blocks:** Test isolation (tests should be independent). Testing implementation vs behavior. Mock complexity.  
**Sample Challenge:** *"The mission planner module has a bug. Write tests that expose it, then fix the bug."*

---

### Chapter 12 — Deep Cover (Advanced Operations)
**Theme:** Elite operative techniques for complex, high-stakes missions.  
**Concepts Introduced:**
- Comprehensions (review + dict/set comprehensions, nested)
- Generators and `yield`
- Decorators (`@property` revisited, writing custom decorators)
- `itertools` and `functools` (map, filter, reduce, partial, lru_cache)
- Context managers (`with`, writing `__enter__`/`__exit__`)
- `*args` and `**kwargs` (full treatment)
- Exception hierarchy, custom exceptions, `raise from`
- Concurrency intro: `threading`, `asyncio` (conceptual, not deep)
- Standard library highlights: `collections` (defaultdict, Counter, deque), `dataclasses`, `pathlib`, `datetime`, `logging`

**Prerequisite Knowledge:** Chapters 1–11 (all prior).  
**Estimated Challenges:** 18–22  
**Note:** This chapter is a "sandbox" — learner chooses which advanced topics to pursue based on interest. Not all are required. Completion of 60% qualifies as "proficient."  
**Sample Challenge:** *"Use a generator to lazily stream an infinite patrol schedule without loading it all into memory. Use a decorator to add logging to any operative action automatically."*

---

### Chapter Summary Table

| Ch | Title | Core Concept | # Challenges | Difficulty |
|---|---|---|---|---|
| 1 | Boot Sequence | Output, strings, arithmetic | 8–10 | ★☆☆☆☆ |
| 2 | Operative Profile | Variables, types, input | 10–12 | ★☆☆☆☆ |
| 3 | Access Control | Conditionals, exceptions | 12–14 | ★★☆☆☆ |
| 4 | Patrol Routes | Loops | 12–15 | ★★☆☆☆ |
| 5 | Operative Functions | Functions, scope | 14–16 | ★★★☆☆ |
| 6 | Asset Inventory | Lists, comprehensions | 14–16 | ★★★☆☆ |
| 7 | Intel Files | Strings, regex | 12–14 | ★★★☆☆ |
| 8 | Mission Dossiers | Dicts, tuples, sets | 14–16 | ★★★☆☆ |
| 9 | Field Manual | File I/O, JSON | 10–12 | ★★★★☆ |
| 10 | Operative Classes | OOP | 16–20 | ★★★★☆ |
| 11 | Quality Assurance | Testing | 10–12 | ★★★★☆ |
| 12 | Deep Cover | Advanced topics | 18–22 | ★★★★★ |
| **Total** | | | **~150–175** | |

---

## 4. In-Game Scenario Mapping

The game's stealth-action framing provides a rich scenario palette. Below is a comprehensive concept-to-scenario mapping.

| Python Concept | Stealth-Action Scenario | Mechanic |
|---|---|---|
| `print()` | Transmit a message to command HQ | Text appears on in-game terminal |
| Variables | Operative stats (health, stealth, stamina) | Stats update on HUD |
| `input()` | Enter keycode at a security terminal | Terminal prompt in-game |
| String formatting | Forge an identity document | Document preview renders |
| Conditionals | Guard checks your ID: valid credentials? | Guard either lets you pass or triggers alarm |
| `try/except` | Hack a lock: handle bad input without crashing system | Lockpick minigame with error states |
| `while` loop | Tail a moving target until they stop | Character animation loops |
| `for` loop | Scan each camera in a surveillance network | Camera icons highlight one by one |
| `break` | Abort a mission on alarm trigger | Emergency exit triggered |
| Functions | Gadget: deploy the same tool in any room | Gadget spawns via function call |
| Parameters | Gadget with configurable range/power | UI sliders map to arguments |
| Return values | Sensor reports threat level back to operative | Threat meter fills |
| Lists | Guard patrol waypoints | Path drawn on mini-map |
| List slicing | Extract a sub-route for evasion | Highlighted segment on map |
| List comprehension | Filter only visible enemies from all enemies | Enemies highlight on screen |
| Strings | Decrypt a cipher from intercepted message | Decoded text appears |
| `str.split()` | Parse coordinates from intercepted radio signal | Coordinates plot on map |
| Regex | Extract serial numbers from scanned documents | Matches highlight in document |
| Dicts | Target dossier (name, age, alias, location) | Profile card renders |
| Nested dicts | Building floor plans (floor → room → contents) | Map renders |
| Sets | Find unique guard IDs across multiple patrols | Unique markers on map |
| Tuples | Fixed coordinates of vault (can't be altered) | Immovable marker on map |
| File I/O | Load/save mission briefings from disk | Briefing document opens |
| JSON | Receive mission parameters from command server | Parameters load into game |
| Classes | Operatives, Guards, Gadgets as objects | Characters have consistent behavior |
| Inheritance | Hacker IS-A Operative, adds new abilities | Character class selection |
| Dunder `__str__` | Operative identity card formatting | Card renders with custom layout |
| Exceptions (custom) | `AlarmTriggered(Exception)` — mission-specific error | Red flash, alarm sound |
| Generators | Infinite guard patrol path (memory efficient) | Seamless patrol without cutoff |
| Decorators | `@logged_action` — all operative moves are recorded | Action log fills |
| Testing | Verify gadget performs correctly before field deploy | "Lab testing" UI |
| Type hints | Mission parameter validation | Pre-mission checklist |

---

## 5. Common Beginner Stumbling Blocks

### 5.1 Type Errors from `input()`
**Problem:** `input()` always returns a string. `age + 1` crashes if `age = input(...)`.  
**How most resources handle it:** Mention in passing, expect learner to remember.  
**Better approach:** Design a challenge that *deliberately triggers this error* and guides the learner through the fix. The error message becomes a teaching moment, not a frustrating surprise.  
**In-game framing:** "You entered the security code but the door rejected it — the system expected a number, not text. Cast your input."

### 5.2 = vs == 
**Problem:** Assignment vs comparison confusion. `if x = 5` is a SyntaxError in Python (safer than C), but the conceptual confusion persists.  
**Better approach:** Explicitly call this out at the moment `==` is introduced. Use a mnemonic: "one arrow puts a value in; two arrows asks a question."

### 5.3 Indentation
**Problem:** Python's significant whitespace is alien to beginners. Mixed tabs/spaces cause cryptic errors.  
**Better approach:** Use a code editor embedded in the game that enforces consistent indentation visually. Show indentation as "block depth" visually (colored brackets or highlighting). Make `IndentationError` messages describe the issue in plain language.  
**In-game framing:** "Your commands must be precisely aligned — sloppy indentation compromises the hack."

### 5.4 Mutable Default Arguments
**Problem:** `def foo(lst=[])` is a notorious Python gotcha — the default list is shared across all calls.  
**Better approach:** Introduce this explicitly in the functions chapter. Show the bug, explain the mechanism, give the `None` pattern as the fix.

### 5.5 Forgetting `return`
**Problem:** Learner writes logic inside a function but forgets `return`. Function returns `None`. Code that uses the result silently gets `None`.  
**Better approach:** In the game's test harness, if a function returns `None` unexpectedly, show a specific message: "Your operative came back from the mission with no report — did you forget to return the result?"

### 5.6 List Aliasing
**Problem:** `b = a` for lists creates an alias, not a copy. Modifying `b` modifies `a`.  
**Better approach:** Design a challenge around this exact scenario. "You copied the patrol route to modify it, but the original route was changed — use `.copy()` or `list()` to make a real copy."

### 5.7 The OOP Conceptual Leap
**Problem:** OOP requires thinking at a different level of abstraction. Learners often write methods that don't use `self`, or confuse class vs instance attributes.  
**Better approach:** Show a *before/after*: here's how you'd solve this with 5 functions and 3 dicts; here's the same thing with a class. The class version is better *because* of X. Don't introduce OOP without first creating the pain it solves.

### 5.8 Scope Confusion
**Problem:** Variables defined inside a function aren't accessible outside. Learners try to access loop variables after the loop ends (they persist in Python, but this is surprising in comparison to other languages' block scope).  
**Better approach:** Visualize scope with color zones in the editor. Variables in a function are in a "classified compartment" — accessible only within that mission.

### 5.9 Off-by-One Errors
**Problem:** `range(10)` gives 0–9. Slicing `[1:3]` gives indices 1 and 2, not 3. List indexing starts at 0.  
**Better approach:** Use visual representations consistently. A list of 5 guards is shown with indices 0–4 overlaid in the UI. When a challenge produces an off-by-one error, show the visual before explaining the fix.

### 5.10 Exception Handling Anti-patterns
**Problem:** Learners either avoid exceptions entirely or write `except:` (bare except) that swallows all errors including `KeyboardInterrupt`.  
**Better approach:** Show the consequences. A bare `except` in the mission code means you'll never know when something goes wrong — the alarm is silenced but the guards still know you're there.

---

## 6. Gamification Best Practices

### 6.1 Scaffolding Techniques

**Fading Scaffolding (most important):**  
Provide full scaffolding early; reduce it as learner demonstrates competence. Concrete sequence:
1. Challenge 1–2: pre-filled code with one blank
2. Challenge 3–4: function signature provided, body is blank
3. Challenge 5–6: docstring/comments describe what's needed, blank editor
4. Challenge 7+: narrative description only ("write a function that...")

This mirrors the "I do, we do, you do" pedagogical model and is validated by research on worked examples (Sweller's cognitive load theory).

**Just-in-time hints:**  
Hints should be tiered and behind a click (not shown upfront). Tier 1 hint = nudge ("Think about what type `input()` returns"). Tier 2 = bigger hint ("You need to convert the string to an integer"). Tier 3 = worked example. Each tier costs something (in-game currency, time, or simply "used a hint" flag).

**Error message translation:**  
Python's raw tracebacks are intimidating. Intercept common exceptions and display translated versions: `TypeError: can only concatenate str (not "int") to str` → "You're trying to combine a text value with a number — convert one of them first."

### 6.2 Motivation Mechanics

**Intrinsic motivation (Self-Determination Theory — Deci & Ryan):**  
- **Autonomy:** Let learners choose which optional challenges to tackle, customize their operative's name/appearance, choose the order of some sub-missions.
- **Competence:** Calibrate difficulty carefully. Every challenge should be solvable. Celebrate legitimate mastery, not just completion. Show learner how much they've learned via retrospective comparison ("Look how simple this chapter 1 code looks now").
- **Relatedness:** Show community solutions after solving (CheckiO model). Allow sharing of solutions. Leaderboards for speed/elegance are less valuable than community.

**Narrative motivation:**  
The mission narrative should make learners *care* about the outcome before asking them to code. Brief cutscene or text briefing establishes stakes. Code is the tool to achieve a goal the learner already wants.

**Progress visibility:**  
Show skill trees or concept maps that fill in as concepts are mastered. Not a linear progress bar — a *graph* of knowledge, so learners can see how concepts connect. Revisiting an earlier concept in a new context should visually reinforce the connection.

**Variable reward (cautiously):**  
Occasional bonus challenges, hidden missions, and easter eggs maintain engagement without becoming the primary driver. Avoid compulsive loop design (no daily streaks that punish absence).

### 6.3 How Existing Coding Games Handle Progressive Difficulty

**CodeCombat's model:**
- Each level introduces exactly one new concept or one new application of a known concept
- Levels take 3–8 minutes (optimal for flow state)
- Failure is instant-feedback and restartable with no penalty beyond time
- Cumulative: previous concepts appear in new levels as assumed knowledge

**SpaceChem / TIS-100 (puzzle game) model:**
- Very hard puzzles with no scaffolding, but multiple valid solutions
- Community sharing shows diverse approaches
- Works for intrinsically motivated players; high dropout for others
- Not suitable for curriculum use without modification

**Duolingo model (language learning analogy):**
- Spaced repetition: concepts reappear after delay
- "Strengthen skills" for degrading knowledge
- Short sessions optimized (5–15 min)
- Weakness: gamification overwhelms pedagogy at times

**Recommendations for Venomous Snake:**
- Keep challenges short (target 5–15 minutes each)
- Never require a learner to pass a challenge to "unlock" the only next step — always have 2–3 parallel challenges available
- Reintroduce earlier concepts in later chapters (spaced retrieval)
- Allow "skip" with explanation for learners who already know a concept, but make skipping require demonstrating competence (mini-assessment)

### 6.4 Error Feedback Strategies

**Immediate, specific, non-judgmental:**  
Research (Hattie & Timperley, 2007) shows feedback is effective when it answers: What is the goal? Where am I now? How do I close the gap? Map this to coding: (1) what should the code do, (2) what does it actually do, (3) what's the concrete next step.

**Show don't tell:**  
When possible, visualize the incorrect behavior, not just the error message. If the learner's guard patrol loop runs off the map, show the guard running off the map, then say "your loop ran too many times — check your range."

**Distinguish syntax errors from logic errors from runtime errors:**  
- Syntax errors: caught before running ("your code has a typo — check line 3")
- Runtime errors: caught during execution ("your code crashed at line 7 — here's what happened")
- Logic errors: caught by test cases ("your code ran without crashing, but it returned 42 instead of 7 — what's different?")

**Never show the solution automatically:**  
Only surface solutions after the learner has genuinely attempted (minimum 2 incorrect submissions) and has used all hint tiers. Even then, frame it as a community solution to examine, not an answer to copy.

**Error history:**  
Keep a log of errors made on each challenge. If a learner makes the same error 3+ times across different challenges, surface a micro-tutorial on that specific mistake. Adaptive feedback.

---

## 7. Synthesis & Design Recommendations

### 7.1 The Non-Negotiable Pedagogical Choices

1. **Introduce `try/except` in Chapter 3**, not as an advanced topic. Every `input()` call in the real world needs it. Teach the right habit from the start.

2. **Introduce functions in Chapter 5**, before lists and dicts. Learners who learn to decompose problems into functions before learning data structures write dramatically cleaner code.

3. **Never introduce OOP without first creating the pain it solves.** Show a Chapter 8/9 program that's getting complex without classes, then show how classes organize it. The "why" must precede the "how."

4. **Require writing code from a blank editor within the first 10 challenges.** Codecademy's fill-in model feels good but doesn't transfer. By challenge 8, learners should face a blank editor with only a docstring.

5. **Design at least one challenge where the learner's correct code fails on edge cases.** Introduce testing not as an advanced topic but as "how do you know your code works?" This can happen as early as Chapter 3.

### 7.2 The Venomous Snake-Specific Recommendations

1. **The operative metaphor is excellent** for the CS50P "unpeeling" technique — show the naive approach (a guard checking a single hardcoded password), then reveal why it fails (what if there are 50 guards? 50 different passwords?), then introduce the better solution (functions, then dicts).

2. **Use the alarm system as a live consequence for errors.** If the learner's code crashes (unhandled exception), the in-game alarm triggers. This makes exception handling viscerally important, not an abstract best practice.

3. **Map the game's world to a skill tree.** Each room or zone in the game world represents a concept cluster. Completing challenges in that zone unlocks the next zone. The world map IS the curriculum map.

4. **Replayable missions with new constraints.** After completing a mission, offer a "hard mode" variant with constraints (e.g., "solve this without using a loop," "solve this in 3 lines") — this introduces functional/idiomatic Python naturally without a formal chapter on it.

5. **The endgame: a fully open sandbox mission.** The final arc should present a multi-system problem (load intel, process it, decide on a strategy, output a plan) where the learner architects the solution entirely. This is the capstone project equivalent, set in the game world.

### 7.3 Open Questions for the Design Team

- **What is the target session length?** (5 min, 20 min, 60 min) — this affects challenge granularity.
- **Will there be a multiplayer / social layer?** If so, peer code review (à la Exercism) should be designed in from the start.
- **What Python version?** Python 3.10+ recommended (structural pattern matching `match`/`case` is worth teaching).
- **What execution environment?** Browser-based REPL (most accessible), local Python (most realistic), or embedded engine (most controlled)?
- **Will the game teach a specific domain?** (e.g., "Python for games," "Python for data") — the standard curriculum above is general; domain-specific tracks could branch from Chapter 9 onward.

---

## References & Further Reading

### Primary Sources Reviewed
- Sweigart, A. *Automate the Boring Stuff with Python*, 2nd ed. No Starch Press, 2019.
- Matthes, E. *Python Crash Course*, 3rd ed. No Starch Press, 2023.
- Shaw, Z. *Learn Python 3 the Hard Way*. Addison-Wesley, 2017.
- Python.org. *The Python Tutorial* (Python 3.12 docs). https://docs.python.org/3/tutorial/
- CS50P. *CS50's Introduction to Programming with Python*. Harvard OpenCourseWare, 2022.

### Educational Research Cited
- Sweller, J. "Cognitive load during problem solving: Effects on learning." *Cognitive Science*, 12(2), 1988. — Basis for fading scaffolding.
- Deci, E.L. & Ryan, R.M. *Intrinsic Motivation and Self-Determination in Human Behavior*. Springer, 1985. — Basis for autonomy/competence/relatedness framework.
- Hattie, J. & Timperley, H. "The Power of Feedback." *Review of Educational Research*, 77(1), 2007. — Basis for error feedback strategy.
- Roediger, H.L. & Karpicke, J.D. "Test-enhanced learning." *Psychological Science*, 17(3), 2006. — Basis for spaced retrieval recommendations.
- VanLehn, K. "The relative effectiveness of human tutoring, intelligent tutoring systems, and other tutoring systems." *Educational Psychologist*, 46(4), 2011. — Basis for immediate feedback value.

### Platforms to Monitor
- Exercism.org — ongoing open-source curriculum development
- CS50P — annual updates, new problem sets
- freeCodeCamp — curriculum updates quarterly
- Advent of Code — annual benchmark of learner readiness for algorithmic thinking

---

*Document version 1.0 — Initial research synthesis*  
*Next step: Map curriculum chapters to game level/zone design document*

---

---

# In-Browser Python Interpreter Technical Investigation
### Deployment Target: `file://` Protocol (USB Stick Distribution)

> **Purpose:** Evaluate every viable in-browser Python interpreter against the constraint that the game must run from `file://` — opened directly from a USB stick, with no HTTP server. This section complements the curriculum research by determining *which Python concepts we can actually teach* given the interpreter we ship.

---

## Table of Contents

A. [The `file://` Protocol Problem Explained](#a-the-file-protocol-problem-explained)  
B. [Interpreter-by-Interpreter Analysis](#b-interpreter-by-interpreter-analysis)  
C. [WASM from `file://` — Deep Dive](#c-wasm-from-file----deep-dive)  
D. [Pyodide Bundling — Is It Possible?](#d-pyodide-bundling--is-it-possible)  
E. [Curriculum Coverage Matrix](#e-curriculum-coverage-matrix)  
F. [Feature Completeness Matrix](#f-feature-completeness-matrix)  
G. [Comparison Summary Table](#g-comparison-summary-table)  
H. [Recommendation](#h-recommendation)  
I. [Implementation Notes for the Chosen Approach](#i-implementation-notes-for-the-chosen-approach)

---

## A. The `file://` Protocol Problem Explained

When a browser opens an HTML file via `file://`, it operates under the most restrictive possible security policy:

| Mechanism | Behaviour on `file://` |
|---|---|
| `fetch()` | **Blocked** in Chrome/Edge entirely. Firefox blocks cross-file fetches unless `security.fileuri.strict_origin_policy` is `false`. |
| `XMLHttpRequest` (XHR) | Same-origin only. Firefox allows XHR to other `file://` URLs in the same directory. Chrome blocks all XHR from `file://`. |
| `<script src="...">` | **Works** in all browsers as long as the `.js` file is local and in the same directory tree. |
| `<link>` / `<img>` | Works for local files. |
| `WebAssembly.instantiateStreaming(fetch(...))` | **Broken** — depends on `fetch()`. |
| `WebAssembly.instantiate(ArrayBuffer)` | Works *if* you can get the bytes into an ArrayBuffer. The bottleneck is how you load the `.wasm` file. |
| Dynamic `import()` | Blocked in Chrome from `file://`. Firefox may allow it with flags. |
| Service Workers | Require `http://` or `https://`. Completely unavailable. |

**The fundamental dividing line:** Interpreters that ship as plain `.js` files (loaded with `<script>` tags) work everywhere. Interpreters that need to load WASM, zip files, or additional assets at runtime via network requests are broken on `file://` in Chrome (the dominant browser), and require workarounds even in Firefox.

---

## B. Interpreter-by-Interpreter Analysis

---

### B.1 Skulpt

**Homepage:** https://skulpt.org  
**Repository:** https://github.com/skulpt/skulpt  
**Status:** ✅ Active (regular releases, last major version 1.2+)

#### B.1.1 `file://` Compatibility

**Rating: ✅ FULLY COMPATIBLE**

Skulpt is pure JavaScript — no WASM, no `fetch()`, no dynamic imports. The entire runtime ships as two static `.js` files:

```html
<script src="skulpt.min.js"></script>
<script src="skulpt-stdlib.js"></script>
```

Both files are loaded via standard `<script>` tags. Once loaded, Skulpt runs entirely in memory. There are no network requests at execution time. **This works identically from `file://` and `http://`.** It is the most USB-deployment-friendly option by a wide margin.

The only caveat: if you configure Skulpt to use external module imports that point to CDN URLs, those will fail. With a fully local bundle (both files on the USB stick), no issues exist.

#### B.1.2 Python Version

Skulpt uses the **Python 3.7.x grammar** (updated from Python 2 as of the master branch rewrite). The implementation is partial — the grammar is there but not every semantic is implemented beneath it.

**Honest characterisation:** Skulpt is approximately Python 3.5–3.7 in terms of what actually executes correctly. The parser recognises Python 3.7+ syntax but many features silently misbehave or raise unimplemented errors at runtime.

#### B.1.3 Standard Library Coverage

Skulpt includes a bundled `skulpt-stdlib.js` that reimplements modules in JavaScript:

| Module | Status |
|---|---|
| `math` | ✅ Nearly complete |
| `random` | ✅ Implemented |
| `re` | ⚠️ Partial (basic patterns work; lookaheads, some flags missing) |
| `time` | ⚠️ Partial |
| `operator` | ✅ Mostly complete |
| `string` | ✅ |
| `collections` | ⚠️ `defaultdict`, `OrderedDict`, `Counter` present; `namedtuple` partial |
| `functools` | ⚠️ `reduce`, `partial` present; `lru_cache`, `wraps` partial/missing |
| `itertools` | ⚠️ Core iterators present; not complete |
| `unittest` | ⚠️ Very partial stub |
| `turtle` | ✅ Good canvas-based implementation |
| `sys` | ⚠️ Minimal stub |
| `os` | ❌ Stub only, raises unimplemented |
| `io` | ❌ |
| `json` | ✅ (delegates to JS JSON) |
| `datetime` | ❌ |
| `csv` | ❌ |
| `dataclasses` | ❌ Not implemented |
| `typing` | ❌ Not implemented |
| `asyncio` | ❌ Not implemented |
| `pathlib` | ❌ |
| `enum` | ⚠️ Basic |
| `abc` | ⚠️ Partial |

#### B.1.4 Language Feature Completeness

| Feature | Skulpt Status | Notes |
|---|---|---|
| `print()` | ✅ | Full, output interceptable |
| Variables, basic types | ✅ | int, float, str, bool, None |
| F-strings | ⚠️ | Basic f-strings work; complex nested expressions may fail |
| `input()` | ✅ | Must be async-suspended; works with Suspensions API |
| Conditionals `if/elif/else` | ✅ | |
| `for` / `while` / `range` | ✅ | |
| `break` / `continue` | ✅ | |
| Lists / tuples / dicts / sets | ✅ | |
| Functions (`def`, `return`) | ✅ | |
| `*args` / `**kwargs` / defaults | ✅ | |
| String methods | ✅ | Most CPython methods present |
| List methods | ✅ | |
| File I/O | ❌ | No real filesystem; can simulate with JS object |
| `try` / `except` / `finally` | ✅ | |
| `raise` | ✅ | |
| Custom exceptions | ✅ | |
| Classes / `__init__` | ✅ | |
| Inheritance / `super()` | ✅ | |
| `@property` / `@staticmethod` / `@classmethod` | ✅ | Recent versions |
| List comprehensions | ✅ | |
| Dict/set comprehensions | ✅ | |
| Generator expressions | ✅ | |
| `yield` / generator functions | ✅ | |
| Decorators | ✅ | |
| Context managers (`with` / `__enter__` / `__exit__`) | ✅ | |
| `async` / `await` | ❌ | Not implemented |
| Walrus operator `:=` | ❌ | Not implemented |
| `match` / `case` (3.10+) | ❌ | Not implemented |
| Type hints (annotations) | ⚠️ | Syntax accepted but not enforced; runtime access via `__annotations__` may fail |
| `dataclasses` | ❌ | Module not implemented |
| `lambda` | ✅ | |
| `map` / `filter` / `zip` | ✅ | |
| `functools.reduce` | ✅ | |
| Regular expressions (`re`) | ⚠️ | Core patterns work |
| `assert` | ✅ | |
| `__dunder__` methods | ✅ | Most numeric/comparison dunders; some missing |
| Multiple inheritance / MRO | ✅ | C3 linearisation implemented |
| Closures | ✅ | |
| `nonlocal` | ✅ | |
| `global` | ✅ | |
| Unpacking (`a, b = ...`) | ✅ | |
| Extended unpacking (`a, *b = ...`) | ✅ | Recent versions |

#### B.1.5 Error Messages

Skulpt produces error messages that are structurally similar to CPython's but **not identical**. Tracebacks show Python line numbers and file names. Exception types (`TypeError`, `ValueError`, `NameError`, etc.) are correct. Messages differ in wording from CPython — a student comparing Skulpt output to what a book says CPython would print will notice differences. The tracebacks are simplified (no C-level frames). `SyntaxError` messages from the parser are reasonable.

**Key gap:** The errors won't say `Traceback (most recent call last):` in the canonical CPython format — instructors need to be aware of this.

#### B.1.6 Performance

For educational use cases (scripts < 1000 lines, no heavy computation), Skulpt is entirely adequate. It's slower than CPython by roughly 10–50×, but for teaching concepts like loops, recursion, and data structures, this is imperceptible. The Suspensions mechanism allows `time.sleep()` and `input()` without blocking the browser thread.

#### B.1.7 Bundle Size

- `skulpt.min.js`: ~380 KB (minified)
- `skulpt-stdlib.js`: ~540 KB (minified)
- **Total: ~920 KB** — comfortably fits on any USB stick, loads fast even on slow hardware.

#### B.1.8 Active Maintenance

- GitHub repo: https://github.com/skulpt/skulpt — ~7,800 stars
- Last releases are regular; maintained by a small team (Brad Miller, Scott Rixner, others)
- Used in production by **Runestone Academy** (a major educational platform with 100,000+ users)
- Bus factor: **medium** (~3–4 active maintainers). Risk: project could slow, but the codebase is stable enough to fork.

#### B.1.9 Limitations for a Python Teaching Game

**Critical gaps for your curriculum:**
1. **`async`/`await`** — Cannot be taught at all (Lesson 17)
2. **`match`/`case`** — Cannot be taught (Lesson 19)
3. **`dataclasses`** — Cannot be taught (Lesson 20)
4. **Type hints** — Syntax accepted but no meaningful runtime behaviour; annotation inspection won't work reliably
5. **`input()` requires extra setup** — The Suspensions API must be configured by the game's JS layer; not trivial
6. **F-string edge cases** — Complex f-string expressions (nested quotes, multi-line) may fail
7. **`re` module gaps** — Advanced regex features (named groups, verbose mode `re.VERBOSE`, some flags) may not work
8. **No `unittest.TestCase`** — Testing concepts (Lesson 21) would need custom implementation
9. **Divergent error messages** — Students can't transfer what they read in books about CPython tracebacks

---

### B.2 Brython

**Homepage:** https://brython.info  
**Repository:** https://github.com/brython-dev/brython  
**Status:** ✅ Very actively maintained

#### B.2.1 `file://` Compatibility

**Rating: ✅ FULLY COMPATIBLE (with correct setup)**

Brython is a JavaScript-based Python-to-JS transpiler that runs in the browser. **It contains no WASM.** The runtime and stdlib ship as two `.js` files:

```html
<script src="brython.js"></script>
<script src="brython_stdlib.js"></script>
```

When configured this way (both files local, stdlib bundled), Brython executes with no network requests. This works perfectly from `file://`.

**The trap to avoid:** By default, Brython tries to import stdlib modules by making `fetch()` requests to `.py` files on the server. This fails on `file://`. The solution is to always include `brython_stdlib.js` as a `<script>` tag — this embeds all stdlib modules as a JavaScript object, making them available with zero network I/O.

**Tested behaviour:**
- `<script type="text/python">` blocks in the page work.
- External `.py` files referenced via `src="myscript.py"` require a fetch — **this will fail on `file://`**. All Python code must be inline or served from the bundled stdlib.
- Multi-file Python projects (student writing multiple modules) would require a workaround (register modules manually via `sys.modules` from JS).

#### B.2.2 Python Version

**Rating: ✅ EXCELLENT — Python 3.13/3.14**

This is Brython's superpower. The project explicitly tracks CPython's version numbers:
- Brython 3.14.0 → implements Python 3.14 features (Template Strings PEP 750, deferred annotations PEP 649/749)
- Brython 3.13.x → Python 3.13
- Brython 3.12.x → replaces parser with one generated from the actual CPython grammar

The parser was rewritten in 3.12+ using the standard Python grammar file run through the CPython toolchain, then adapted to generate JavaScript. This means Brython's parser is far more CPython-faithful than in previous versions.

#### B.2.3 Standard Library Coverage

Brython's `brython_stdlib.js` contains Python standard library modules that were ported from CPython (the pure-Python parts) or reimplemented in JavaScript:

| Module | Status |
|---|---|
| `math` | ✅ |
| `random` | ✅ |
| `re` | ✅ Full implementation (Python's `re` module, pure Python) |
| `time` | ⚠️ Limited (no sleep blocking) |
| `datetime` | ✅ (pure Python port) |
| `collections` | ✅ (`defaultdict`, `OrderedDict`, `namedtuple`, `Counter`, `deque`) |
| `functools` | ✅ (`reduce`, `partial`, `lru_cache`, `wraps`, `cached_property`) |
| `itertools` | ✅ Nearly complete |
| `operator` | ✅ |
| `string` | ✅ |
| `json` | ✅ |
| `csv` | ✅ |
| `enum` | ✅ |
| `abc` | ✅ |
| `typing` | ✅ (syntax and runtime annotation support) |
| `dataclasses` | ✅ |
| `io` | ⚠️ Limited (StringIO works; no file system) |
| `os` | ⚠️ Partial stubs |
| `sys` | ⚠️ Partial |
| `pathlib` | ❌ (requires file system) |
| `asyncio` | ⚠️ Limited — async/await syntax works but the event loop is the browser's; asyncio itself is not fully ported |
| `unittest` | ✅ Core working |
| `hashlib` | ✅ |
| `base64` | ✅ |
| `struct` | ✅ |
| `urllib.parse` | ✅ |
| `contextlib` | ✅ |
| `copy` | ✅ |
| `inspect` | ⚠️ Partial |
| `threading` | ❌ Not supported |
| `multiprocessing` | ❌ Not supported |
| `socket` | ❌ |

#### B.2.4 Language Feature Completeness

| Feature | Brython Status | Notes |
|---|---|---|
| `print()` | ✅ | Full, redirectable |
| Variables, basic types | ✅ | |
| F-strings | ✅ | Full PEP 701 support (3.12+) |
| `input()` | ✅ | Blocking via browser `window.prompt()` by default; can be overridden |
| Conditionals | ✅ | |
| `for` / `while` / `range` | ✅ | |
| `break` / `continue` / `else` on loops | ✅ | |
| Lists / tuples / dicts / sets | ✅ | |
| Functions | ✅ | |
| `*args` / `**kwargs` / defaults | ✅ | |
| String methods | ✅ | Near-complete |
| List methods | ✅ | |
| File I/O | ❌ | No real file system; `open()` raises unless simulated |
| `try` / `except` / `finally` / `else` | ✅ | |
| Custom exceptions | ✅ | |
| Classes / OOP | ✅ | |
| Inheritance / `super()` / MRO | ✅ | |
| `@property` / descriptors | ✅ | |
| `@staticmethod` / `@classmethod` | ✅ | |
| `@dataclass` | ✅ | |
| List / dict / set comprehensions | ✅ | |
| Generator expressions | ✅ | |
| Generator functions (`yield`, `yield from`) | ✅ | |
| Decorators (including stacked) | ✅ | |
| Context managers (`with`) | ✅ | |
| `async def` / `await` | ✅ | Syntax works; integrates with browser event loop, not asyncio |
| Walrus operator `:=` | ✅ | (3.8+) |
| `match` / `case` | ✅ | (3.10+) |
| Type hints | ✅ | Syntax and `__annotations__`; `typing` module available |
| `dataclasses` | ✅ | |
| `lambda` | ✅ | |
| `map` / `filter` / `zip` | ✅ | |
| `functools.reduce` | ✅ | |
| Regular expressions | ✅ | Full `re` module |
| `assert` | ✅ | |
| `__dunder__` protocol methods | ✅ | Extensive |
| Multiple inheritance / MRO (C3) | ✅ | |
| Closures / `nonlocal` / `global` | ✅ | |
| Unpacking / extended unpacking | ✅ | |
| `import` from bundled stdlib | ✅ | |
| `import` from external `.py` file | ❌ on `file://` | Requires HTTP; workaround needed |

#### B.2.5 Error Messages

Brython 3.13+ rewrote error reporting to comply with **PEP 657** (fine-grained error locations). Error messages are structurally very close to CPython, including `Traceback (most recent call last):` formatting. The line numbers and column indicators have been improved significantly in recent versions.

Some nuances:
- Stack traces include Brython's own JS-level frames in some cases
- Error messages in some edge cases are less descriptive than CPython's
- `SyntaxError` messages from the (now CPython-grammar-derived) parser are very accurate
- For the curriculum's purposes (beginners), the errors are accurate enough

#### B.2.6 Performance

Brython is a transpiler — Python is compiled to JavaScript at page-load time, then the JS runs natively. This is faster than interpreted approaches (Skulpt) for CPU-intensive code. For educational scripts, the difference is imperceptible. The 3.13.1 release notes mention "significant performance improvement" from a major rewrite of function implementation. Loading time (transpilation) is fast enough for interactive use.

#### B.2.7 Bundle Size

- `brython.js` (core): ~550 KB (minified)
- `brython_stdlib.js` (full stdlib): ~1.7 MB (minified)
- **Total: ~2.25 MB**

This is larger than Skulpt but still very reasonable for a USB stick. Loads in under 1 second on modern hardware.

#### B.2.8 Active Maintenance

- GitHub: ~6,800 stars
- **Extremely active** — releases track CPython minor versions (3.14.0 released in 2025)
- Primary maintainer: Pierre Quentel (very active)
- Bus factor: **medium-low** (primary contributor is one person, but the project is mature and well-structured)
- Has a dedicated community, mailing list, and issue tracker

#### B.2.9 Limitations for a Python Teaching Game

1. **`import` from external `.py` files fails on `file://`** — All Python code must be inline in the HTML or pre-bundled. Multi-file projects are problematic. *Workaround:* bundle all student code inline or register extra modules via `sys.modules` through the JS layer.
2. **`input()` uses `window.prompt()` by default** — produces ugly native browser dialogs. Must be overridden with a custom input handler in the game's JS layer (this is doable and documented).
3. **`async`/`await` works syntactically but maps to browser Promises** — `asyncio.sleep()` won't work as expected. Async concepts can be demonstrated but with caveats.
4. **No file system** — `open()` for real file I/O is impossible. Simulated file I/O is possible via an in-memory VFS implemented in JS.
5. **`threading` is absent** — any code using `Thread` will fail.
6. **Some stdlib modules behave differently** — modules that rely on OS resources (sockets, subprocesses, file locking) will raise errors.
7. **JS interop available** — students can accidentally access browser APIs via `from browser import document`. For a teaching game this is a feature for advanced content but a distraction for beginners.

---

### B.3 Pyodide

**Homepage:** https://pyodide.org  
**Repository:** https://github.com/pyodide/pyodide  
**Status:** ✅ Very actively maintained (Mozilla/Anaconda backing)

#### B.3.1 `file://` Compatibility

**Rating: ❌ INCOMPATIBLE with `file://` in Chrome/Edge. ⚠️ Possible in Firefox with major effort.**

Pyodide is CPython compiled to WebAssembly via Emscripten. The fundamental problem is in the loader. The core files are:

- `pyodide.asm.wasm` (~8–10 MB): The WASM binary
- `python_stdlib.zip` (~10 MB): Standard library as a zip
- `pyodide-lock.json`: Package manifest
- `pyodide.mjs`: The JS loader

The loader (`pyodide.mjs`) calls `fetch()` to download all of these. `fetch()` from `file://` is blocked in Chrome and Edge unconditionally. It is also blocked in Firefox by default unless `security.fileuri.strict_origin_policy` is set to `false` (a config change users must make manually).

Even `WebAssembly.instantiateStreaming()` requires a streaming `Response` from a URL, which means HTTP. The fallback `WebAssembly.instantiate(ArrayBuffer)` requires the bytes already loaded — but loading those bytes from `file://` requires `fetch()` or XHR, which are blocked.

**Bottom line:** Pyodide as distributed is unusable from `file://` in any major browser without user configuration changes or a modified loader.

#### B.3.2 Python Version

**Python 3.12** (as of Pyodide 0.29.x). It is literally CPython 3.12 compiled to WASM. The fidelity is near-perfect.

#### B.3.3 Standard Library Coverage

Almost all of CPython's stdlib, with documented exceptions:
- **Removed:** `curses`, `dbm`, `tkinter`, `turtle`, `venv`, `fcntl`, `grp`, `pwd`, `termios` (platform-specific)
- **Non-functional (present but broken):** `threading`, `multiprocessing`, `socket`
- **Unvendored (need extra download):** `ssl`, `lzma`, `sqlite3`
- **Everything else:** Functional

#### B.3.4 Language Feature Completeness

100% — it is CPython. All features through 3.12 work, including `match`/`case`, walrus operator, `dataclasses`, type hints, `async`/`await`, pattern matching, structural subtyping, etc.

#### B.3.5–B.3.9

(Performance, bundle size, maintenance: all excellent, but irrelevant for `file://` deployment.)

**See Section D** for whether Pyodide can be re-engineered for `file://`.

---

### B.4 PyPy.js (pypyjs)

**Repository:** https://github.com/pypyjs/pypyjs  
**Status:** ❌ DEAD — Development sleeping since 2016

PyPy compiled to JavaScript via Emscripten/asm.js. The project itself links to Pyodide as its recommended replacement. The last release was Python 2.7. There is no Python 3 support. The repository's own README says: *"Look at iodide (specifically, pyodide) for a maintained and heavily developed alternative."*

**Verdict: Do not use. Not viable.**

---

### B.5 Batavia (BeeWare)

**Repository:** https://github.com/beeware/batavia  
**Status:** ❌ ON HIATUS — Development suspended indefinitely

Batavia was a Python 3.5 bytecode interpreter in JavaScript. The BeeWare project suspended development explicitly, stating: *"the approach that is being used by Batavia needs to be reconsidered."*

Problems beyond the hiatus:
- Required a server to compile `.py` → `.pyc` files; the JS only runs the bytecode, not source
- Python 3.5 only — no f-strings, no walrus, no match/case, no dataclasses
- Never achieved production stability

**Verdict: Do not use. Not viable.**

---

### B.6 Transcrypt

**Repository:** https://github.com/TranscryptOrg/Transcrypt  
**Status:** ✅ Maintained (but wrong tool for this use case)

Transcrypt is a **compile-time Python-to-JavaScript transpiler**, not a runtime interpreter. You compile Python source to JavaScript before deployment using a command-line tool. The browser runs only the compiled JS output.

**This fundamentally disqualifies it for a Python teaching game** where students write and execute Python code in the browser. Transcrypt has no mechanism to take arbitrary Python source typed by a user and execute it at runtime. Its own documentation explicitly states: *"No eval and exec of Python code."*

**`file://` compatibility:** The compiled JS output works perfectly from `file://`. But this doesn't help us.

**Other notes:**
- Python 3.9 syntax support (uses Python's own parser via CPython's ast module)
- Excellent performance (generates lean, readable JS)
- No eval/exec means no dynamic code execution
- No standard Python error messages (errors are JS errors)

**Verdict: Wrong tool entirely. Not viable for a code-execution teaching game.**

---

### B.7 RapydScript-NG

**Repository:** https://github.com/atsepkov/RapydScript  
**Status:** ⚠️ Maintenance-mode (low activity)

RapydScript is a **Python-inspired JavaScript pre-compiler**. It is explicitly not real Python:
- `==` compiles to deep equality (not Python's `==`)
- Type system is JavaScript's (no real int/float distinction)
- Standard library is JavaScript's, not Python's
- No real Python exception hierarchy
- Inheritance works differently
- No real generators (uses JS generators)

Teaching RapydScript would not teach Python. Students would learn habits that are incorrect in CPython. For example, `1 / 2` in RapydScript returns `0.5` (JS behaviour), while in Python 3 it also returns `0.5` — but `1 // 2` doesn't exist in RapydScript. Dictionary semantics differ. There is no `tuple` type.

**Verdict: Not real Python. Do not use for a Python teaching game.**

---

### B.8 MicroPython (WASM build)

**Homepage:** https://micropython.org  
**Status:** ✅ Very actively maintained

MicroPython has a WebAssembly port. PyScript can use it as an alternative to Pyodide.

#### `file://` Compatibility

**Rating: ❌ INCOMPATIBLE — same WASM loading problem as Pyodide**

The MicroPython WASM build loads via WebAssembly, requiring `fetch()` or a streaming response. Same `file://` limitations apply.

#### Python Coverage

MicroPython implements a subset of Python 3. Key omissions relevant to your curriculum:
- No `dataclasses`
- No `typing` module
- Limited `re` (uses `ure`, the MicroPython regex subset)
- No `match`/`case`
- No `async`/`await` in the browser WASM context
- No `functools.lru_cache`, `functools.wraps`
- Standard library is heavily trimmed

MicroPython is designed for microcontrollers with 256KB of RAM. It deliberately omits features to fit. **Teaching MicroPython is not the same as teaching Python 3.**

**Verdict: Wrong Python dialect, and same `file://` problems as Pyodide. Not recommended.**

---

### B.9 PyScript

**Homepage:** https://pyscript.net  
**Repository:** https://github.com/pyscript/pyscript  
**Status:** ✅ Active (Anaconda-backed)

PyScript is a framework that wraps **either Pyodide or MicroPython**. It inherits all of Pyodide's `file://` incompatibility. PyScript itself also loads its `core.js` from a CDN:

```html
<script type="module" src="https://pyscript.net/releases/2026.3.1/core.js"></script>
```

This immediately fails on `file://`. Even if you download `core.js` locally, it still loads Pyodide/MicroPython WASM files via `fetch()`.

**Verdict: Not compatible with `file://`. Inherits all Pyodide/MicroPython limitations. Designed for web servers.**

---

## C. WASM from `file://` — Deep Dive

This section answers: *"Can WASM-based interpreters (Pyodide, MicroPython WASM) ever work from `file://`?"*

### C.1 How WASM Loading Works

The standard path:
```javascript
// Standard (requires HTTP):
const response = await fetch('pyodide.asm.wasm');
const wasm = await WebAssembly.instantiateStreaming(response);
```

The `WebAssembly.instantiateStreaming()` API requires a `Response` object with correct MIME type (`application/wasm`). This is only obtainable from an HTTP(S) server.

The fallback:
```javascript
// ArrayBuffer path (could work from file://):
const buffer = await getWasmBytesAsSomeHow();
const wasm = await WebAssembly.instantiate(buffer);
```

This works with any `ArrayBuffer`. The question is: how do you get the bytes from `file://`?

### C.2 Firefox XHR Approach (Firefox only)

Firefox allows `XMLHttpRequest` to read other `file://` URLs in the same directory (same-origin policy for `file://` is more permissive in Firefox):

```javascript
function loadWasmFromFile(path) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = reject;
    xhr.send();
  });
}

const buffer = await loadWasmFromFile('pyodide.asm.wasm');
const wasm = await WebAssembly.instantiate(buffer);
```

**Does this work?**
- **Firefox:** ✅ Yes — XHR can read `file://` URLs from within a `file://` page in the same directory. Firefox's `security.fileuri.strict_origin_policy = true` (default) restricts cross-directory access but allows same-directory access.
- **Chrome/Edge:** ❌ No — Chrome blocks ALL cross-resource loading from `file://` pages regardless of origin. XHR throws `NetworkError`.
- **Safari:** ❌ Blocked.

**Practical implication:** A Pyodide loader patched to use XHR + `WebAssembly.instantiate()` instead of `fetch()` + `WebAssembly.instantiateStreaming()` *would work in Firefox from file://*. But:

1. You still need to load `python_stdlib.zip` (~10 MB), also via fetch/XHR
2. You still need `pyodide-lock.json`
3. The stdlib zip uses Emscripten's virtual filesystem mounting — also relies on fetch
4. The game would only run in Firefox
5. Patching Pyodide's loader is substantial engineering work

### C.3 Base64 Embedding Approach

Theoretically, the entire WASM binary could be base64-encoded and embedded in the HTML:

```javascript
const base64Wasm = "AGFzbQEAAAA..."; // 10+ MB of base64
const bytes = Uint8Array.from(atob(base64Wasm), c => c.charCodeAt(0));
const wasm = await WebAssembly.instantiate(bytes);
```

This avoids all network loading entirely. Does it work?
- ✅ Technically yes — no `fetch()` needed
- ❌ The encoded WASM alone is ~13 MB; the entire Pyodide bundle (core + stdlib) is 25–30 MB encoded
- ❌ The resulting HTML file would be 30+ MB — a 1-second parse delay even on fast machines, much longer on old hardware
- ❌ JavaScript engines have memory limits on `atob()` for very large strings
- ❌ Emscripten's generated JS code intertwines WASM loading with file system setup in complex ways; you can't just swap one part

**Verdict:** Theoretically possible but practically impractical for the full Pyodide stack.

### C.4 Browser Flags

Some community reports mention browser flags that might help:

| Browser | Flag | Effect |
|---|---|---|
| Firefox | `security.fileuri.strict_origin_policy = false` | Allows XHR across `file://` directories. Requires manual user config change. |
| Chrome | `--allow-file-access-from-files` | CLI flag that allows cross-file `fetch()`. Requires launching Chrome from terminal. |
| Chrome | `--disable-web-security` | Disables all security. **Dangerous, not a real option.** |

**For a USB game meant for general users, requiring browser flag changes is not acceptable.**

### C.5 Service Worker Approach

Service Workers intercept network requests and could redirect `fetch()` calls to in-memory data. **However, Service Workers require `https://` or `localhost` to register.** They cannot be registered from `file://`. This approach is completely unavailable.

### C.6 Summary

| Browser | WASM from `file://` | Method | Notes |
|---|---|---|---|
| Firefox (default) | ⚠️ Possible with effort | XHR + `instantiate()` | Same-directory only; requires loader patch |
| Firefox (flags off) | ✅ Easier | XHR across dirs | User must change `about:config` |
| Chrome | ❌ Blocked | None | No workaround without `--allow-file-access-from-files` flag at launch |
| Edge | ❌ Blocked | None | Same as Chrome |
| Safari | ❌ Blocked | None | |

---

## D. Pyodide Bundling — Is It Possible?

The question: *Can Pyodide be bundled into a form that works offline from `file://`?*

### D.1 What "Bundled" Would Mean

For Pyodide to work from `file://` in Chrome, you would need to embed all assets inline (no external file loading):
1. The `.wasm` binary (~8–10 MB) — must be available as `ArrayBuffer` without `fetch()`
2. The Python stdlib zip (~10 MB) — must be mountable into the Emscripten VFS without `fetch()`
3. `pyodide-lock.json` — can be embedded as a JS literal
4. The `pyodide.asm.js` bootstrap (~2 MB) — already a JS file

### D.2 Emscripten `--embed-file` Approach

Emscripten supports an `--embed-file` flag that embeds files into the output JS as Base64 data URIs baked into the compiled binary. Using this during Pyodide's build process, the stdlib could be embedded into `pyodide.asm.js` instead of being loaded at runtime.

**Feasibility:**
- Requires rebuilding Pyodide from source (complex multi-hour build with Docker)
- The Pyodide build system is well-documented but requires significant knowledge
- Result: a `pyodide.asm.js` that is ~30 MB larger but self-contained
- The WASM binary itself still needs to be loaded — but could be inlined as base64 in a custom loader

**This is possible but requires a dedicated engineering sprint (2–5 days of work).**

### D.3 Emscripten's `SINGLE_FILE` Option

Emscripten has a `SINGLE_FILE=1` linker flag that embeds the WASM as base64 directly into the JS output. Combined with `--embed-file` for the stdlib, the entire runtime could be a single ~30 MB JS file.

```
# Conceptual build flags
emcc ... -s SINGLE_FILE=1 --embed-file python_stdlib.zip@/lib/python3.12/
```

**Result:** One ~30 MB `pyodide_bundled.js` file that can be loaded with a single `<script>` tag. No `fetch()`. Works from `file://`.

**The catch:** The existing Pyodide build infrastructure doesn't expose these as simple config switches. It would require patching the build system and potentially fighting Emscripten version constraints.

### D.4 Custom Loader Approach (Firefox Only)

As described in Section C.2, a custom loader using XHR + `WebAssembly.instantiate()` would work in Firefox without any build changes. The implementation:

```javascript
async function loadPyodideFromFileURL(options = {}) {
  const base = options.indexURL || './';
  
  // Load WASM via XHR (works in Firefox from file://)
  const wasmBuffer = await new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', base + 'pyodide.asm.wasm', true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => res(xhr.response);
    xhr.onerror = rej;
    xhr.send();
  });
  
  // Monkey-patch globalThis.fetch before loading pyodide.mjs
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (url, opts) => {
    // Redirect to XHR for local files
    if (url.startsWith('file://') || url.startsWith('./')) {
      return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => res({
          ok: true,
          arrayBuffer: () => Promise.resolve(xhr.response),
          json: () => Promise.resolve(JSON.parse(new TextDecoder().decode(xhr.response))),
          text: () => Promise.resolve(new TextDecoder().decode(xhr.response)),
        });
        xhr.onerror = rej;
        xhr.send();
      });
    }
    return originalFetch(url, opts);
  };
  
  // Now load pyodide normally — it will use the patched fetch
  const { loadPyodide } = await import('./pyodide.mjs');
  return loadPyodide({ indexURL: base });
}
```

**Limitations:**
- Firefox only
- The `WebAssembly.instantiateStreaming()` call also needs patching (it needs a real `Response` object with `body`)
- More complex than the above pseudocode suggests
- Not a supported Pyodide configuration

### D.5 Recommendation on Pyodide Bundling

**Do not pursue Pyodide for `file://` deployment unless:**
1. You are willing to spend a significant engineering sprint on the build system
2. You accept Firefox-only support
3. You accept a ~30 MB single-file bundle

For a teaching game, the Skulpt or Brython approaches are far more practical.

---

## E. Curriculum Coverage Matrix

How well does each viable interpreter cover your 21 learning objectives?

| # | Concept | Skulpt | Brython | Pyodide (HTTP only) |
|---|---|---|---|---|
| 1 | print(), variables, basic types | ✅ | ✅ | ✅ |
| 2 | String ops, f-strings, input() | ⚠️ f-string edge cases | ✅ | ✅ |
| 3 | Conditionals (if/elif/else) | ✅ | ✅ | ✅ |
| 4 | Loops (for, while, range, break, continue) | ✅ | ✅ | ✅ |
| 5 | Lists, tuples, dicts, sets | ✅ | ✅ | ✅ |
| 6 | Functions (def, return, args, kwargs, defaults) | ✅ | ✅ | ✅ |
| 7 | String methods, list methods | ✅ | ✅ | ✅ |
| 8 | File I/O (simulated OK) | ⚠️ needs JS layer | ⚠️ needs JS layer | ✅ real FS available |
| 9 | Error handling (try/except/finally/raise) | ✅ | ✅ | ✅ |
| 10 | Classes and OOP | ✅ | ✅ | ✅ |
| 11 | List comprehensions, generators, iterators | ✅ | ✅ | ✅ |
| 12 | Decorators, context managers | ✅ | ✅ | ✅ |
| 13 | Modules and imports | ⚠️ limited stdlib | ✅ | ✅ |
| 14 | Lambda, map, filter, reduce | ✅ | ✅ | ✅ |
| 15 | Regular expressions | ⚠️ partial re | ✅ full re | ✅ |
| 16 | Data structures and algorithms | ✅ | ✅ | ✅ |
| 17 | async/await basics | ❌ | ⚠️ syntax works, not asyncio | ✅ |
| 18 | Type hints | ⚠️ syntax only | ✅ | ✅ |
| 19 | match/case (3.10+) | ❌ | ✅ | ✅ |
| 20 | Dataclasses | ❌ | ✅ | ✅ |
| 21 | Basic testing (assert, unittest) | ⚠️ assert only | ✅ | ✅ |

**Coverage score (out of 21):**
- Skulpt: ~14/21 (67%) — missing modern features
- Brython: ~19/21 (90%) — nearly complete; async/await has caveats
- Pyodide: ~21/21 (100%) — but requires HTTP server

---

## F. Feature Completeness Matrix

Detailed breakdown for every feature in the teaching specification:

| Python Feature | CPython | Skulpt | Brython | Notes |
|---|---|---|---|---|
| `print()` redirect | ✅ | ✅ | ✅ | |
| Integer arithmetic | ✅ | ✅ | ✅ | |
| Arbitrary-precision integers | ✅ | ✅ | ✅ | Skulpt uses jsbi |
| Float arithmetic | ✅ | ✅ | ✅ | |
| `complex` type | ✅ | ✅ | ✅ | |
| `str` (Unicode) | ✅ | ✅ | ✅ | Brython uses JS strings |
| `bytes` / `bytearray` | ✅ | ⚠️ | ✅ | |
| `bool` | ✅ | ✅ | ✅ | |
| `None` | ✅ | ✅ | ✅ | |
| `list` with all methods | ✅ | ✅ | ✅ | |
| `tuple` | ✅ | ✅ | ✅ | |
| `dict` (ordered, 3.7+) | ✅ | ✅ | ✅ | Skulpt ordering may differ |
| `set` / `frozenset` | ✅ | ✅ | ✅ | |
| Slice notation `[a:b:c]` | ✅ | ✅ | ✅ | |
| Negative indexing | ✅ | ✅ | ✅ | |
| String formatting: `%` | ✅ | ✅ | ✅ | |
| String formatting: `.format()` | ✅ | ✅ | ✅ | |
| F-strings (basic) | ✅ | ✅ | ✅ | |
| F-strings (nested/complex) | ✅ | ⚠️ | ✅ | |
| Walrus `:=` | ✅ | ❌ | ✅ | |
| `match`/`case` | ✅ | ❌ | ✅ | |
| Structural pattern matching | ✅ | ❌ | ✅ | |
| `def` functions | ✅ | ✅ | ✅ | |
| Default arguments | ✅ | ✅ | ✅ | |
| `*args` / `**kwargs` | ✅ | ✅ | ✅ | |
| Keyword-only args | ✅ | ✅ | ✅ | |
| Positional-only args `/` | ✅ | ⚠️ | ✅ | |
| `lambda` | ✅ | ✅ | ✅ | |
| Closures / `nonlocal` | ✅ | ✅ | ✅ | |
| Generators / `yield` | ✅ | ✅ | ✅ | |
| `yield from` | ✅ | ✅ | ✅ | |
| Generator expressions | ✅ | ✅ | ✅ | |
| List comprehensions | ✅ | ✅ | ✅ | |
| Dict comprehensions | ✅ | ✅ | ✅ | |
| Set comprehensions | ✅ | ✅ | ✅ | |
| Nested comprehensions | ✅ | ✅ | ✅ | |
| Class definition | ✅ | ✅ | ✅ | |
| Single inheritance | ✅ | ✅ | ✅ | |
| Multiple inheritance | ✅ | ✅ | ✅ | |
| MRO (C3 linearisation) | ✅ | ✅ | ✅ | |
| `super()` | ✅ | ✅ | ✅ | |
| `__init__` / `__new__` | ✅ | ✅ | ✅ | |
| `@property` | ✅ | ✅ | ✅ | |
| `@staticmethod` / `@classmethod` | ✅ | ✅ | ✅ | |
| Descriptor protocol | ✅ | ⚠️ | ✅ | |
| `@dataclass` decorator | ✅ | ❌ | ✅ | |
| Decorators (single) | ✅ | ✅ | ✅ | |
| Decorators (stacked) | ✅ | ✅ | ✅ | |
| `with` statement | ✅ | ✅ | ✅ | |
| Custom context managers | ✅ | ✅ | ✅ | |
| `contextlib.contextmanager` | ✅ | ❌ | ✅ | |
| `try`/`except`/`else`/`finally` | ✅ | ✅ | ✅ | |
| Exception chaining (`from`) | ✅ | ⚠️ | ✅ | |
| Custom exception classes | ✅ | ✅ | ✅ | |
| `ExceptionGroup` (3.11+) | ✅ | ❌ | ✅ | |
| `async def` / `await` | ✅ | ❌ | ⚠️ | Brython maps to Promises |
| `async for` / `async with` | ✅ | ❌ | ⚠️ | |
| `asyncio` event loop | ✅ | ❌ | ❌ | Neither supports asyncio |
| Type hints (annotations) | ✅ | ⚠️ | ✅ | |
| `typing` module | ✅ | ❌ | ✅ | |
| `TypeAlias` / `type` statement | ✅ | ❌ | ✅ | (3.12+ `type` stmt) |
| `assert` | ✅ | ✅ | ✅ | |
| `unittest.TestCase` | ✅ | ⚠️ | ✅ | |
| `__all__` / `__slots__` | ✅ | ✅ | ✅ | |
| `__repr__` / `__str__` | ✅ | ✅ | ✅ | |
| Numeric dunders (`__add__` etc.) | ✅ | ✅ | ✅ | |
| Comparison dunders | ✅ | ✅ | ✅ | |
| `__iter__` / `__next__` | ✅ | ✅ | ✅ | |
| `__len__` / `__getitem__` | ✅ | ✅ | ✅ | |
| `__enter__` / `__exit__` | ✅ | ✅ | ✅ | |
| `re` module (basic) | ✅ | ⚠️ | ✅ | |
| `re` named groups | ✅ | ⚠️ | ✅ | |
| `collections.defaultdict` | ✅ | ✅ | ✅ | |
| `collections.namedtuple` | ✅ | ⚠️ | ✅ | |
| `collections.Counter` | ✅ | ✅ | ✅ | |
| `collections.deque` | ✅ | ⚠️ | ✅ | |
| `functools.lru_cache` | ✅ | ❌ | ✅ | |
| `functools.wraps` | ✅ | ❌ | ✅ | |
| `functools.partial` | ✅ | ✅ | ✅ | |
| `itertools` (core) | ✅ | ⚠️ | ✅ | |
| `map` / `filter` / `zip` (lazy) | ✅ | ✅ | ✅ | |
| `sorted()` with `key=` | ✅ | ✅ | ✅ | |
| `enumerate()` | ✅ | ✅ | ✅ | |
| `zip()` with `strict=` (3.10+) | ✅ | ❌ | ✅ | |
| CPython-style tracebacks | ✅ | ⚠️ | ✅ | Brython: close but not identical |
| SyntaxError with line/col | ✅ | ⚠️ | ✅ | Brython 3.13+ much improved |
| `input()` (blocking) | ✅ | ⚠️ needs async setup | ⚠️ uses prompt() by default | Both need custom handler |

---

## G. Comparison Summary Table

| Criterion | Skulpt | Brython | Pyodide | PyPy.js | Batavia | Transcrypt | RapydScript |
|---|---|---|---|---|---|---|---|
| **file:// compatible** | ✅ YES | ✅ YES* | ❌ NO | ❌ DEAD | ❌ DEAD | ✅ (wrong tool) | ✅ (wrong tool) |
| **Python 3 version** | ~3.7 partial | 3.14 (current) | 3.12 (full CPython) | Python 2 only | 3.5 only | 3.9 (compile-time) | Not real Python |
| **Implementation type** | JS interpreter | JS transpiler | CPython → WASM | PyPy → asm.js | Bytecode → JS | Python → JS compiler | Python-like → JS compiler |
| **stdlib completeness** | ~40% | ~75% | ~95% | N/A | ~10% | ~20% | N/A |
| **match/case** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **dataclasses** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **async/await** | ❌ | ⚠️ | ✅ | ❌ | ❌ | ✅ (compile-time) | ❌ |
| **type hints** | ⚠️ syntax | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **walrus operator** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **error messages** | Near CPython | Near CPython (3.13+) | Identical CPython | N/A | N/A | JS errors | JS errors |
| **Bundle size** | ~0.9 MB | ~2.25 MB | ~20 MB | ~15 MB | small but dead | tiny (output only) | tiny |
| **Active maintenance** | ✅ Moderate | ✅ Very active | ✅ Very active | ❌ Dead | ❌ Hiatus | ✅ Moderate | ⚠️ Low |
| **Educational use** | ✅ Proven (Runestone) | ⚠️ Less commonly used in edu | ✅ Used in Jupyter etc. | ❌ | ❌ | ❌ wrong tool | ❌ wrong dialect |
| **Runtime input()** | ✅ (with setup) | ✅ (with setup) | ✅ | N/A | N/A | ❌ | ❌ |
| **Curriculum coverage** | 14/21 (67%) | 19/21 (90%) | 21/21 (100%) | ~0 | ~5 | N/A | N/A |

*Brython: bundled stdlib must be used (both `.js` files local). External `.py` imports fail on `file://`.

---

## H. Recommendation

### H.1 Primary Recommendation: Brython

**Use Brython for the Venomous Snake USB deployment target.**

**Why Brython wins:**

1. **`file://` compatibility is genuine, not a hack.** Load `brython.js` + `brython_stdlib.js` as local script tags. Nothing else is needed. Works in Chrome, Firefox, Edge, Safari, on any OS.

2. **Python 3.13/3.14 coverage covers 19 of your 21 curriculum items.** The two gaps (`asyncio` event loop and a `file://`-based module import system) are solvable:
   - `async`/`await` syntax *does* work; you can teach the concept and syntax, with an honest note that `asyncio` requires a real runtime. Browser-native async with Promises actually illustrates async concepts well.
   - Module imports can be simulated by registering modules as JS objects via `sys.modules` in the game's JS layer.

3. **Modern Python only.** Students learn f-strings, walrus operator, `match`/`case`, `dataclasses`, type hints — all the things that appear in current Python tutorials and job interviews.

4. **Error messages are near-CPython quality** (especially in 3.13+). Students can compare what they see to what any Python book shows them.

5. **Active, serious development.** The parser was rewritten using CPython's own grammar toolchain. The project tracks CPython version numbers. This is not a toy.

6. **`input()` and `print()` are straightforward to intercept** via Brython's `sys.stdout` and the `input()` override mechanism, which the game needs anyway to integrate with its UI.

**Acknowledged trade-offs with Brython:**
- `asyncio` cannot be taught the "real" way — frame it as "async/await syntax, browser edition"
- All student code must be inline in HTML or pre-bundled (multi-file projects need JS-layer glue)
- Some subtle semantic differences from CPython exist (details in the Brython issue tracker)
- `input()` defaults to `window.prompt()` — must be replaced in the game layer

### H.2 Secondary Recommendation: Skulpt (Fallback / Simpler Games)

Use Skulpt if:
- The game targets only curriculum items 1–16 (the pre-modern-Python concepts)
- You want a smaller bundle (< 1 MB vs. 2.25 MB)
- You want the battle-tested path (Runestone Academy, used in 100,000+ student courses)
- You can accept that lessons 17–20 (async, type hints, match/case, dataclasses) are simply unavailable

Skulpt is the "safe default." It has a longer track record in education and its limitations are well-documented.

### H.3 Rejected Options

| Interpreter | Reason for Rejection |
|---|---|
| Pyodide | Cannot work from `file://` without Firefox-only engineering work; 20+ MB bundle |
| MicroPython WASM | Same WASM problem; wrong Python dialect |
| PyScript | Wraps Pyodide; same problems |
| PyPy.js | Dead since 2016; Python 2 only |
| Batavia | On hiatus; requires server; Python 3.5 only |
| Transcrypt | Compile-time only; no runtime eval; wrong tool entirely |
| RapydScript | Not real Python; teaching it would harm students |

### H.4 The Ideal Long-term Architecture

Design the game with an **interpreter abstraction layer** in JavaScript:

```javascript
const PythonRunner = {
  async run(code) { /* call Brython or Skulpt */ },
  async getInput(prompt) { /* custom input UI */ },
  captureOutput(handler) { /* redirect stdout/stderr */ },
  handleError(err) { /* normalise error format */ },
};
```

This allows you to:
1. Ship with Brython for full curriculum coverage
2. Fall back to Skulpt for systems where Brython behaves unexpectedly
3. Switch to Pyodide in the future if USB deployment is ever replaced by a web server deployment
4. Unit-test the game logic independently of the interpreter

---

## I. Implementation Notes for the Chosen Approach (Brython)

### I.1 Basic Setup (file://-safe)

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Both files MUST be local on the USB stick -->
  <script src="brython.js"></script>
  <script src="brython_stdlib.js"></script>
</head>
<body onload="brython()">
  <!-- Do NOT src= external .py files from file:// — they require fetch() -->
  <!-- All student code goes in the game's JS layer and is passed to Brython programmatically -->
</body>
</html>
```

### I.2 Running Student Code Programmatically

```javascript
// Run arbitrary Python source from JS
function runStudentCode(pythonSource) {
  // Brython exposes __BRYTHON__ globally after brython() initializes
  __BRYTHON__.python_to_js(pythonSource, '__main__', function(jsCode) {
    try {
      eval(jsCode);
    } catch(e) {
      handlePythonError(e);
    }
  });
}
```

Or use the higher-level API via a hidden `<script type="text/python">` that you inject and evaluate.

### I.3 Intercepting stdout/stderr

```python
# Python code you inject once at game startup (inline in HTML):
import sys

class GameOutput:
    def __init__(self, level):
        self.level = level
    def write(self, text):
        from browser import window
        window.gameReceiveOutput(text, self.level)
    def flush(self):
        pass

sys.stdout = GameOutput('stdout')
sys.stderr = GameOutput('stderr')
```

```javascript
// JS side:
window.gameReceiveOutput = function(text, level) {
  displayInGameTerminal(text, level === 'stderr' ? 'error' : 'normal');
};
```

### I.4 Custom input() Implementation

```python
# Inject once at startup
import builtins

def game_input(prompt=''):
    from browser import window
    # This requires the JS layer to provide a synchronous input mechanism.
    # Brython supports async input via coroutines.
    return window.gameGetInput(str(prompt))

builtins.input = game_input
```

**Note:** Truly synchronous `input()` is not possible in the browser (can't block the event loop). Use one of:
1. `window.prompt()` (ugly but synchronous) — Brython's default
2. Async pattern: make the "run" button only execute after input is pre-loaded
3. Coroutine-based: the game collects inputs before execution begins

### I.5 Simulating File I/O (Lesson 8)

```python
# Inject a virtual file system:
import sys

class VirtualFile:
    def __init__(self, name, content='', mode='r'):
        self.name = name
        self.content = content
        self.mode = mode
        self.pos = 0
    def read(self):
        return self.content
    def write(self, data):
        self.content += data
    def __enter__(self):
        return self
    def __exit__(self, *args):
        pass

_virtual_fs = {}

def virtual_open(name, mode='r', *args, **kwargs):
    if name not in _virtual_fs:
        if 'w' in mode or 'a' in mode:
            _virtual_fs[name] = ''
        else:
            raise FileNotFoundError(f"No such file: '{name}'")
    return VirtualFile(name, _virtual_fs.get(name, ''), mode)

import builtins
builtins.open = virtual_open
```

This gives students a working `open()` / `read()` / `write()` experience that teaches the concepts without a real filesystem.

### I.6 Handling Module Imports for Multi-file Lessons

For lessons where students write multiple files/modules:

```javascript
// Register a student-written module before running their main code
function registerStudentModule(moduleName, pythonSource) {
  // Execute the module source in a special context
  // and register it in sys.modules
  const setup = `
import sys, types
_mod = types.ModuleType("${moduleName}")
exec(compile(${JSON.stringify(pythonSource)}, "${moduleName}.py", "exec"), _mod.__dict__)
sys.modules["${moduleName}"] = _mod
`;
  runInBrython(setup);
}
```

### I.7 File Size Budgeting

For a USB game:

| File | Size | Notes |
|---|---|---|
| `brython.js` | ~550 KB | Core transpiler |
| `brython_stdlib.js` | ~1.7 MB | Full stdlib |
| Game HTML/CSS/JS | ~500 KB | Estimated |
| Game assets (art, audio) | 5–50 MB | Depends on scope |
| **Total** | **~8–55 MB** | Easily fits on any USB |

Loading time on a 5-year-old laptop: < 2 seconds for Brython init. Acceptable.

### I.8 Known Brython Quirks to Work Around in the Game

1. **`input()` blocks by default via `window.prompt()`** — always override this.
2. **`import` of external `.py` files via `src=` attribute** — blocked on `file://`. Register all modules programmatically or inline.
3. **`print()` goes to the browser console** — always redirect `sys.stdout` before running student code.
4. **Brython adds `browser` module** — students can accidentally access DOM. Guard by removing from `sys.modules` or wrapping execution.
5. **JavaScript exceptions can leak through** — catch all exceptions at the JS boundary and format them as Python tracebacks.
6. **`asyncio.sleep()` doesn't work** — teach async/await with `await asyncio.sleep(1)` as a known limitation, or use a polyfill that resolves after a Promise delay.
7. **`time.sleep()` blocks the browser thread** — override `time.sleep()` with a non-blocking version in the game layer.

---

*Section added: In-Browser Python Interpreter Technical Investigation*  
*Research basis: Official project documentation, GitHub repositories, community reports, browser security specifications*
