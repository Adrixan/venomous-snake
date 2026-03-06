import type { Challenge } from '@venomous-snake/shared-types';

export const ch11_08_putting_it_together: Challenge = {
  id: 'ch11_08_putting_it_together',
  titleKey: 'challenges.ch11_08.title',
  descriptionKey: 'challenges.ch11_08.description',
  chapter: 11,
  order: 8,
  difficulty: 'hard',
  scaffoldingLevel: 'open',
  prerequisites: ['ch11_07_list_typing'],
  xpReward: 275,
  tags: ['dataclasses', 'enums', 'typing', 'comprehensive'],
  scaffoldedCode:
    '# Combine dataclasses, enums, type hints, and filtering\n# Create Status enum, Mission dataclass, and filter_missions function\n# Print high-priority active missions\n',
  solutionCode:
    'from dataclasses import dataclass\nfrom typing import List\nfrom enum import Enum\n\nclass Status(Enum):\n    ACTIVE = "active"\n    INACTIVE = "inactive"\n\n@dataclass\nclass Mission:\n    name: str\n    priority: int\n    status: Status = Status.ACTIVE\n\ndef filter_missions(missions: List[Mission], min_priority: int) -> List[Mission]:\n    """Return missions with priority >= min_priority."""\n    return [m for m in missions if m.priority >= min_priority]\n\nmissions = [\n    Mission("Operation Cobra", 9),\n    Mission("Shadow Sweep", 4),\n    Mission("Iron Curtain", 7),\n]\nhigh_priority = filter_missions(missions, 7)\nfor m in high_priority:\n    print(f"{m.name}: priority {m.priority}, {m.status.value}")',
  testCases: [
    {
      id: 'tc01',
      description: 'Should filter and display missions',
      expectedOutput: 'Operation Cobra: priority 9, active\nIron Curtain: priority 7, active',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should combine dataclasses, enums, and typing',
      expectedOutput: 'Operation Cobra: priority 9, active\nIron Curtain: priority 7, active',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Combine @dataclass, Enum, and List typing for a well-structured module.' },
    { tier: 2 as const, text: 'filter_missions uses list comprehension: [m for m in missions if m.priority >= min_priority].' },
    { tier: 3 as const, text: 'Solution: Enum for Status, @dataclass for Mission, typed filter function' },
  ],
  roomId: 'floor_11_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch11_08.pre',
  postDialogKey: 'dialog.ch11_08.post',
  conceptsIntroduced: ['professional_python', 'module_design'],
  conceptsReinforced: ['dataclasses', 'enums', 'type_hints', 'list_comprehension'],
};
