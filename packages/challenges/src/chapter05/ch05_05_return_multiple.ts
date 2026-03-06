import type { Challenge } from '@venomous-snake/shared-types';

export const ch05_05_return_multiple: Challenge = {
  id: 'ch05_05_return_multiple',
  titleKey: 'challenges.ch05_05.title',
  descriptionKey: 'challenges.ch05_05.description',
  chapter: 5,
  order: 5,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch05_02_function_return'],
  xpReward: 200,
  tags: ['function', 'return', 'tuple', 'unpacking'],

  scaffoldedCode:
    '# Decode encoded coordinates into x and y values\ndef decode_coordinates(encoded):\n    parts = encoded.split(",")\n    x = int(parts[0])\n    y = int(parts[1])\n    return ___\n\nx, y = decode_coordinates("14,27")\nprint(f"X: {x}, Y: {y}")',
  editableRegions: [{ startLine: 6, endLine: 6, placeholder: 'x, y' }],
  solutionCode:
    'def decode_coordinates(encoded):\n    parts = encoded.split(",")\n    x = int(parts[0])\n    y = int(parts[1])\n    return x, y\n\nx, y = decode_coordinates("14,27")\nprint(f"X: {x}, Y: {y}")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should decode "14,27" to X: 14, Y: 27',
      expectedOutput: 'X: 14, Y: 27',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should return two values from the function',
      expectedOutput: 'X: 14, Y: 27',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Python functions can return multiple values separated by commas: return a, b.',
    },
    {
      tier: 2,
      text: 'return x, y sends both values back. The caller unpacks them: x, y = function().',
    },
    {
      tier: 3,
      text: 'Solution: return x, y',
    },
  ],

  roomId: 'floor_5_room_01',
  terminalId: 'terminal_05',
  preDialogKey: 'dialog.ch05_05.pre',
  postDialogKey: 'dialog.ch05_05.post',

  conceptsIntroduced: ['multiple_return_values', 'tuple_unpacking'],
  conceptsReinforced: ['function_definition', 'return_statement', 'type_conversion'],
};
