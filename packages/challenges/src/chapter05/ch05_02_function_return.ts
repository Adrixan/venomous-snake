import type { Challenge } from '@venomous-snake/shared-types';

export const ch05_02_function_return: Challenge = {
  id: 'ch05_02_function_return',
  titleKey: 'challenges.ch05_02.title',
  descriptionKey: 'challenges.ch05_02.description',
  chapter: 5,
  order: 2,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch05_01_simple_function'],
  xpReward: 150,
  tags: ['function', 'return', 'arithmetic'],

  scaffoldedCode:
    '# Calculate access level from clearance and rank\ndef calculate_access_level(clearance, rank):\n    return ___\n\nprint(calculate_access_level(3, 4))',
  editableRegions: [{ startLine: 3, endLine: 3, placeholder: 'clearance * rank' }],
  solutionCode:
    'def calculate_access_level(clearance, rank):\n    return clearance * rank\n\nprint(calculate_access_level(3, 4))',

  testCases: [
    {
      id: 'tc01',
      description: 'Should return 12 for clearance=3, rank=4',
      expectedOutput: '12',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should multiply clearance by rank',
      expectedOutput: '12',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'The return statement sends a value back from the function to the caller.',
    },
    {
      tier: 2,
      text: 'Multiply the two parameters: return clearance * rank.',
    },
    {
      tier: 3,
      text: 'Solution: return clearance * rank',
    },
  ],

  roomId: 'floor_5_room_01',
  terminalId: 'terminal_02',
  preDialogKey: 'dialog.ch05_02.pre',
  postDialogKey: 'dialog.ch05_02.post',

  conceptsIntroduced: ['return_values', 'multiple_parameters'],
  conceptsReinforced: ['function_definition', 'arithmetic', 'print'],
};
