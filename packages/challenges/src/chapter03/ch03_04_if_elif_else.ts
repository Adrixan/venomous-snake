import type { Challenge } from '@venomous-snake/shared-types';

export const ch03_04_if_elif_else: Challenge = {
  id: 'ch03_04_if_elif_else',
  titleKey: 'challenges.ch03_04.title',
  descriptionKey: 'challenges.ch03_04.description',
  chapter: 3,
  order: 4,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch03_02_if_else'],
  xpReward: 150,
  tags: ['if', 'elif', 'else', 'conditions'],

  scaffoldedCode:
    '# Classify the threat level based on the score\nthreat_score = 75\nif threat_score >= 90:\n    print("CRITICAL")\nelif ___:\n    print("HIGH")\nelif ___:\n    print("MEDIUM")\nelse:\n    print("LOW")',
  editableRegions: [
    { startLine: 5, endLine: 5, placeholder: 'threat_score >= 70' },
    { startLine: 7, endLine: 7, placeholder: 'threat_score >= 40' },
  ],
  solutionCode:
    'threat_score = 75\nif threat_score >= 90:\n    print("CRITICAL")\nelif threat_score >= 70:\n    print("HIGH")\nelif threat_score >= 40:\n    print("MEDIUM")\nelse:\n    print("LOW")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should classify threat score 75 as HIGH',
      expectedOutput: 'HIGH',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use elif for multiple conditions',
      expectedOutput: 'HIGH',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'elif lets you check multiple conditions in sequence. Only the first True branch runs.',
    },
    {
      tier: 2,
      text: 'Check from highest to lowest: >= 90 for CRITICAL, >= 70 for HIGH, >= 40 for MEDIUM.',
    },
    {
      tier: 3,
      text: 'Solution: elif threat_score >= 70: and elif threat_score >= 40:',
    },
  ],

  roomId: 'floor_3_room_01',
  terminalId: 'terminal_04',
  preDialogKey: 'dialog.ch03_04.pre',
  postDialogKey: 'dialog.ch03_04.post',

  conceptsIntroduced: ['elif', 'chained_conditions'],
  conceptsReinforced: ['if_else', 'comparison_operators'],
};
