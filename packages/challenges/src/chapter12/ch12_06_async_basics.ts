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
  tags: ['async', 'await', 'asyncio', 'coroutines'],
  scaffoldedCode:
    'import asyncio\n\nasync def fetch_intel(target):\n    return f"Intel on {target}: 42 vulnerabilities found"\n\nasync def run_operation():\n    result = ___ fetch_intel("NexusCorp")\n    print(result)\n    results = ___ asyncio.gather(\n        fetch_intel("VaultX"),\n        fetch_intel("ShadowNet")\n    )\n    for r in results:\n        print(r)\n\nasyncio.run(run_operation())',
  solutionCode:
    'import asyncio\n\nasync def fetch_intel(target):\n    return f"Intel on {target}: 42 vulnerabilities found"\n\nasync def run_operation():\n    result = await fetch_intel("NexusCorp")\n    print(result)\n    results = await asyncio.gather(\n        fetch_intel("VaultX"),\n        fetch_intel("ShadowNet")\n    )\n    for r in results:\n        print(r)\n\nasyncio.run(run_operation())',
  testCases: [
    {
      id: 'tc01',
      description: 'Should run async operations',
      expectedOutput: 'Intel on NexusCorp: 42 vulnerabilities found\nIntel on VaultX: 42 vulnerabilities found\nIntel on ShadowNet: 42 vulnerabilities found',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use await and asyncio.gather',
      expectedOutput: 'Intel on NexusCorp: 42 vulnerabilities found\nIntel on VaultX: 42 vulnerabilities found\nIntel on ShadowNet: 42 vulnerabilities found',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'await pauses until the async function completes. asyncio.gather runs multiple coroutines.' },
    { tier: 2 as const, text: 'Use await before calling any async function.' },
    { tier: 3 as const, text: 'Solution: result = await fetch_intel("NexusCorp") and results = await asyncio.gather(...)' },
  ],
  roomId: 'floor_12_room_01',
  terminalId: 'terminal_06',
  preDialogKey: 'dialog.ch12_06.pre',
  postDialogKey: 'dialog.ch12_06.post',
  conceptsIntroduced: ['async_await', 'coroutines', 'asyncio_gather'],
  conceptsReinforced: ['function_definition', 'for_loop'],
};
