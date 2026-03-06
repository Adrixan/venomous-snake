import type { Challenge } from '@venomous-snake/shared-types';

export const ch01_01_hello_world: Challenge = {
  id: 'ch01_01_hello_world',
  titleKey: 'challenges.ch01_01.title',
  descriptionKey: 'challenges.ch01_01.description',
  chapter: 1,
  order: 1,
  difficulty: 'beginner',
  scaffoldingLevel: 'guided',
  prerequisites: [],
  xpReward: 50,
  tags: ['print', 'strings'],

  scaffoldedCode:
    '# Your first hack: display a message on the security terminal\n# Replace the ___ with your message\nprint(___)',
  editableRegions: [{ startLine: 3, endLine: 3, placeholder: '"Hello, World!"' }],
  solutionCode: 'print("Hello, World!")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print "Hello, World!"',
      expectedOutput: 'Hello, World!',
      hidden: false,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'The print() function displays text on screen. Put your text inside quotes.',
    },
    {
      tier: 2,
      text: 'Try print("Hello, World!") — text in Python must be wrapped in quotes.',
    },
    { tier: 3, text: 'The answer is: print("Hello, World!")' },
  ],

  roomId: 'lobby_terminal_room',
  terminalId: 'terminal_01',
  preDialogKey: 'dialog.ch01_01.pre',
  postDialogKey: 'dialog.ch01_01.post',

  conceptsIntroduced: ['print', 'strings', 'function_call'],
  conceptsReinforced: [],
};
