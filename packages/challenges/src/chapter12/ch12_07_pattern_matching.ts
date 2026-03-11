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
  tags: ['conditionals', 'isinstance', 'dict-dispatch'],
  scaffoldedCode:
    'def classify_signal(signal):\n    if isinstance(signal, dict):\n        sig_type = signal.get("type")\n        if sig_type == "alert":\n            level = signal.get("level", 0)\n            if level >= ___:\n                return f"CRITICAL ALERT: Level {level}"\n            return f"Alert: Level {level}"\n        elif sig_type == ___:\n            msg = signal.get("message", "")\n            return f"Status: {msg}"\n    return ___\n\nprint(classify_signal({"type": "alert", "level": 9}))\nprint(classify_signal({"type": "alert", "level": 3}))\nprint(classify_signal({"type": "status", "message": "All clear"}))',
  editableRegions: [
    { startLine: 6, endLine: 6, placeholder: '8' },
    { startLine: 9, endLine: 9, placeholder: '"status"' },
    { startLine: 12, endLine: 12, placeholder: '"Unknown signal"' },
  ],
  solutionCode:
    'def classify_signal(signal):\n    if isinstance(signal, dict):\n        sig_type = signal.get("type")\n        if sig_type == "alert":\n            level = signal.get("level", 0)\n            if level >= 8:\n                return f"CRITICAL ALERT: Level {level}"\n            return f"Alert: Level {level}"\n        elif sig_type == "status":\n            msg = signal.get("message", "")\n            return f"Status: {msg}"\n    return "Unknown signal"\n\nprint(classify_signal({"type": "alert", "level": 9}))\nprint(classify_signal({"type": "alert", "level": 3}))\nprint(classify_signal({"type": "status", "message": "All clear"}))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should classify different signals',
      expectedOutput: 'CRITICAL ALERT: Level 9\nAlert: Level 3\nStatus: All clear',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use if/elif with isinstance and dict lookups',
      expectedOutput: 'CRITICAL ALERT: Level 9\nAlert: Level 3\nStatus: All clear',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Use isinstance() to check types and dict.get() to safely access keys.' },
    { tier: 2 as const, text: 'if/elif chains with dict lookups can handle structured data dispatch like match/case.' },
    { tier: 3 as const, text: 'Solution: level >= 8 for critical, "status" for status check, "Unknown signal" as default' },
  ],
  roomId: 'floor_12_room_01',
  terminalId: 'terminal_07',
  preDialogKey: 'dialog.ch12_07.pre',
  postDialogKey: 'dialog.ch12_07.post',
  conceptsIntroduced: ['type_dispatch', 'dict_based_dispatch'],
  conceptsReinforced: ['isinstance', 'conditionals', 'dictionary'],
};
