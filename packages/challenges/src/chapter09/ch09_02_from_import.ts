import type { Challenge } from '@venomous-snake/shared-types';

export const ch09_02_from_import: Challenge = {
  id: 'ch09_02_from_import',
  titleKey: 'challenges.ch09_02.title',
  descriptionKey: 'challenges.ch09_02.description',
  chapter: 9,
  order: 2,
  difficulty: 'medium',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch09_01_importing_modules'],
  xpReward: 180,
  tags: ['modules', 'from-import'],
  scaffoldedCode:
    'from math import ___, ___, ___\nprint(round(___, 4))\nprint(___(7.2))\nprint(___(7.8))',
  editableRegions: [
    { startLine: 1, endLine: 1, placeholder: 'pi, ceil, floor' },
  ],
  solutionCode:
    'from math import pi, ceil, floor\nprint(round(pi, 4))\nprint(ceil(7.2))\nprint(floor(7.8))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should use selective imports',
      expectedOutput: '3.1416\n8\n7',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should import pi, ceil, floor from math',
      expectedOutput: '3.1416\n8\n7',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'from math import pi, ceil, floor imports specific names directly.' },
    { tier: 2 as const, text: 'After from-import, use the names directly: pi, ceil(7.2), floor(7.8).' },
    { tier: 3 as const, text: 'Solution: from math import pi, ceil, floor' },
  ],
  roomId: 'floor_9_room_01',
  terminalId: 'terminal_02',
  preDialogKey: 'dialog.ch09_02.pre',
  postDialogKey: 'dialog.ch09_02.post',
  conceptsIntroduced: ['from_import', 'selective_import'],
  conceptsReinforced: ['import_module', 'math_module'],
};
