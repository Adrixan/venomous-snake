import type { Challenge } from '@venomous-snake/shared-types';

export const ch04_04_while_basics: Challenge = {
  id: 'ch04_04_while_basics',
  titleKey: 'challenges.ch04_04.title',
  descriptionKey: 'challenges.ch04_04.description',
  chapter: 4,
  order: 4,
  difficulty: 'easy',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch04_01_simple_for_loop'],
  xpReward: 100,
  tags: ['while', 'loop', 'countdown'],

  scaffoldedCode:
    '# Countdown to launch using a while loop\ncountdown = 5\nwhile ___:\n    print(countdown)\n    countdown -= 1\nprint("LAUNCH!")',
  editableRegions: [{ startLine: 3, endLine: 3, placeholder: 'countdown > 0' }],
  solutionCode:
    'countdown = 5\nwhile countdown > 0:\n    print(countdown)\n    countdown -= 1\nprint("LAUNCH!")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should count down from 5 to 1 then print LAUNCH!',
      expectedOutput: '5\n4\n3\n2\n1\nLAUNCH!',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use while loop with countdown condition',
      expectedOutput: '5\n4\n3\n2\n1\nLAUNCH!',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'A while loop repeats as long as its condition is True.',
    },
    {
      tier: 2,
      text: 'The loop should run while countdown > 0. Each iteration decreases countdown by 1.',
    },
    {
      tier: 3,
      text: 'Solution: while countdown > 0: — the -= 1 decreases the counter each time.',
    },
  ],

  roomId: 'floor_4_room_01',
  terminalId: 'terminal_04',
  preDialogKey: 'dialog.ch04_04.pre',
  postDialogKey: 'dialog.ch04_04.post',

  conceptsIntroduced: ['while_loop', 'decrement'],
  conceptsReinforced: ['comparison_operators', 'print'],
};
