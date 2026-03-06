import type { Challenge } from '@venomous-snake/shared-types';

export const ch11_04_writing_simple_tests: Challenge = {
  id: 'ch11_04_writing_simple_tests',
  titleKey: 'challenges.ch11_04.title',
  descriptionKey: 'challenges.ch11_04.description',
  chapter: 11,
  order: 4,
  difficulty: 'hard',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch11_03_assert_statements'],
  xpReward: 250,
  tags: ['testing', 'assert', 'encryption'],
  scaffoldedCode:
    'def encrypt_shift(text: str, shift: int) -> str:\n    result = []\n    for char in text:\n        if char.isalpha():\n            base = ord(\'A\') if char.isupper() else ord(\'a\')\n            result.append(chr((ord(char) - base + shift) % 26 + base))\n        else:\n            result.append(char)\n    return \'\'.join(result)\n\ndef test_encrypt_shift():\n    assert encrypt_shift("ABC", 1) == ___, "Basic shift failed"\n    assert encrypt_shift("XYZ", 3) == ___, "Wraparound failed"\n    assert encrypt_shift("abc", 0) == ___, "Zero shift failed"\n    return True\n\nprint(encrypt_shift("HELLO", 13))\nprint(test_encrypt_shift())',
  solutionCode:
    'def encrypt_shift(text: str, shift: int) -> str:\n    result = []\n    for char in text:\n        if char.isalpha():\n            base = ord(\'A\') if char.isupper() else ord(\'a\')\n            result.append(chr((ord(char) - base + shift) % 26 + base))\n        else:\n            result.append(char)\n    return \'\'.join(result)\n\ndef test_encrypt_shift():\n    assert encrypt_shift("ABC", 1) == "BCD", "Basic shift failed"\n    assert encrypt_shift("XYZ", 3) == "ABC", "Wraparound failed"\n    assert encrypt_shift("abc", 0) == "abc", "Zero shift failed"\n    return True\n\nprint(encrypt_shift("HELLO", 13))\nprint(test_encrypt_shift())',
  testCases: [
    {
      id: 'tc01',
      description: 'Should encrypt and pass tests',
      expectedOutput: 'URYYB\nTrue',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should handle Caesar cipher correctly',
      expectedOutput: 'URYYB\nTrue',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Caesar cipher shifts each letter. ABC shifted by 1 becomes BCD.' },
    { tier: 2 as const, text: 'XYZ shifted by 3 wraps around: X->A, Y->B, Z->C.' },
    { tier: 3 as const, text: 'Solution: "BCD", "ABC", "abc" as expected values' },
  ],
  roomId: 'floor_11_room_01',
  terminalId: 'terminal_04',
  preDialogKey: 'dialog.ch11_04.pre',
  postDialogKey: 'dialog.ch11_04.post',
  conceptsIntroduced: ['unit_testing', 'test_functions'],
  conceptsReinforced: ['assert_statement', 'string_methods'],
};
