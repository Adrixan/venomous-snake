import type { Challenge } from '@venomous-snake/shared-types';

export const ch04_07_continue_statement: Challenge = {
  id: 'ch04_07_continue_statement',
  titleKey: 'challenges.ch04_07.title',
  descriptionKey: 'challenges.ch04_07.description',
  chapter: 4,
  order: 7,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch04_06_break_statement'],
  xpReward: 175,
  tags: ['continue', 'for', 'loop_control'],

  scaffoldedCode:
    '# Print active cameras, skip disabled ones\ncameras = [1, 2, 3, 4, 5]\ndisabled = [3]\nfor cam in cameras:\n    if cam in disabled:\n        ___\n    print(f"Camera {cam}: ACTIVE")',
  editableRegions: [{ startLine: 6, endLine: 6, placeholder: 'continue' }],
  solutionCode:
    'cameras = [1, 2, 3, 4, 5]\ndisabled = [3]\nfor cam in cameras:\n    if cam in disabled:\n        continue\n    print(f"Camera {cam}: ACTIVE")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should skip camera 3 and print all others',
      expectedOutput: 'Camera 1: ACTIVE\nCamera 2: ACTIVE\nCamera 4: ACTIVE\nCamera 5: ACTIVE',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use continue to skip disabled cameras',
      expectedOutput: 'Camera 1: ACTIVE\nCamera 2: ACTIVE\nCamera 4: ACTIVE\nCamera 5: ACTIVE',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'The continue statement skips the rest of the current iteration and moves to the next one.',
    },
    {
      tier: 2,
      text: 'If the camera is in the disabled list, use continue to skip printing it.',
    },
    {
      tier: 3,
      text: 'Solution: if cam in disabled: continue',
    },
  ],

  roomId: 'floor_4_room_01',
  terminalId: 'terminal_07',
  preDialogKey: 'dialog.ch04_07.pre',
  postDialogKey: 'dialog.ch04_07.post',

  conceptsIntroduced: ['continue_statement', 'in_operator'],
  conceptsReinforced: ['for_loop', 'if_statement', 'fstrings'],
};
