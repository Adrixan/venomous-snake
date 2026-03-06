# Venomous Snake — Project State

> Last updated: 2026-03-06

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

## Current Sprint

**Sprint 1 — "Foundation"**
- **Goal**: Working Nx monorepo with Phaser + React rendering a test scene in the browser.
- **Points**: 8
- **Stories**: US-001 (3pts), US-003 (2pts), US-010 partial (3pts)
- **Status**: Not started — awaiting user confirmation of backlog

## Sprint History

*None yet*

## Open Items

1. **USB deployment (backlog)**: Pyodide requires HTTP; Brython identified as file://-safe alternative (90% curriculum). Deprioritized — focus on PWA. See `CURRICULUM_RESEARCH.md` sections B–I for full analysis.
2. **Python curriculum design**: Research complete — see `CURRICULUM_RESEARCH.md`. 12-chapter progression with ~100+ challenges designed.
3. **Asset pipeline**: Need to determine sprite/tilemap art source (custom art, open-source assets, commissioned, AI-generated).
4. **Mobile coding UX**: On-screen keyboard for Python coding on mobile/tablet needs UX research — standard mobile keyboards lack symbols needed for coding.
