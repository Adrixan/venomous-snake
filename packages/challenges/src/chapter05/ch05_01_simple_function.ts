import type { Challenge } from '@venomous-snake/shared-types';

export const ch05_01_simple_function: Challenge = {
  id: 'ch05_01_simple_function',
  titleKey: 'challenges.ch05_01.title',
  descriptionKey: 'challenges.ch05_01.description',
  chapter: 5,
  order: 1,
  difficulty: 'easy',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch04_10_for_enumerate'],
  xpReward: 125,
  tags: ['function', 'def', 'return'],

  scaffoldedCode:
    '# Define a function that greets an operative by name\ndef greet(___):\n    return f"Welcome, Agent {___}!"\n\nprint(greet("Viper"))',
  editableRegions: [
    { startLine: 2, endLine: 3, placeholder: 'name):\n    return f"Welcome, Agent {name}!"' },
  ],
  solutionCode: 'def greet(name):\n    return f"Welcome, Agent {name}!"\n\nprint(greet("Viper"))',

  testCases: [
    {
      id: 'tc01',
      description: 'Should greet Agent Viper',
      expectedOutput: 'Welcome, Agent Viper!',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should return a formatted greeting string',
      expectedOutput: 'Welcome, Agent Viper!',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Functions are defined with def. Parameters go in parentheses after the name.',
    },
    {
      tier: 2,
      text: 'def greet(name): — the parameter "name" receives the value passed when calling greet().',
    },
    {
      tier: 3,
      text: 'Solution: def greet(name): return f"Welcome, Agent {name}!"',
    },
  ],

  roomId: 'floor_5_room_01',
  terminalId: 'terminal_01',
  preDialogKey: 'dialog.ch05_01.pre',
  postDialogKey: 'dialog.ch05_01.post',

  conceptsIntroduced: ['function_definition', 'parameters', 'return_statement'],
  conceptsReinforced: ['fstrings', 'print'],
};
