# Session handoff

## 2026-10-24 release audit remediation
- Updated transitive body-parser to 1.20.9 and on-finished to 2.4.2 via compatible lockfile refresh. Audit, lint, type-check, tests and build passed. Main `45e3964` merged/pushed; GitHub CI passed. Used site `.scratch/remediation/venomous-snake` worktree to preserve pre-existing `.serena/project.yml` and `nx.json` edits.

Date: 2026-10-21

## CI follow-up

- Removed the production SCP deployment from push/PR CI. CI retains lint/typecheck/test/build and the build artifact; hosting deployment remains manual, while Lernspiele publishing is handled by the existing dispatch notification/release pipeline.
- GitHub Actions run 39581905945 passed all CI stages after this change. The prior failure was the obsolete automatic SCP deploy, which failed because deployment SSH credentials were unavailable.

## Intent

Fix local Vite development worker load failure caused by the production service worker intercepting Vite's `/@fs/...` worker request.

## State

Service-worker registration in `apps/game/index.html` is now production-only using Vite's `%MODE%` HTML replacement. Production output retains registration; workspace tests, type-check, lint, and build pass.

The helper scripts formerly in `.scratch/` now live in `tools/review/` (see Housekeeping 2026-11-01). `.scratch/challenges.json` was explicitly removed per request.

## Pending decisions for the owner

- Which dormant features are in scope (credits, cutscenes, tutorial, skill tree, achievements, inventory) versus to be removed.
- Single narrative source: `engine/narrative/storyContent.ts` or `narrative/dialogs` plus `dialog.json`.
- Whether a no-WASM fallback (`MiniPythonEvaluator`) has a real requirement.
- Canonical floor/chapter table (12 floors with chapters 1 and 2 sharing the lobby, or one chapter per floor).

## Next steps

- Unregister any existing localhost service worker once in the browser and reload the dev server page to verify the worker request succeeds.
- Commit and push this fix to `main`.

## Housekeeping 2026-11-01
- The seven review scripts moved from `.scratch/` to `tools/review/` and pass the hook with real types (no `--no-verify`, no `eslint-disable`, no config change). Usage: `tools/review/README.md`.
- This was a port: since the review `PyodideInterpreter`, `rooms/definitions`, per-challenge exports, esbuild and the old `input()` semantics had gone. `pyo.test.ts` uses `InProcessInterpreter`, `run_py.py` mirrors the current `ChallengeRunner`, `reach.py` reads a metafile from `vite.metafile.config.ts`, `browser-smoke.py` has current selectors.
- Reports go to `.scratch/review/`, now also ignored in the repo `.gitignore`. `tools/review` has no `package.json` or `project.json`, so it is neither a pnpm package nor an Nx project and CI does not run it.
- Current results: 108/108 completable, 0 CPython solution failures on 3.13 and 3.14, 5 scaffolds pass unmodified on 3.14 (exactly the `known-violations.json` list; 3 on 3.13, because `ch11_01` and `ch11_07` only pass through lazy annotations), floor models agree (0/108 mismatches). Still open from review item P0-6: 101/108 challenges have identical test cases, 103/108 are output-only.
- `reach.py` counts barrels and type-only files as dead, so its 6,630 lines overstate dead code.
