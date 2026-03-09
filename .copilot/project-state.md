# Venomous Snake — Project State

> Last updated: 2026-03-08 → bug fix round 7

## User Profile

- **Level**: Senior
- **Interaction style**: Full control; show all options with detailed trade-offs

## Project Overview

**Venomous Snake** is a 2D RPG programming learning game set in a cyberpunk noir world. The player is an agent (male or female, player's choice) tasked with infiltrating "Rattlesnake Corp." headquarters. The game is completely non-violent — the agent's primary tool is a "hacking terminal" that teaches Python 3 programming. A witty, humorous AI sidekick acts as coding tutor and narrative companion. Target audience: 15y.o.+, both formal education and self-learners.

## Environment

- **OS**: Linux
- **License**: AGPL-3.0 (already committed)
- **Repository**: GitHub (venomous-snake)
- **CI/CD**: GitHub Actions

## Key Design Decisions

### Decision Log

| Date | Decision | Alternatives Considered | Rationale |
|------|----------|------------------------|-----------|
| 2026-03-06 | Audience: formal education + self-learners | Self-learners only | Broader impact, educational market |
| 2026-03-06 | Multilingual (i18n) from the start | English-only initial | Required for educational deployment globally |
| 2026-03-06 | Mixed art: pixel art world + vector UI terminal | Pure pixel, pure vector, hand-drawn | Best fit for cyberpunk aesthetic + functional coding UI |
| 2026-03-06 | Branching narrative + hub-based architecture | Linear, strictly linear, pure branching | Exploration freedom with smart gating to prevent knowledge gaps |
| 2026-03-06 | Pyodide with lazy loading (PWA-only focus) | Skulpt, Brython, full Pyodide | Real CPython, 100% curriculum coverage; USB deployment deprioritized to backlog |
| 2026-03-06 | Phaser 3 game engine | PixiJS, Excalibur, Godot HTML5 | Mature 2D RPG ecosystem, tilemaps, TypeScript, large community |
| 2026-03-06 | React 19 + Vite for UI shell | Svelte, Vue, Vanilla, Solid | Strong ecosystem, component model for complex terminal UI |
| 2026-03-06 | CodeMirror 6 styled as terminal | Monaco, custom xterm.js, plain CodeMirror | Editor capabilities + hacker aesthetic |
| 2026-03-06 | Fully offline / client-side only | Cloud sync, Firebase, custom backend | USB distribution requirement, privacy, no server dependency |
| 2026-03-06 | JSON export for game state | Cloud save, account-based | User-controlled data, works offline |
| 2026-03-06 | Full audio: SFX + ambient music | SFX only, no audio, procedural | Cyberpunk atmosphere requires immersive audio |
| 2026-03-06 | AI sidekick: portrait for story + inline terminal hints | Chat-only, portrait-only, terminal-only | Best blend of narrative immersion and practical coding help |
| 2026-03-06 | Rule-based procedural hint generation | LLM-powered, static hints, API-based | Fully offline, smarter than static, no download/cost overhead |
| 2026-03-06 | Tiled + LDtk for level design | Tiled only, LDtk only, custom editor | Best of both: Tiled for tilemaps, LDtk for entity placement |
| 2026-03-06 | Dark mode only | Dark+light, dark+high-contrast | Fits cyberpunk noir, simpler design (WCAG contrast still enforced) |
| 2026-03-06 | Beginner → proficient practitioner curriculum | Beginner→intermediate, modular | Full learning journey: ~100+ challenges |
| 2026-03-06 | Scaffolded challenges with progressive freedom | Sandbox, multiple modes, puzzle-style | Proven pedagogy, good for beginners, gradual autonomy |
| 2026-03-06 | Nx monorepo | Turborepo, pnpm only, single package, multi-repo | Best dependency graph visualization, opinionated for large projects |
| 2026-03-06 | Full mobile + desktop support (touch + keyboard/mouse) | Keyboard-only, mobile as stretch goal | Educational accessibility, broad audience reach |
| 2026-03-06 | Self-hosted shared hosting (no containers) | GitHub Pages, Cloudflare, Vercel, Docker | User preference for self-hosting |
| 2026-03-06 | USB deployment deprioritized to backlog | Static files w/ Brython, Electron, portable server | Focus on PWA first; Brython (file://-safe) identified as USB fallback if revisited |
| 2026-03-06 | Open-source art packs initially | AI-generated, commissioned, placeholder | Immediate availability; architecture to support AI art swap later (backlog) |
| 2026-03-06 | Initial locales: en + de | en-only, en+de+fr, en+de+es | English + German covers primary audience; i18n architecture supports any locale |
| 2026-03-06 | 12+ floors (expansive building) | 5-6, 8-10 | Full corporate HQ, ~60+hrs gameplay, maps to 12-chapter curriculum + optional areas |
| 2026-03-06 | Auto-save + unlimited named saves + JSON export/import | Auto-only, manual slots, auto+quicksave | Maximum flexibility for players |
| 2026-03-06 | Pre-defined AI sidekick (fixed name & personality) | Player-named, multiple personalities, customizable tone | Stronger narrative identity, easier to write for |
| 2026-03-06 | XP + skill tree progression | Knowledge-only, hybrid, full RPG | Traditional RPG tangible rewards tied to learning |
| 2026-03-06 | Achievements/badges system | No badges, curriculum-only badges | Extra motivation layer, shareable accomplishments |

## Tech Stack

- **Game Engine**: Phaser 3 (TypeScript)
- **UI Framework**: React 19 + Vite
- **Language**: TypeScript 5.6+ (strict mode)
- **Python Runtime**: Pyodide (CPython via WebAssembly, lazy-loaded)
- **Code Editor**: CodeMirror 6 (terminal-styled)
- **Audio**: Web Audio API + Howler.js (or similar)
- **Level Design**: Tiled Map Editor + LDtk
- **Package Management**: Nx monorepo + pnpm
- **Testing**: Vitest (unit), React Testing Library (components), Playwright (E2E), jest-axe (a11y)
- **Linting**: ESLint + Ruff (for Python challenge content), Prettier
- **CI/CD**: GitHub Actions
- **i18n**: react-i18next
- **State Persistence**: IndexedDB + localStorage + JSON export
- **Deployment**: Self-hosted shared hosting (PWA) + USB static files

## Architecture

### Monorepo Structure (Nx)

```
venomous-snake/
├── apps/
│   └── game/                 # Main game application (React + Phaser)
├── packages/
│   ├── engine/               # Phaser game engine wrapper, scenes, entities
│   ├── ui/                   # Shared React UI components (terminal, dialogs, menus)
│   ├── python-runtime/       # Pyodide integration, sandboxing, execution
│   ├── challenge-engine/     # Challenge validation, hint generation, progression
│   ├── challenges/           # Challenge content (YAML/JSON definitions)
│   ├── narrative/            # Story scripts, dialog trees, branching logic
│   ├── audio/                # Audio management, sound assets
│   ├── i18n/                 # Localization strings, locale management
│   ├── save-system/          # IndexedDB persistence, JSON export/import
│   └── shared-types/         # Shared TypeScript types
├── assets/
│   ├── sprites/              # Pixel art sprites and spritesheets
│   ├── tilemaps/             # Tiled .tmx / LDtk .ldtk maps
│   ├── audio/                # Music and SFX files
│   └── ui/                   # Vector UI assets
├── tools/
│   ├── challenge-validator/  # CLI tool to validate challenge definitions
│   └── usb-builder/          # Build script for USB distribution
├── .copilot/
│   └── project-state.md      # This file
├── .github/
│   ├── copilot-instructions.md
│   ├── copilot-instructions/
│   └── workflows/
└── docs/
    ├── curriculum.md          # Python learning curriculum design
    ├── game-design.md         # Game design document
    └── architecture.md        # Technical architecture
```

## Localization

- **Framework**: react-i18next
- **Default locale**: en
- **Planned locales**: TBD (architecture supports any)
- **Strategy**: All user-visible strings via i18n keys from day one

## Requirements

### Requirements: Foundation & Core Gameplay — 2026-03-06

**Functional Requirements:**
1. Nx monorepo with modular packages (engine, ui, python-runtime, challenge-engine, etc.)
2. Phaser 3 game engine rendering a 2D pixel-art world inside a React 19 shell
3. CodeMirror 6 hacking terminal with cyberpunk theme executing Python via Pyodide
4. Real CPython 3.12+ execution in sandboxed Web Worker
5. Scaffolded challenge system with progressive freedom (fill-blanks → open coding)
6. Rule-based procedural hint generation with tiered hints
7. Branching narrative + hub-based architecture with prerequisite gating
8. XP + skill tree + achievements progression system
9. Pre-defined AI sidekick with portrait + inline terminal hints
10. Full audio (ambient music + SFX)
11. 12-chapter Python curriculum (~100+ challenges): beginner → proficient
12. Auto-save + named saves + JSON export/import
13. Full mobile + desktop support (touch + keyboard/mouse)
14. i18n: en + de from day one
15. PWA deployment to self-hosted shared hosting

**Non-functional (Mandatory):** Security (OWASP), Accessibility (WCAG 2.1 AA), TDD

**Out of Scope:** USB deployment, multiplayer, cloud sync, LLM tutoring, locales beyond en/de, voice acting

## Product Backlog

See `plan.md` in session workspace for full backlog. 15 epics, ~90 user stories, ~410 total story points.

Top-priority epics (Must): Foundation, Core Engine, Hacking Terminal, Challenge Engine, Narrative, Game World, UI Shell, Progression, AI Sidekick, Curriculum, i18n, PWA, Accessibility.

## Project Status

**All 15 epics substantially complete.**

- **81 user stories completed**
- **2 stories deferred**: US-152 (cross-browser testing), US-153 (mobile device testing) — require real browser/device infrastructure not available in dev environment
- All 12 Nx projects pass type-check
- All tests pass (75 real unit tests + `passWithNoTests` for packages without tests yet)
- Production build succeeds with 6 code-split chunks + gzip/brotli compression

## What's Built

| Layer | Details |
|-------|---------|
| **Monorepo** | Nx: 1 app + 10 library packages + 1 tool |
| **Game engine** | Phaser 3: player, NPCs, tilemap, camera, interactive objects |
| **UI shell** | React 19: menus, panels, HUD, quest log, inventory, skill tree, floor map |
| **Hacking terminal** | CodeMirror 6 with cyberpunk theme |
| **Python runtime** | Pyodide integration: abstraction layer + mock for testing |
| **Challenge engine** | Runner, hint engine (10 error patterns), progression manager, timer |
| **Curriculum** | 105 Python challenges across 12 chapters (beginner → advanced) |
| **AI sidekick** | CIPHER: 8 context modes, SVG portrait with moods |
| **Narrative** | Dialog engine with branching, story manager with pronouns |
| **Progression** | XP system (10 levels), skill tree (30 nodes), achievements (31 badges) |
| **Save system** | IndexedDB: 20+3 auto-save slots, JSON export/import |
| **Audio** | Howler.js manager, SFX, ambient music stubs |
| **i18n** | English + German, 5 namespaces, locale switcher |
| **PWA** | Service worker (3-cache strategy), install/update prompts |
| **Accessibility** | Reduced motion, skip links, focus traps, arrow nav, announcer |
| **CI/CD** | GitHub Actions pipeline, manual deploy workflow |
| **Tests** | 75 unit tests passing |
| **Performance** | Code splitting: phaser/codemirror/react/pyodide/i18n chunks |
| **Mobile** | Symbol bar, virtual joystick, breakpoint system |

## Known Limitations / Future Work

1. **No actual art assets** (procedural placeholders) — needs pixel art sprites, tilesets, portraits
2. **No actual audio files** — needs cyberpunk music + SFX; stubs are wired up but silent
3. **No tilemap files from Tiled/LDtk** — architecture ready but needs level design work
4. **Pyodide mock mode in tests** — real Web Worker integration needs browser testing environment
5. **USB distribution deferred** — Pyodide can't run from `file://`; Brython identified as fallback if revisited
6. **Cross-browser & mobile testing deferred** — US-152, US-153 require real browser/device infrastructure
7. **`@nx/vite:test` executor deprecated** — should migrate to `@nx/vitest:test` in Nx 23

## Current Sprint

**COMPLETE — Final state reached.**

## Sprint History

### Sprint 1 — "Foundation" ✅
- US-001: Nx monorepo scaffold (3pts) — DONE
- US-003: Dev environment & tooling (2pts) — DONE
- US-010: Phaser 3 + React integration (5pts) — DONE
- Commit: 7bed87a, f48dccd

### Sprint 2 — "Game World Engine" ✅
- US-011: Tilemap rendering (5pts) — DONE
- US-012: Player character movement (5pts) — DONE
- US-013: Camera system (3pts) — DONE
- US-014: Interactive objects (3pts) — DONE

### Sprint 3 — "Hacking Terminal" ✅
- US-020: CodeMirror editor with terminal theme (5pts) — DONE
- US-021: Pyodide integration (8pts) — DONE
- US-022: Output panel (3pts) — DONE
- US-023: Input() handling (5pts) — DONE
- US-024: Error feedback (3pts) — DONE
- US-026: Interpreter abstraction layer (3pts) — DONE

### Sprint 4 — "Challenge Engine + Narrative + i18n" ✅
- US-002: CI/CD pipeline (3pts) — DONE
- US-004: PWA manifest & service worker (2pts) — DONE
- US-030: Challenge definition schema (3pts) — DONE
- US-031: Challenge validation & test runner (5pts) — DONE
- US-032: Progressive scaffolding system (5pts) — DONE
- US-033: Procedural hint generation engine (8pts) — DONE
- US-034: Challenge progression & unlock gating (3pts) — DONE
- US-040: Dialog engine (5pts) — DONE
- US-043: Player gender choice & pronouns (2pts) — DONE
- US-044: Story state tracking (3pts) — DONE
- US-120: i18n framework setup (3pts) — DONE
- US-121: English string extraction (3pts) — DONE
- US-122: German translation (8pts) — DONE

### Sprint 8 — "Final Curriculum" ✅
- agent-13 completed chapters 7–12: 54 challenges, 10 chapter files + index files + full EN/DE i18n
- Total curriculum: **105 challenges across 12 chapters**
- All type-checks pass, all tests pass, build succeeds
- Commit: 4516ea0

## Bug Fix Rounds (Post-Completion)

### Round 1 — Mobile & Gameplay (commit a748a7a)
- Virtual joystick positioning fixed
- Android keyboard (custom CodeKeyboard)
- Dialog system continuation
- Character sprites, background music

### Round 2 — Visual & Interaction (commit e22ef9a)
- Custom Android keyboard, interaction system
- Camera zoom to 2.0, dialog portraits (24 SVG), level visuals

### Round 3 — Visibility & Graphics (commit fb3e3fb)
- E button depth above vignette (200), landscape enforcement
- All placeholder sprites replaced with cyberpunk designs

### Round 4 — Display Scaling (commit da6e457)
- Switched from camera zoom 2.0 to base resolution 400×304 with Scale.FIT
- Tripled furniture/decorations across all floors
- 48×48 HUD buttons with neon styling, 15 learning items

### Round 5 — Game Logic (commits 33fb9f3, 4445715)
- Inventory-gated dialog choices and stealth/alert system (0-3 alert levels)
- Floor preloading in BootScene, tileset key fix, terminal session key

### Round 6 — Critical Bugs + Engagement (commits d2f6f94, 8f500b8, b3e4d52, 1108ec8)
- **Terminal typing**: CodeMirror Compartment for dynamic readOnly (was baked at mount)
- **Floor transitions**: Added `init()` to GameScene, 'elevator' to TilemapManager valid types, door locking with `requiresChallenge` checks
- **Items**: 27 new items added to floors 4-11, all with database entries
- **Locked door visuals**: Red tint + 🔒 for locked, green for unlocked
- **Achievement toast**: Wired to App.tsx, triggers on first pickup and floor unlock
- **Level calculation**: Auto-calculates from XP (floor(xp/100) + 1)
- **Quest log**: Live progress from game state via useCurriculumProgress hook

### Round 7 — Submit Button, Mission Objectives & Floor Transitions (commit ed220ae)
- **Submit button visibility**: Restructured CSS flex chain so toolbar is always visible
- **Mission Objectives panel**: Persistent checklist derived from challenge test cases with pass/fail/pending states
- **Door locking**: ACCESS DENIED with camera shake + floating red text when trying locked doors; removed unlocked door from test room fallback
- **Floor transitions**: Added `camera.resetFX()` at start of `create()`, safety timeout forcing camera visible after 1s, `FLOOR_ARRIVED` event for React layer
- **Shared event types**: Added `ACCESS_DENIED` and `FLOOR_ARRIVED` event types to `shared-types`
- Files changed: `InteractiveObject.ts`, `GameScene.ts`, `shared-types/index.ts`, `HackingTerminal.tsx`, `terminal.css`

## Open Items

> Superseded by **Known Limitations / Future Work** above. All open items have been resolved or explicitly deferred.
