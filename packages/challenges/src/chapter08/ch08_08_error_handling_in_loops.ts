import type { Challenge } from '@venomous-snake/shared-types';

export const ch08_08_error_handling_in_loops: Challenge = {
  id: 'ch08_08_error_handling_in_loops',
  titleKey: 'challenges.ch08_08.title',
  descriptionKey: 'challenges.ch08_08.description',
  chapter: 8,
  order: 8,
  difficulty: 'medium',
  scaffoldingLevel: 'open',
  prerequisites: ['ch08_07_graceful_degradation'],
  xpReward: 200,
  tags: ['error-handling', 'loops', 'recovery'],
  scaffoldedCode:
    '# Process a list of codes, converting to int\n# Use try/except to replace invalid codes with 0\n# codes = ["42", "??", "17", "error", "99"]\n',
  solutionCode:
    'codes = ["42", "??", "17", "error", "99"]\nresults = []\nfor code in codes:\n    try:\n        results.append(int(code))\n    except ValueError:\n        results.append(0)\nprint(results)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should process codes with error recovery',
      expectedOutput: '[42, 0, 17, 0, 99]',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should replace invalid codes with 0',
      expectedOutput: '[42, 0, 17, 0, 99]',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Wrap the int() conversion in a try/except inside the loop.' },
    { tier: 2 as const, text: 'When ValueError occurs, append 0 instead of the converted value.' },
    { tier: 3 as const, text: 'Solution: try: results.append(int(code)) except ValueError: results.append(0)' },
  ],
  roomId: 'floor_8_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch08_08.pre',
  postDialogKey: 'dialog.ch08_08.post',
  conceptsIntroduced: ['error_recovery_loops'],
  conceptsReinforced: ['try_except', 'for_loop', 'list_methods'],
};
