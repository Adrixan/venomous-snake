import type { Challenge } from '@venomous-snake/shared-types';

export const ch12_05_context_managers: Challenge = {
  id: 'ch12_05_context_managers',
  titleKey: 'challenges.ch12_05.title',
  descriptionKey: 'challenges.ch12_05.description',
  chapter: 12,
  order: 5,
  difficulty: 'hard',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch12_04_decorators_with_args'],
  xpReward: 280,
  tags: ['resource-management', 'try-finally', 'cleanup'],
  scaffoldedCode:
    'class SecureChannel:\n    def __init__(self, name):\n        self.name = name\n\n    def open(self):\n        print(f"Opening secure channel: {self.name}")\n\n    def close(self):\n        print(f"Closing secure channel: {self.name}")\n\n    def transmit(self, data):\n        print(f"Transmitting: {data}")\n\nch = SecureChannel("ALPHA")\n___:\n    ch.open()\n    ch.transmit("Operation details")\n___:\n    ch.close()',
  editableRegions: [
    { startLine: 15, endLine: 15, placeholder: 'try' },
    { startLine: 18, endLine: 18, placeholder: 'finally' },
  ],
  solutionCode:
    'class SecureChannel:\n    def __init__(self, name):\n        self.name = name\n\n    def open(self):\n        print(f"Opening secure channel: {self.name}")\n\n    def close(self):\n        print(f"Closing secure channel: {self.name}")\n\n    def transmit(self, data):\n        print(f"Transmitting: {data}")\n\nch = SecureChannel("ALPHA")\ntry:\n    ch.open()\n    ch.transmit("Operation details")\nfinally:\n    ch.close()',
  testCases: [
    {
      id: 'tc01',
      description: 'Should open, transmit, and close',
      expectedOutput: 'Opening secure channel: ALPHA\nTransmitting: Operation details\nClosing secure channel: ALPHA',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use try/finally for guaranteed cleanup',
      expectedOutput: 'Opening secure channel: ALPHA\nTransmitting: Operation details\nClosing secure channel: ALPHA',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'try/finally guarantees cleanup code runs even if an error occurs in the try block.' },
    { tier: 2 as const, text: 'Put resource usage (open, transmit) in try. Put cleanup (close) in finally.' },
    { tier: 3 as const, text: 'Solution: try: ch.open() + ch.transmit(...), finally: ch.close()' },
  ],
  roomId: 'floor_12_room_01',
  terminalId: 'terminal_05',
  preDialogKey: 'dialog.ch12_05.pre',
  postDialogKey: 'dialog.ch12_05.post',
  conceptsIntroduced: ['resource_management_pattern', 'guaranteed_cleanup'],
  conceptsReinforced: ['try_finally', 'class_definition'],
};
