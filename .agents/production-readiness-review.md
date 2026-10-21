# Venomous Snake: production readiness review

Date: 2026-10-13. Scope: whole monorepo (apps/game, 10 packages, tools, CI). Method: code reading plus executed checks (listed at the end). No source file was modified.

## TL;DR

The product is a text-adventure RPG that teaches Python through 108 challenges, graded by running learner code in Pyodide and comparing stdout. The content layer is in good shape: the room graph is fully connected, every challenge is reachable from exactly one terminal, and the game is completable (108 of 108 in a closure simulation). The runtime layer is not release-ready for four reasons:

- Save/load restores XP and name but not completed challenges, unlocked floors, visited rooms or story flags, so continuing a game resets progression and allows re-earning XP.
- Python executes on the main thread, so the 15 s timeout cannot fire. A `while True:` loop, or the correct solution of `ch04_05_while_condition`, freezes the tab.
- Three input challenges (`ch02_05`, `ch02_06`, `ch04_05`) cannot be solved in production because the wrapper echoes `input()` prompts into stdout and does not split multi-line test input. CI misses this because the validation suite runs a hand-written Python subset interpreter instead of CPython.
- The progression stack (XP bonuses, achievements, skill tree, hint accounting, floor gating) is implemented but not wired into the UI path the player uses. About 2,900 lines are unreachable from `main.tsx`.

CI also hides most of this: lint and tests are `continue-on-error`, and type-check is currently red.

## Verified facts (executed, not inferred)

- Tests: 316 pass (challenge-engine 46, python-runtime 250 plus 2 skipped, narrative 20). Packages engine, ui, save-system, i18n, audio, challenges, shared-types and the app have zero tests; the app test target also lacks `jsdom`.
- `nx type-check`: fails in python-runtime only (TS6059, the validation test imports `../../../challenges/src` outside `rootDir`).
- `nx lint`: 61 errors, 112 warnings, concentrated in `MiniPythonEvaluator.ts` (`no-explicit-any`, `no-unsafe-function-type`) and `@nx/enforce-module-boundaries` on the same test file.
- All 108 `solutionCode` values were executed under CPython 3.13 with the same `input()` semantics as the Pyodide wrapper: 6 test cases fail, all input related (see P0-3). 3 scaffolds already pass all tests unmodified: `ch04_06_break_statement`, `ch05_01_simple_function`, `ch11_05_docstrings`.
- The actual `PyodideInterpreter` wrapper was run against Pyodide 0.29.3 locally: output for the `ch02_05` solution is `Enter your codename: Welcome, Agent Viper!`, which cannot equal the expected `Welcome, Agent Viper!`.
- Static data checks: 108 challenges (README and UI claim 118); 35 rooms; 108 terminals; no unknown challenge IDs, no dead connections, no soft-locks.
- Reachability from `main.tsx` (esbuild metafile): 32 source files and about 2,900 lines are not in the module graph.

Not done: no browser run. UI findings marked "by code reading" were not reproduced interactively. The Pyodide CDN (0.27.7) skew was not exercised in a browser.

## P0: blocks a trustworthy release

### P0-1 Save/load does not restore game progress

- `apps/game/src/hooks/useSaveSystem.ts:104-137` restores name, gender, floor, room id, level and XP only. `completedChallenges`, `unlockedFloors`, `visitedRooms`, `storyFlags`, `gameCompleted` and the narrative log stay at whatever the store held.
- `apps/game/src/App.tsx:163-200` builds a fresh `TextAdventureEngine`, which starts in `lobby_entrance` and ignores the loaded `currentRoom`.
- `curriculumProgress` in every save comes from `GameController.getProgress()` (`useSaveSystem.ts:24`), but challenge completion never reaches `GameController` (P1-1), so it is always empty.
- Consequence chain: load, floors re-lock, completed terminals reappear as hackable, XP is restored, replaying them adds XP again (`HackingTerminal.tsx:314` awards `xpReward` unconditionally, `gameStore.ts:157`).
- Fix: one serializable `GameSnapshot` (completed ids, unlocked floors, visited rooms, flags, room id, xp, achievements, settings reference) owned by a single module; `TextAdventureEngine` constructed from it (the constructor already accepts `savedState`); `load` replaces store state atomically; add a round-trip test (save, reset, load, deep-equal).

### P0-2 Python execution blocks the UI thread; the timeout cannot work

- `PyodideInterpreter.ts:117-122` races a `setTimeout` against a synchronous `runPython`. The timer callback cannot run while the loop holds the thread.
- Any infinite loop in learner code (common for beginners: forgetting to update the loop variable in chapter 4) hangs the tab and loses unsaved progress.
- Fix: run Pyodide in a dedicated Web Worker; on timeout call `worker.terminate()` and spawn a fresh one (re-init cost is acceptable and avoids needing SharedArrayBuffer, which requires COOP/COEP headers that shared hosting often cannot set). Keep the `PythonInterpreter` interface unchanged so the UI does not move.

### P0-3 Input challenges are unsolvable in production

- `PyodideInterpreter.ts:82` writes the `input()` prompt into captured stdout. `ChallengeRunner.ts:69-70` compares trimmed full stdout, so `Enter your codename: Welcome, Agent Viper!` never matches `Welcome, Agent Viper!`. Affects `ch02_05`, `ch02_06`, `ch04_05`.
- `ChallengeRunner.ts:43` passes `"snake\nviper"` as one `provideInput` value, so the first `input()` returns the whole string and `ch04_05` loops forever (combined with P0-2 this freezes the tab).
- `onInputRequest` is never invoked by the Pyodide implementation (dead callback set), so the free terminal cannot prompt interactively either.
- Fix: split test input on `\n` into the queue; do not echo prompts into the graded stream (keep them in a separate display channel); add the three challenges to a CI run against real Pyodide.

### P0-4 Pyodide version skew and an undeclared network dependency

- `python-runtime/package.json:18` pins npm `pyodide ^0.29.3` while `PyodideInterpreter.ts:38` loads runtime assets from `cdn.jsdelivr.net/pyodide/v0.27.7/`. The JS loader and the WASM/stdlib must be the same release; this combination is unsupported.
- README and the PWA claim offline play. First use needs the CDN (about 10 MB), there is no SRI, and a blocked CDN silently falls back to the Python subset evaluator (P2-2).
- Fix: derive `indexURL` from the installed package (copy `pyodide.asm.*`, `python_stdlib.zip`, `pyodide-lock.json` into `dist/` at build) so the app is self-contained, precache them in the service worker, and show an explicit "Python engine unavailable" state instead of a silent fallback.

### P0-5 CI validates against the wrong interpreter

- `challenge_validation.test.ts` runs every solution through `MiniPythonEvaluator`, which does not echo prompts and splits multi-line input. It stays green while production fails (P0-3).
- Fix: a Node job that loads Pyodide from `node_modules` (works offline) and runs every solution and every scaffold through `ChallengeRunner` with the real wrapper. Assertions: all solutions pass, no scaffold passes. This is about 40 lines and replaces the need for the subset evaluator.

### P0-6 Grading can be bypassed by printing the answer

- 101 of 108 challenges have test cases whose expected output is identical to each other; 103 of 108 have no `setup`, `input` or `expectsError`. Example `ch05_03_multiple_parameters`: hidden `tc02` is a copy of `tc01`. `print("[Infiltration] Aleksa — Operative")` passes.
- For a tutorial product the pass signal is the product. The engine already supports `setup` variable overrides (`ChallengeRunner.applySetup`).
- Fix by challenge type: function challenges get a hidden test that appends a different call; variable challenges use `setup` overrides; structural checks (AST via `ast` in Pyodide: "uses a for loop", "defines function X") for concept challenges. Make "hidden tests must differ from visible tests" a validator rule in `tools/challenge-validator`.

## P1: major functional defects and structural debt

### P1-1 The progression stack is not on the player's path

- The terminal uses `useChallengeTerminal` (own `ChallengeRunner`, own `HintEngine`). `GameController.submitCode`, `useGameActions`, `XPSystem` bonuses, `ProgressionManager`, `AchievementManager`, `SkillTree`, `ChallengeTimer`, hint accounting and `FloorGateSystem` are reachable only through `useGameActions`, which nothing calls.
- Observable effects: XP is the flat `xpReward` (no first-try, no-hint or speed bonus); all 32 achievements are inert; hint count never affects anything; failed attempts are not counted; tier-3 hints (which contain the literal solution) auto-reveal after three failures (`useChallengeTerminal.ts:129`) rather than on request.
- The level shown to the player is `floor(xp/100)+1` (`gameStore.ts:157`): full completion is 19,460 XP, so level 195, while `XPSystem` defines 10 titled levels capped at 5,500 XP.
- Fix (smallest coherent change): make `GameController` the only path. The terminal calls `controller.submitCode`; the store becomes a read model fed by controller events; delete the parallel runner and hint engine in `useChallengeTerminal`.

### P1-2 Four incompatible floor/chapter models

- Engine rooms: floors 0 to 11, floor 1 holds chapter 2, floor 2 holds chapter 3, and so on.
- `FloorChallengeMap`: floor 0 holds chapters 1 and 2 (16 challenges, `requiredCompletions: 8`), floor 1 holds chapter 3. 99 of 108 terminals disagree with it.
- `chapters.ts`: `floor` is `lobby`, `floor_2` to `floor_12`.
- `FloorMap.tsx:21-33` plus `App.tsx:33-66`: 12 floors with different names (`security-office`, `server-room-b1`), different chapter numbers, and `StoryTerminal.tsx:25` carries a fifth list of names (`MAIL ROOM`, `IT DEPARTMENT`).
- Visible effects: QuestLog prints the raw id `server-room-b1`; floor achievements are keyed `floor_2/3/4` but emitted from engine floor numbers (`useGameController.ts` uses `floor_${floor}`), so they are off by one; the "current chapter" in curriculum progress is derived from the wrong source.
- Fix: one `Floor` table (number, i18n key, chapter ids, first room id, required terminals) in `challenges` or `engine`, generated into the others; delete the four copies. Add a consistency test (the script in `.scratch/consistency.test.ts` is a starting point).

### P1-3 Hard-coded 118

- `App.tsx:624` and `:634`, README, `.serena/memories/project_overview.md`: 118. Actual: 108 (`Object.keys(challengeMap).length`). The progress meter can never reach 100 percent. Derive from data.

### P1-4 Global key handlers fire behind modals (by code reading)

- `ActionPanel.tsx:38-67` listens on `window` for Enter, arrows and digits with no check of `e.target`, `defaultPrevented` or whether an overlay is open. `App.tsx:611` keeps `StoryTerminal` mounted under PauseMenu, SaveSlotModal, QuestLog, FloorMap and Settings. Pressing Enter on a PauseMenu button or a digit while QuestLog is open can also execute a room action.
- Fix: gate on an `inputOwner` or modal-open flag from the store, or move key handling to the focused container.

### P1-5 Free terminal duplicates output

- `HackingTerminal.tsx:122` appends every `onOutput` event and `:146` appends `result.output` again; error text is added a third time from `err.traceback`. Every `print` shows twice in free mode.

### P1-6 No failure handling around async persistence and events

- `refreshHasSaveData` (`App.tsx:152`), `handleContinue` (`:341`) and the `void triggerAutoSave()` calls have no `catch`. IndexedDB can be unavailable (Firefox private mode, quota, ITP eviction on Safari); the result is unhandled rejections and a silently non-saving game.
- `EventBus.emit` (`EventBus.ts:9`) has no try/catch: one throwing listener aborts the loop and the emitter. There is no React error boundary around the app (`main.tsx`).
- Fix: wrap persistence in a result type and show a visible "progress not saved" banner; guard emit; add an `ErrorBoundary` that offers "export save" and "reload".

### P1-7 Localization covers the chrome, not the game

- Engine narration, action labels (`Go east → Hallway`, `Hack terminal [ch02_01_string_methods]`, `TextAdventureEngine.ts:148` leaks internal ids), Cipher messages (`App.tsx:275`), challenge hints (`ChallengeHint.text`) and NPC dialog (`engine/narrative/storyContent.ts`, 955 lines) are English literals.
- `de/dialog.json` is missing 348 of 608 keys, and those keys belong to the unreachable dialog trees (P2-1).
- `TextAdventureEngine.ts:103` falls back to rendering the raw key when a room has no narrative text.
- Fix: engine emits keys plus params, UI resolves them; pick one narrative source (see P2-1); add a key-parity test (the python check in this review passes for every namespace except `dialog`).

### P1-8 Accessibility regressions against the stated priority order

- `index.html:5` sets `maximum-scale=1.0, user-scalable=no`: blocks pinch zoom (WCAG 1.4.4).
- `NarrativePanel.tsx:8,144`: 30 ms per character typewriter inside an `aria-live="polite"` log. A 300-character entry takes 9 s and re-announces progressively; there is no setting to disable it and `prefers-reduced-motion` is ignored here.
- `manifest.json:7` forces `landscape`, which conflicts with the mobile keyboard work in recent commits.
- Fix: remove the viewport restriction, render the full text into the live region immediately and animate a visual copy (or skip animation under reduced motion), drop `orientation`.

## P2: simplification and hardening

### P2-1 Dead and duplicated code

Not in the module graph from `main.tsx` (about 2,900 lines):

- `apps/game`: `useStoryFlow.ts` (211), `useCurriculumProgress.ts` (39), `utils/performance.ts` (108)
- `packages/narrative`: all of `dialogs/` (floor trees, `lobby-guard`, `dr-silva`, `cipher-intro`), `cutscenes/`, `tutorial/`, `StoryManager`, `CutsceneData`
- `packages/audio`: `AudioManager` (Howler), `MusicTracks`, `SoundEffects`; the app uses `ProceduralAudio` directly, so `howler` is a dead dependency
- UI components exported but never rendered: `DialogOverlay`, `NpcPortrait` (1,733 lines), `CutscenePlayer`, `TutorialOverlay`, `TutorMode`, `CipherDialog`, `SkillTreePanel`, `InventoryPanel`, `ItemPickupToast`, `LoadingScreen`, `FloorAnnouncementOverlay`, `CreditsScreen`
- Two narrative systems: `engine/narrative/storyContent.ts` (live) versus `narrative/dialogs/*` plus `dialog.json` (not reachable).

Decision needed before deleting: which of the dormant features are planned (credits, cutscenes, skill tree) versus abandoned. Ship what is wired; move the rest to a branch.

### P2-2 `MiniPythonEvaluator` (3,616 lines)

- A hand-written Python subset used only when Pyodide fails to load. It produces confident wrong verdicts for anything outside its subset and carries most of the 61 lint errors. Once P0-4 and P0-5 land, remove it and show an explicit offline-engine error. Keep it only if there is a hard requirement for a no-WASM environment (USB/`file://` was deprioritized in the project decisions).

### P2-3 State has four owners

- `TextAdventureEngine.state`, the zustand store, `GameController.progression`, and narrative flags, synchronized by index polling (`engineNarrativeSyncIndex`, `App.tsx:134`) and by three separate `EventBus` subscribers (`App.tsx:250`, `useGameController.ts`, `useStoryFlow.ts`), with `CHALLENGE_COMPLETED` handled in three places.
- Target: engine and controller are pure domain objects; the store holds a snapshot published after each domain command; one subscriber.

### P2-4 Save format and integrity claims

- `integrity.ts:2` embeds the HMAC key in the bundle, and `SaveManager.ts:227` accepts unsigned legacy slots, so the signature does not protect anything. Either drop the claim or keep it as a corruption check only (use a plain SHA-256 checksum, remove the secret).
- `isSaveSlot` validates only that `data` is an object; a malformed or old file crashes `load`. Add a schema (zod or hand-rolled), a `version` migration table, and `navigator.storage.persist()`.
- Dead fields: `playTimeMs: 0`, `playerPosition`, `inventory: []`, hard-coded `settings` (`useSaveSystem.ts:49-57`). Settings live in `localStorage['vs-settings']` and are parsed in three places; centralize.

### P2-5 Service worker does not give offline play

- `sw.js:70` hash regex expects `name.<hex>.js`; Vite emits `index-BlamiO_B.js`, so the cache-first branch never matches and `SHELL_ASSETS` precaches three URLs. Offline works only after a second online visit populates the dynamic cache, and `cache.put` is not wrapped in `waitUntil`.
- Fix: generate the precache list at build time (`vite-plugin-pwa` or Workbox `injectManifest`), include the Pyodide files (P0-4).

### P2-6 Release engineering

- `ci.yml:64,71`: lint and test are `continue-on-error: true`; type-check is red; production deploy runs on every push to main. Make lint, type-check, test and the Pyodide challenge job required, and put deploy behind them.
- Tooling drift: `vitest ^2.1.9` with `@vitest/coverage-v8 ^4.0.18`; `@nx/vite:test` executor deprecated (removed in Nx 23); `vite.config.ts:49` and the chunk-size comment still reference Phaser.
- Security headers and CSP: none. A CSP needs `script-src 'self' 'wasm-unsafe-eval'` for Pyodide and, after P0-4, no third-party origin. Learner code can `import js` and reach the DOM; acceptable for self-XSS on a single-user client, but document it and never load shared content into the same origin.
- Bundle: main chunk 765 kB (221 kB gzip), of which i18n JSON is about 204 kB and challenges about 180 kB. Lazy-load the locale not in use and the challenge chapters per floor.
- Noise: `console.warn` in audio and dialog code, `.scratch/` and `.serena/project.yml` untracked or modified in git status.

## Recommended order and rationale

Ordered by learner harm per unit of effort, and by dependency (later items assume earlier ones).

- First, P0-5 then P0-3: put real Pyodide in CI, then fix input echo and splitting. Cheapest, and it creates the safety net for everything else.
- Second, P0-2 and P0-4 together: the worker and self-hosted runtime touch the same file and the same init path.
- Third, P1-1 plus P0-1 plus P1-2: unify the controller path, the floor table and the snapshot model in one refactor, because save/load correctness depends on both.
- Fourth, P0-6 challenge test hardening, content work that can proceed in parallel with engineering.
- Fifth, P1-4, P1-5, P1-6, P1-8: small, local UI and robustness fixes.
- Sixth, P1-7 and P2-1: i18n and deletion, after the narrative source decision.
- Last, P2-2 to P2-6.

## Overview

| ID | Area | Severity | Effort | Evidence |
|---|---|---|---|---|
| P0-1 | Save/load loses progress | Blocker | M | useSaveSystem.ts:104-137, App.tsx:163-200 |
| P0-2 | Main-thread Python, dead timeout | Blocker | M | PyodideInterpreter.ts:117-122 |
| P0-3 | Input challenges unsolvable | Blocker | S | PyodideInterpreter.ts:82, ChallengeRunner.ts:43 |
| P0-4 | Pyodide 0.29 vs CDN 0.27, offline claim | Blocker | M | PyodideInterpreter.ts:38 |
| P0-5 | CI validates wrong interpreter | Blocker | S | challenge_validation.test.ts |
| P0-6 | Print-the-answer passes 101/108 | Blocker (pedagogy) | L | challenge data |
| P1-1 | Progression stack unwired | Major | M | useChallengeTerminal.ts, GameController.ts |
| P1-2 | Four floor models | Major | M | FloorMap.tsx, FloorChallengeMap.ts, chapters.ts |
| P1-3 | 118 vs 108 | Major | S | App.tsx:624,634 |
| P1-4 | Key handlers behind modals | Major | S | ActionPanel.tsx:38-67 |
| P1-5 | Free terminal output duplicated | Major | S | HackingTerminal.tsx:122,146 |
| P1-6 | No error handling for IDB, events | Major | S | App.tsx:152,341, EventBus.ts:9 |
| P1-7 | Story content not localized | Major | L | storyContent.ts, TextAdventureEngine.ts |
| P1-8 | Accessibility regressions | Major | S | index.html:5, NarrativePanel.tsx |
| P2-1 | About 2,900 dead lines, two narrative systems | Moderate | M | metafile analysis |
| P2-2 | 3.6k-line subset interpreter | Moderate | S | MiniPythonEvaluator.ts |
| P2-3 | Four state owners | Moderate | L | App.tsx |
| P2-4 | Save integrity theatre, no schema | Moderate | S | integrity.ts, SaveManager.ts:227 |
| P2-5 | Service worker precache | Moderate | S | sw.js:70 |
| P2-6 | CI gates, tooling drift, CSP, bundle | Moderate | M | ci.yml, vite.config.ts |

## Commands and scripts used

- `npx nx run-many --target=type-check|lint|test --all`
- `.scratch/consistency.test.ts`, `closure.test.ts`, `dump.test.ts`: data consistency, completability simulation, challenge export
- `.scratch/run_py.py`: every solution and scaffold under CPython with the wrapper's `input()` semantics
- `.scratch/pyo.test.ts`: the real `PyodideInterpreter` wrapper against local Pyodide 0.29.3
- `.scratch/reach.py` with an esbuild metafile: module reachability from `main.tsx`
