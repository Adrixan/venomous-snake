# Project Overview

**venomous-snake** is a text-based RPG that teaches Python programming through in-game coding challenges.

## Tech Stack
- **Language**: TypeScript (strict mode)
- **Framework**: React 19 + Vite
- **Monorepo**: NX + pnpm workspaces
- **Testing**: Vitest
- **Linting**: ESLint (flat config) + Prettier
- **i18n**: i18next

## Architecture
- **apps/game**: Main Vite React application (the game)
- **packages/engine**: TextAdventureEngine — manages rooms, navigation, actions, NPC dialogs
- **packages/ui**: UI components (StoryTerminal, HackingTerminal, DialogOverlay)
- **packages/python-runtime**: Python execution (PyodideInterpreter for real WASM CPython, MiniPythonEvaluator as fallback)
- **packages/challenge-engine**: ChallengeRunner + HintEngine for validating user solutions
- **packages/challenges**: 118 coding challenges across 12 chapters, organized as chapter## folders
- **packages/narrative**: Dialog trees, narrative content
- **packages/i18n**: Internationalization
- **packages/audio**: Audio system
- **packages/save-system**: Save/load game state
- **packages/shared-types**: Shared TypeScript types

## Key Design Decisions
- Game is text-based (Phaser was removed); StoryTerminal is the main UI
- 35 rooms across 12 floors with progression gating
- NPCs auto-trigger dialog on first room visit
- Python challenges validated via test cases; MiniPythonEvaluator has limitations (no import re, no @dataclass, no async/await, etc.)
- Challenge hints use `tier: N as const` for literal types
- exactOptionalPropertyTypes is enabled — omit optional fields rather than setting them to undefined
