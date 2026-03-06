import type { Challenge } from '@venomous-snake/shared-types';

export const ch12_07_pattern_matching: Challenge = {
  id: 'ch12_07_pattern_matching',
  titleKey: 'challenges.ch12_07.title',
  descriptionKey: 'challenges.ch12_07.description',
  chapter: 12,
  order: 7,
  difficulty: 'hard',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch12_06_async_basics'],
  xpReward: 295,
  tags: ['pattern-matching', 'match-case', 'structural'],
  scaffoldedCode:
    'def classify_signal(signal):\n    match signal:\n        case {"type": "alert", "level": level} if ___:\n            return f"CRITICAL ALERT: Level {level}"\n        case {"type": "alert", "level": level}:\n            return f"Alert: Level {level}"\n        case {"type": "status", "message": msg}:\n            return f"Status: {msg}"\n        case ___:\n            return "Unknown signal"\n\nprint(classify_signal({"type": "alert", "level": 9}))\nprint(classify_signal({"type": "alert", "level": 3}))\nprint(classify_signal({"type": "status", "message": "All clear"}))',
  solutionCode:
    'def classify_signal(signal):\n    match signal:\n        case {"type": "alert", "level": level} if level >= 8:\n            return f"CRITICAL ALERT: Level {level}"\n        case {"type": "alert", "level": level}:\n            return f"Alert: Level {level}"\n        case {"type": "status", "message": msg}:\n            return f"Status: {msg}"\n        case _:\n            return "Unknown signal"\n\nprint(classify_signal({"type": "alert", "level": 9}))\nprint(classify_signal({"type": "alert", "level": 3}))\nprint(classify_signal({"type": "status", "message": "All clear"}))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should classify different signals',
      expectedOutput: 'CRITICAL ALERT: Level 9\nAlert: Level 3\nStatus: All clear',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use pattern matching with guards',
      expectedOutput: 'CRITICAL ALERT: Level 9\nAlert: Level 3\nStatus: All clear',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'match/case is Python 3.10+ structural pattern matching. case _ is the wildcard.' },
    { tier: 2 as const, text: 'Guards use if after the pattern: case {...} if level >= 8:' },
    { tier: 3 as const, text: 'Solution: level >= 8 as the guard, _ as the wildcard' },
  ],
  roomId: 'floor_12_room_01',
  terminalId: 'terminal_07',
  preDialogKey: 'dialog.ch12_07.pre',
  postDialogKey: 'dialog.ch12_07.post',
  conceptsIntroduced: ['pattern_matching', 'match_case', 'structural_patterns'],
  conceptsReinforced: ['dictionary', 'conditionals'],
};
