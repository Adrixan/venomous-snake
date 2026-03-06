import type { Challenge } from '@venomous-snake/shared-types';

export const ch03_07_boolean_variables: Challenge = {
  id: 'ch03_07_boolean_variables',
  titleKey: 'challenges.ch03_07.title',
  descriptionKey: 'challenges.ch03_07.description',
  chapter: 3,
  order: 7,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch03_05_logical_operators'],
  xpReward: 125,
  tags: ['boolean', 'variables', 'or', 'not'],

  scaffoldedCode:
    '# Determine if the alarm should trigger\nalarm_active = False\nmotion_detected = True\n\nalarm_triggered = ___\nprint(f"Alarm triggered: {alarm_triggered}")\nprint(f"System safe: {___}")',
  editableRegions: [
    { startLine: 5, endLine: 5, placeholder: 'alarm_active or motion_detected' },
    { startLine: 7, endLine: 7, placeholder: 'not alarm_triggered' },
  ],
  solutionCode:
    'alarm_active = False\nmotion_detected = True\n\nalarm_triggered = alarm_active or motion_detected\nprint(f"Alarm triggered: {alarm_triggered}")\nprint(f"System safe: {not alarm_triggered}")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should report alarm triggered as True',
      expectedOutput: 'Alarm triggered: True\nSystem safe: False',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use or and not operators correctly',
      expectedOutput: 'Alarm triggered: True\nSystem safe: False',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'The "or" operator returns True if either side is True. "not" flips True to False.',
    },
    {
      tier: 2,
      text: 'alarm_triggered = alarm_active or motion_detected. Then use not alarm_triggered for safe status.',
    },
    {
      tier: 3,
      text: 'Solution: alarm_triggered = alarm_active or motion_detected, and not alarm_triggered for safe',
    },
  ],

  roomId: 'floor_3_room_01',
  terminalId: 'terminal_07',
  preDialogKey: 'dialog.ch03_07.pre',
  postDialogKey: 'dialog.ch03_07.post',

  conceptsIntroduced: ['boolean_variables', 'boolean_expressions'],
  conceptsReinforced: ['logical_or', 'logical_not', 'fstrings'],
};
