import type { Challenge } from '@venomous-snake/shared-types';

export const ch08_06_input_validation_with_errors: Challenge = {
  id: 'ch08_06_input_validation_with_errors',
  titleKey: 'challenges.ch08_06.title',
  descriptionKey: 'challenges.ch08_06.description',
  chapter: 8,
  order: 6,
  difficulty: 'medium',
  scaffoldingLevel: 'open',
  prerequisites: ['ch08_05_custom_exception_classes'],
  xpReward: 190,
  tags: ['error-handling', 'validation', 'raise'],
  scaffoldedCode:
    '# Write a function validate_agent_id that checks:\n# - ID must start with "AGT-"\n# - ID must be exactly 7 characters long\n# Raise ValueError with appropriate messages\n# Then test with: "AGT-001", "invalid", "AGT-1234567"\n',
  solutionCode:
    'def validate_agent_id(agent_id):\n    if not agent_id.startswith("AGT-"):\n        raise ValueError("Agent ID must start with AGT-")\n    if len(agent_id) != 7:\n        raise ValueError("Agent ID must be 7 characters")\n    return True\n\nids = ["AGT-001", "invalid", "AGT-1234567"]\nfor aid in ids:\n    try:\n        validate_agent_id(aid)\n        print(f"{aid}: Valid")\n    except ValueError as e:\n        print(f"{aid}: {e}")',
  testCases: [
    {
      id: 'tc01',
      description: 'Should validate agent IDs correctly',
      expectedOutput: 'AGT-001: Valid\ninvalid: Agent ID must start with AGT-\nAGT-1234567: Agent ID must be 7 characters',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should raise ValueError for invalid IDs',
      expectedOutput: 'AGT-001: Valid\ninvalid: Agent ID must start with AGT-\nAGT-1234567: Agent ID must be 7 characters',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Use str.startswith() to check the prefix and len() to check the length.' },
    { tier: 2 as const, text: 'Raise ValueError with a descriptive message for each validation failure.' },
    { tier: 3 as const, text: 'Solution: Check startswith("AGT-") first, then len(agent_id) != 7, raising ValueError each time.' },
  ],
  roomId: 'floor_8_room_01',
  terminalId: 'terminal_06',
  preDialogKey: 'dialog.ch08_06.pre',
  postDialogKey: 'dialog.ch08_06.post',
  conceptsIntroduced: ['input_validation', 'startswith'],
  conceptsReinforced: ['raise_exception', 'ValueError', 'for_loop'],
};
