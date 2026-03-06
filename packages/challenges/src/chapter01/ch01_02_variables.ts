import type { Challenge } from '@venomous-snake/shared-types';

export const ch01_02_variables: Challenge = {
  id: 'ch01_02_variables',
  titleKey: 'challenges.ch01_02.title',
  descriptionKey: 'challenges.ch01_02.description',
  chapter: 1,
  order: 2,
  difficulty: 'beginner',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch01_01_hello_world'],
  xpReward: 75,
  tags: ['variables', 'strings', 'print'],

  scaffoldedCode:
    '# Store your hacker alias in a variable, then reveal it\n# Replace ___ with your alias as a string\nalias = ___\nprint("Alias:", alias)',
  editableRegions: [{ startLine: 3, endLine: 3, placeholder: '"Ghost"' }],
  solutionCode: 'alias = "Ghost"\nprint("Alias:", alias)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print "Alias: Ghost"',
      expectedOutput: 'Alias: Ghost',
      hidden: false,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Variables store values. Use = to assign: alias = "some text here"',
    },
    {
      tier: 2,
      text: 'Assign a string: alias = "Ghost" — strings in Python are wrapped in quotes.',
    },
    { tier: 3, text: 'Solution:\nalias = "Ghost"\nprint("Alias:", alias)' },
  ],

  roomId: 'lobby_terminal_room',
  terminalId: 'terminal_02',
  preDialogKey: 'dialog.ch01_02.pre',
  postDialogKey: 'dialog.ch01_02.post',

  conceptsIntroduced: ['variables', 'assignment'],
  conceptsReinforced: ['print', 'strings', 'function_call'],
};
