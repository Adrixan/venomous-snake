import type { Challenge } from '@venomous-snake/shared-types';

export const ch08_05_custom_exception_classes: Challenge = {
  id: 'ch08_05_custom_exception_classes',
  titleKey: 'challenges.ch08_05.title',
  descriptionKey: 'challenges.ch08_05.description',
  chapter: 8,
  order: 5,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch08_04_raising_exceptions'],
  xpReward: 185,
  tags: ['error-handling', 'custom-exceptions', 'oop'],
  scaffoldedCode:
    'class MissionError(___):\n    def __init__(self, mission_id, message):\n        super().__init__(___)\n        self.mission_id = ___\n\ntry:\n    raise MissionError("OP-007", "Target has been compromised")\nexcept MissionError as e:\n    print(f"Mission {e.mission_id} failed: {e}")',
  solutionCode:
    'class MissionError(Exception):\n    def __init__(self, mission_id, message):\n        super().__init__(message)\n        self.mission_id = mission_id\n\ntry:\n    raise MissionError("OP-007", "Target has been compromised")\nexcept MissionError as e:\n    print(f"Mission {e.mission_id} failed: {e}")',
  testCases: [
    {
      id: 'tc01',
      description: 'Should create and catch custom exception',
      expectedOutput: 'Mission OP-007 failed: Target has been compromised',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should store mission_id in exception',
      expectedOutput: 'Mission OP-007 failed: Target has been compromised',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Custom exceptions inherit from Exception. Use class MyError(Exception):' },
    { tier: 2 as const, text: 'Call super().__init__(message) to set the error message. Store extra data as attributes.' },
    { tier: 3 as const, text: 'Solution: class MissionError(Exception): with super().__init__(message) and self.mission_id = mission_id' },
  ],
  roomId: 'floor_8_room_01',
  terminalId: 'terminal_05',
  preDialogKey: 'dialog.ch08_05.pre',
  postDialogKey: 'dialog.ch08_05.post',
  conceptsIntroduced: ['custom_exceptions', 'exception_inheritance'],
  conceptsReinforced: ['raise_exception', 'try_except', 'classes'],
};
