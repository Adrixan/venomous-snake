import type { Challenge } from '@venomous-snake/shared-types';

export const ch02_05_input_basics: Challenge = {
  id: 'ch02_05_input_basics',
  titleKey: 'challenges.ch02_05.title',
  descriptionKey: 'challenges.ch02_05.description',
  chapter: 2,
  order: 5,
  difficulty: 'easy',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch02_04_fstrings_basics'],
  xpReward: 100,
  tags: ['input', 'fstrings', 'user_input'],

  scaffoldedCode: '# Ask the user for their codename and greet them\ncodename = ___\nprint(___)',
  editableRegions: [
    { startLine: 2, endLine: 2, placeholder: 'input("Enter your codename: ")' },
    { startLine: 3, endLine: 3, placeholder: 'f"Welcome, Agent {codename}!"' },
  ],
  solutionCode: 'codename = input("Enter your codename: ")\nprint(f"Welcome, Agent {codename}!")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should greet Agent Viper',
      input: 'Viper',
      expectedOutput: 'Welcome, Agent Viper!',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should greet Agent Shadow',
      input: 'Shadow',
      expectedOutput: 'Welcome, Agent Shadow!',
      hidden: false,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'The input() function reads text typed by the user and returns it as a string.',
    },
    {
      tier: 2,
      text: 'Store the result of input() in a variable: codename = input("prompt text").',
    },
    {
      tier: 3,
      text: 'Solution: codename = input("Enter your codename: ") then print(f"Welcome, Agent {codename}!")',
    },
  ],

  roomId: 'floor_2_room_01',
  terminalId: 'terminal_05',
  preDialogKey: 'dialog.ch02_05.pre',
  postDialogKey: 'dialog.ch02_05.post',

  conceptsIntroduced: ['input', 'user_input'],
  conceptsReinforced: ['fstrings', 'variables', 'print'],
};
