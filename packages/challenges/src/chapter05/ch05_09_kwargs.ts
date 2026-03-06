import type { Challenge } from '@venomous-snake/shared-types';

export const ch05_09_kwargs: Challenge = {
  id: 'ch05_09_kwargs',
  titleKey: 'challenges.ch05_09.title',
  descriptionKey: 'challenges.ch05_09.description',
  chapter: 5,
  order: 9,
  difficulty: 'medium',
  scaffoldingLevel: 'open',
  prerequisites: ['ch05_08_args'],
  xpReward: 200,
  tags: ['kwargs', 'dictionary', 'function'],

  scaffoldedCode: '# Write your solution here\n',

  solutionCode:
    'def configure_terminal(**settings):\n    for key, value in settings.items():\n        print(f"{key}: {value}")\n\nconfigure_terminal(language="Python", theme="dark", timeout=30)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print all terminal settings',
      expectedOutput: 'language: Python\ntheme: dark\ntimeout: 30',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should handle keyword arguments as a dictionary',
      expectedOutput: 'language: Python\ntheme: dark\ntimeout: 30',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: '**kwargs lets a function accept any number of keyword arguments as a dictionary.',
    },
    {
      tier: 2,
      text: 'def configure_terminal(**settings): — use settings.items() to iterate key-value pairs.',
    },
    {
      tier: 3,
      text: 'Solution: def configure_terminal(**settings): for key, value in settings.items(): print(f"{key}: {value}")',
    },
  ],

  roomId: 'floor_5_room_01',
  terminalId: 'terminal_09',
  preDialogKey: 'dialog.ch05_09.pre',
  postDialogKey: 'dialog.ch05_09.post',

  conceptsIntroduced: ['kwargs', 'keyword_arguments'],
  conceptsReinforced: ['function_definition', 'for_loop', 'fstrings'],
};
