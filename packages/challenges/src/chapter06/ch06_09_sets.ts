import type { Challenge } from '@venomous-snake/shared-types';

export const ch06_09_sets: Challenge = {
  id: 'ch06_09_sets',
  titleKey: 'challenges.ch06_09.title',
  descriptionKey: 'challenges.ch06_09.description',
  chapter: 6,
  order: 9,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch06_01_create_list'],
  xpReward: 175,
  tags: ['set', 'union', 'intersection'],

  scaffoldedCode:
    '# Find unique and shared badge scans using sets\nscan1 = {1042, 2318, 847, 1042}\nscan2 = {2318, 3991, 562}\nall_cards = ___\nduplicates = ___\nprint(len(all_cards))\nprint(duplicates)',
  editableRegions: [
    { startLine: 4, endLine: 4, placeholder: 'scan1.union(scan2)' },
    { startLine: 5, endLine: 5, placeholder: 'scan1.intersection(scan2)' },
  ],
  solutionCode:
    'scan1 = {1042, 2318, 847, 1042}\nscan2 = {2318, 3991, 562}\nall_cards = scan1.union(scan2)\nduplicates = scan1.intersection(scan2)\nprint(len(all_cards))\nprint(duplicates)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should find 5 unique cards total',
      expectedOutput: '5\n{2318}',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use union and intersection operations',
      expectedOutput: '5\n{2318}',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Sets automatically remove duplicates. .union() combines sets, .intersection() finds common elements.',
    },
    {
      tier: 2,
      text: 'scan1.union(scan2) merges both sets. scan1.intersection(scan2) finds shared elements.',
    },
    {
      tier: 3,
      text: 'Solution: all_cards = scan1.union(scan2), duplicates = scan1.intersection(scan2)',
    },
  ],

  roomId: 'floor_6_room_01',
  terminalId: 'terminal_09',
  preDialogKey: 'dialog.ch06_09.pre',
  postDialogKey: 'dialog.ch06_09.post',

  conceptsIntroduced: ['sets', 'set_union', 'set_intersection'],
  conceptsReinforced: ['len', 'print'],
};
