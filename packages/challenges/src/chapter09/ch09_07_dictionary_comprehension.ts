import type { Challenge } from '@venomous-snake/shared-types';

export const ch09_07_dictionary_comprehension: Challenge = {
  id: 'ch09_07_dictionary_comprehension',
  titleKey: 'challenges.ch09_07.title',
  descriptionKey: 'challenges.ch09_07.description',
  chapter: 9,
  order: 7,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch09_06_list_comprehension_conditionals'],
  xpReward: 195,
  tags: ['dict-comprehension', 'dictionary'],
  scaffoldedCode:
    'agents = ["Snake", "Viper", "Ghost", "Wolf"]\nclearances = {___: ___ for agent in agents}\nprint(clearances)',
  solutionCode:
    'agents = ["Snake", "Viper", "Ghost", "Wolf"]\nclearances = {agent: len(agent) * 10 for agent in agents}\nprint(clearances)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should create dict from list comprehension',
      expectedOutput: '{\'Snake\': 50, \'Viper\': 50, \'Ghost\': 50, \'Wolf\': 40}',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should compute clearance from name length',
      expectedOutput: '{\'Snake\': 50, \'Viper\': 50, \'Ghost\': 50, \'Wolf\': 40}',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Dictionary comprehensions use {key: value for item in iterable}.' },
    { tier: 2 as const, text: 'Use agent as key and len(agent) * 10 as value.' },
    { tier: 3 as const, text: 'Solution: {agent: len(agent) * 10 for agent in agents}' },
  ],
  roomId: 'floor_9_room_01',
  terminalId: 'terminal_07',
  preDialogKey: 'dialog.ch09_07.pre',
  postDialogKey: 'dialog.ch09_07.post',
  conceptsIntroduced: ['dict_comprehension'],
  conceptsReinforced: ['dictionary', 'len', 'lists'],
};
