import type { Challenge } from '@venomous-snake/shared-types';

export const ch09_10_combining_tools: Challenge = {
  id: 'ch09_10_combining_tools',
  titleKey: 'challenges.ch09_10.title',
  descriptionKey: 'challenges.ch09_10.description',
  chapter: 9,
  order: 10,
  difficulty: 'hard',
  scaffoldingLevel: 'open',
  prerequisites: ['ch09_09_regular_expressions'],
  xpReward: 225,
  tags: ['map', 'filter', 'sorted', 'lambda', 'chaining'],
  scaffoldedCode:
    '# Chain map, filter, and sorted to process scores\n# raw_scores = [85, 42, 91, 17, 73, 58, 96, 34]\n# 1. Filter scores >= 50\n# 2. Sort descending\n# 3. Double each score and sum\n',
  solutionCode:
    'raw_scores = [85, 42, 91, 17, 73, 58, 96, 34]\nresult = sorted(\n    filter(lambda x: x >= 50, raw_scores),\n    reverse=True\n)\nprint(result)\ntotal = sum(map(lambda x: x * 2, result))\nprint(total)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should filter, sort, and compute total',
      expectedOutput: '[96, 91, 85, 73, 58]\n806',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should chain functional tools correctly',
      expectedOutput: '[96, 91, 85, 73, 58]\n806',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Use filter() to keep scores >= 50, sorted() to sort descending, map() to double.' },
    { tier: 2 as const, text: 'Chain: sorted(filter(...), reverse=True), then sum(map(...)).' },
    { tier: 3 as const, text: 'Solution: result = sorted(filter(lambda x: x >= 50, raw_scores), reverse=True)' },
  ],
  roomId: 'floor_9_room_01',
  terminalId: 'terminal_10',
  preDialogKey: 'dialog.ch09_10.pre',
  postDialogKey: 'dialog.ch09_10.post',
  conceptsIntroduced: ['functional_chaining', 'data_pipeline'],
  conceptsReinforced: ['map_function', 'filter_function', 'sorted_reverse', 'lambda'],
};
