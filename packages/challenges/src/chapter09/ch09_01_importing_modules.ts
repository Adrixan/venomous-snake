import type { Challenge } from '@venomous-snake/shared-types';

export const ch09_01_importing_modules: Challenge = {
  id: 'ch09_01_importing_modules',
  titleKey: 'challenges.ch09_01.title',
  descriptionKey: 'challenges.ch09_01.description',
  chapter: 9,
  order: 1,
  difficulty: 'medium',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch08_08_error_handling_in_loops'],
  xpReward: 175,
  tags: ['modules', 'import', 'math', 'random'],
  scaffoldedCode:
    'import math\nimport random\nrandom.seed(42)\nprint(math.___(144))\nprint(math.___(9.7))\nprint(random.___(1, 10))',
  editableRegions: [
    { startLine: 4, endLine: 6, placeholder: 'sqrt / floor / randint' },
  ],
  solutionCode:
    'import math\nimport random\nrandom.seed(42)\nprint(math.sqrt(144))\nprint(math.floor(9.7))\nprint(random.randint(1, 10))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should use math and random modules',
      expectedOutput: '12.0\n9\n2',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should call correct module functions',
      expectedOutput: '12.0\n9\n2',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'math.sqrt() returns the square root. math.floor() rounds down. random.randint() returns a random integer.' },
    { tier: 2 as const, text: 'Import the module first with import math, then call math.sqrt(144).' },
    { tier: 3 as const, text: 'Solution: math.sqrt(144), math.floor(9.7), random.randint(1, 10)' },
  ],
  roomId: 'floor_9_room_01',
  terminalId: 'terminal_01',
  preDialogKey: 'dialog.ch09_01.pre',
  postDialogKey: 'dialog.ch09_01.post',
  conceptsIntroduced: ['import_module', 'math_module', 'random_module'],
  conceptsReinforced: ['print', 'function_calls'],
};
