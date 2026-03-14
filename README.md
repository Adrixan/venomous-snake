# Venomous Snake 🐍

A **text-based cyberpunk RPG** that teaches Python programming from scratch. Players explore a noir hacking world across 12 floors, solving 118 coding challenges that progress from `print("Hello, World!")` to advanced topics like decorators, generators, and file I/O.

## Features

- **Learn by doing** — every concept is introduced through hands-on challenges with instant feedback
- **Progressive curriculum** — 12 chapters covering variables, control flow, functions, data structures, OOP, and more
- **In-browser Python** — code runs in a real Python interpreter (Pyodide/WASM) directly in the browser
- **Story-driven** — NPCs, narrative dialog, and room exploration give context to each lesson
- **Offline-capable** — service worker caches assets for offline play (PWA)
- **Bilingual** — English and German localization

## Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org/) | ≥ 20 (22 recommended) |
| [pnpm](https://pnpm.io/) | ≥ 10 |

### Install & Run

```bash
# Install dependencies
pnpm install

# Start the development server (http://localhost:4200)
npm run dev
```

### Build for Production

```bash
npm run build
```

The build output is written to **`dist/apps/game/`**. This directory contains a fully self-contained static site — no server-side runtime required.

## Deployment

### Shared Hosting / Any Static Server

Upload the **contents** of `dist/apps/game/` to your web root (or any subdirectory). All asset paths are relative, so the game works from any URL path.

```
dist/apps/game/
├── index.html          ← entry point
├── manifest.json       ← PWA manifest
├── sw.js               ← service worker
├── icons/
│   └── icon.svg
├── assets/
│   ├── index-*.js      ← application bundle
│   ├── index-*.css     ← styles
│   ├── vendor-*.js     ← third-party chunks
│   └── ...
└── *.gz / *.br         ← pre-compressed copies (optional)
```

> **Tip:** If your hosting supports it, configure the server to serve `.gz` or `.br` files for significantly smaller transfers. Otherwise, just delete those files — they are optional.

### GitHub Pages / Netlify / Vercel

No special configuration needed. Point the build output directory to `dist/apps/game` and you're set. No server-side routing is required — the game is a single-page application with hash-based navigation.

### CI/CD

The repository includes two GitHub Actions workflows:

- **`.github/workflows/ci.yml`** — runs on every push/PR: installs, type-checks, lints, tests, and builds
- **`.github/workflows/deploy-manual.yml`** — manual deploy via SCP (requires `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_KEY`, and `DEPLOY_PATH` secrets)

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build (all packages + game) |
| `npm run test` | Run all tests |
| `npm run lint` | Lint all packages |
| `npm run type-check` | TypeScript type checking |
| `npm run format` | Check formatting (Prettier) |
| `npm run format:fix` | Auto-fix formatting |

### Project Structure

```
venomous-snake/
├── apps/
│   └── game/                  # React app (Vite) — main entry point
├── packages/
│   ├── engine/                # Game engine: rooms, navigation, actions, NPC logic
│   ├── ui/                    # React components: StoryTerminal, HackingTerminal
│   ├── challenges/            # 118 challenge definitions (12 chapters)
│   ├── challenge-engine/      # ChallengeRunner: executes & validates student code
│   ├── python-runtime/        # Pyodide interpreter + MiniPythonEvaluator fallback
│   ├── narrative/             # Dialog engine & dialog trees
│   ├── i18n/                  # Internationalization (EN, DE)
│   ├── audio/                 # Audio manager
│   ├── save-system/           # Local save/load via localStorage
│   └── shared-types/          # TypeScript interfaces shared across packages
├── .github/workflows/         # CI and deploy workflows
├── nx.json                    # Nx workspace configuration
├── pnpm-workspace.yaml        # pnpm workspace definition
└── tsconfig.base.json         # Shared TypeScript config
```

### Tech Stack

- **Runtime:** React 19, TypeScript 5, Vite 6
- **Python execution:** [Pyodide](https://pyodide.org/) (CPython compiled to WASM)
- **Code editor:** [CodeMirror 6](https://codemirror.net/)
- **Monorepo:** [Nx](https://nx.dev/) + pnpm workspaces
- **i18n:** i18next + react-i18next
- **Testing:** Vitest
- **Linting:** ESLint + Prettier

## License

[GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE)
