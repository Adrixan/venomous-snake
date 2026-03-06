import type { Challenge } from '@venomous-snake/shared-types';

export const ch01_07_multiple_prints: Challenge = {
  id: 'ch01_07_multiple_prints',
  titleKey: 'challenges.ch01_07.title',
  descriptionKey: 'challenges.ch01_07.description',
  chapter: 1,
  order: 7,
  difficulty: 'beginner',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch01_01_hello_world'],
  xpReward: 75,
  tags: ['print', 'strings', 'ascii_art'],

  scaffoldedCode:
    '# Draw a snake on the terminal using print statements\n# Replace each ___ with the correct string\nprint(___)\nprint(___)\nprint(___)',
  editableRegions: [
    { startLine: 3, endLine: 3, placeholder: '"  /\\_/\\\\"' },
    { startLine: 4, endLine: 4, placeholder: '" ( o.o)"' },
    { startLine: 5, endLine: 5, placeholder: '"  > ^ <"' },
  ],
  solutionCode: 'print("  /\\_/\\\\")\nprint(" ( o.o)")\nprint("  > ^ <")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print the complete snake ASCII art',
      expectedOutput: '  /\\_/\\\n ( o.o)\n  > ^ <',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should have exactly 3 lines of output',
      expectedOutput: '  /\\_/\\\n ( o.o)\n  > ^ <',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Each print() statement creates one line of output. You need three print calls.',
    },
    {
      tier: 2,
      text: 'Backslashes are special in Python strings. Use \\\\ to print a single backslash.',
    },
    {
      tier: 3,
      text: 'Solution: print("  /\\_/\\\\"), print(" ( o.o)"), print("  > ^ <")',
    },
  ],

  roomId: 'lobby_terminal_room',
  terminalId: 'terminal_07',
  preDialogKey: 'dialog.ch01_07.pre',
  postDialogKey: 'dialog.ch01_07.post',

  conceptsIntroduced: ['multiple_prints', 'escape_characters'],
  conceptsReinforced: ['print', 'strings'],
};
