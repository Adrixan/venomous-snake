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
  tags: ['context-managers', '__enter__', '__exit__'],
  scaffoldedCode:
    'class SecureChannel:\n    def __init__(self, name):\n        self.name = name\n    \n    def __enter__(self):\n        print(f"Opening secure channel: {self.name}")\n        return ___\n    \n    def __exit__(self, exc_type, exc_val, exc_tb):\n        print(f"Closing secure channel: {self.name}")\n        return ___\n    \n    def transmit(self, data):\n        print(f"Transmitting: {data}")\n\nwith SecureChannel("ALPHA") as ch:\n    ch.transmit("Operation details")',
  solutionCode:
    'class SecureChannel:\n    def __init__(self, name):\n        self.name = name\n    \n    def __enter__(self):\n        print(f"Opening secure channel: {self.name}")\n        return self\n    \n    def __exit__(self, exc_type, exc_val, exc_tb):\n        print(f"Closing secure channel: {self.name}")\n        return False\n    \n    def transmit(self, data):\n        print(f"Transmitting: {data}")\n\nwith SecureChannel("ALPHA") as ch:\n    ch.transmit("Operation details")',
  testCases: [
    {
      id: 'tc01',
      description: 'Should open, transmit, and close',
      expectedOutput: 'Opening secure channel: ALPHA\nTransmitting: Operation details\nClosing secure channel: ALPHA',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should implement context manager protocol',
      expectedOutput: 'Opening secure channel: ALPHA\nTransmitting: Operation details\nClosing secure channel: ALPHA',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: '__enter__ runs at the start of with block and returns the context object. __exit__ runs at the end.' },
    { tier: 2 as const, text: '__enter__ should return self. __exit__ returns False to not suppress exceptions.' },
    { tier: 3 as const, text: 'Solution: return self in __enter__, return False in __exit__' },
  ],
  roomId: 'floor_12_room_01',
  terminalId: 'terminal_05',
  preDialogKey: 'dialog.ch12_05.pre',
  postDialogKey: 'dialog.ch12_05.post',
  conceptsIntroduced: ['context_manager_protocol', 'dunder_enter_exit'],
  conceptsReinforced: ['with_statement', 'class_definition'],
};
