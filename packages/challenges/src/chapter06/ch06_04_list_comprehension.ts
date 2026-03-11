import type { Challenge } from '@venomous-snake/shared-types';

export const ch06_04_list_comprehension: Challenge = {
  id: 'ch06_04_list_comprehension',
  titleKey: 'challenges.ch06_04.title',
  descriptionKey: 'challenges.ch06_04.description',
  chapter: 6,
  order: 4,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch06_01_create_list'],
  xpReward: 200,
  tags: ['list_comprehension', 'filter', 'transform'],

  scaffoldedCode:
    '# Filter and transform security scores using list comprehension\nsecurity_scores = [3, 7, 2, 9, 4, 6, 1, 8]\nhigh_scores = [___ for s in security_scores if ___]\nprint(high_scores)\ndoubled = [___ for s in high_scores]\nprint(doubled)',
  editableRegions: [
    { startLine: 3, endLine: 3, placeholder: 's ... s >= 5' },
    { startLine: 5, endLine: 5, placeholder: 's * 2' },
  ],
  solutionCode:
    'security_scores = [3, 7, 2, 9, 4, 6, 1, 8]\nhigh_scores = [s for s in security_scores if s >= 5]\nprint(high_scores)\ndoubled = [s * 2 for s in high_scores]\nprint(doubled)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should filter scores >= 5 and double them',
      expectedOutput: '[7, 9, 6, 8]\n[14, 18, 12, 16]',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use list comprehension with condition and transform',
      expectedOutput: '[7, 9, 6, 8]\n[14, 18, 12, 16]',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1 as const,
      text: 'List comprehensions: [expression for item in list if condition]. The condition filters items.',
    },
    {
      tier: 2 as const,
      text: 'Filter: [s for s in scores if s >= 5]. Transform: [s * 2 for s in scores].',
    },
    {
      tier: 3 as const,
      text: 'Solution: high_scores = [s for s in security_scores if s >= 5], doubled = [s * 2 for s in high_scores]',
    },
  ],

  roomId: 'floor_6_room_01',
  terminalId: 'terminal_04',
  preDialogKey: 'dialog.ch06_04.pre',
  postDialogKey: 'dialog.ch06_04.post',

  conceptsIntroduced: ['list_comprehension', 'filtering'],
  conceptsReinforced: ['list_creation', 'for_loop', 'if_statement'],
};
