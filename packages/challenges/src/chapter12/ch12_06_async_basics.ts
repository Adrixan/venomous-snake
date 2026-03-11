import type { Challenge } from '@venomous-snake/shared-types';

export const ch12_06_async_basics: Challenge = {
  id: 'ch12_06_async_basics',
  titleKey: 'challenges.ch12_06.title',
  descriptionKey: 'challenges.ch12_06.description',
  chapter: 12,
  order: 6,
  difficulty: 'hard',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch12_05_context_managers'],
  xpReward: 290,
  tags: ['callbacks', 'functions', 'concurrency-concepts'],
  scaffoldedCode:
    'def fetch_intel(target, ___):\n    result = f"Intel on {target}: 42 vulnerabilities found"\n    ___(result)\n\ndef process_result(result):\n    print(result)\n\nfetch_intel("NexusCorp", ___)\n\ntargets = ["VaultX", "ShadowNet"]\nresults = []\nfor t in targets:\n    results.append(f"Intel on {t}: 42 vulnerabilities found")\nfor r in results:\n    print(r)',
  editableRegions: [
    { startLine: 1, endLine: 1, placeholder: 'callback' },
    { startLine: 3, endLine: 3, placeholder: 'callback' },
    { startLine: 8, endLine: 8, placeholder: 'process_result' },
  ],
  solutionCode:
    'def fetch_intel(target, callback):\n    result = f"Intel on {target}: 42 vulnerabilities found"\n    callback(result)\n\ndef process_result(result):\n    print(result)\n\nfetch_intel("NexusCorp", process_result)\n\ntargets = ["VaultX", "ShadowNet"]\nresults = []\nfor t in targets:\n    results.append(f"Intel on {t}: 42 vulnerabilities found")\nfor r in results:\n    print(r)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should run callback-based operations',
      expectedOutput: 'Intel on NexusCorp: 42 vulnerabilities found\nIntel on VaultX: 42 vulnerabilities found\nIntel on ShadowNet: 42 vulnerabilities found',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use callbacks and batch processing',
      expectedOutput: 'Intel on NexusCorp: 42 vulnerabilities found\nIntel on VaultX: 42 vulnerabilities found\nIntel on ShadowNet: 42 vulnerabilities found',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Callbacks are functions passed as arguments. The receiving function calls them when work is done.' },
    { tier: 2 as const, text: 'Pass process_result as the callback to fetch_intel. It will be called with the result.' },
    { tier: 3 as const, text: 'Solution: fetch_intel(target, callback) calls callback(result). Pass process_result as the callback.' },
  ],
  roomId: 'floor_12_room_01',
  terminalId: 'terminal_06',
  preDialogKey: 'dialog.ch12_06.pre',
  postDialogKey: 'dialog.ch12_06.post',
  conceptsIntroduced: ['callbacks', 'function_as_argument', 'batch_processing'],
  conceptsReinforced: ['function_definition', 'for_loop'],
};
