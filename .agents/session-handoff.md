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

## Decisions closed 2026-11-01

- No-WASM fallback: closed, `MiniPythonEvaluator` is gone; Python needs WASM.
- Floor table: closed, `packages/challenges/src/floors.ts` is canonical, one chapter per floor.
- Narrative: both sources are live. `story.json` narrates rooms through the engine, `narrative/dialogs` plus `dialog.json` drive NPC talks. Earlier notes calling the dialog trees unreachable were wrong: they were bundled, and only their overlay was never mounted.
- Dormant features: NPC dialogs and items are wired. Credits, cutscenes, tutorial overlay, tutor mode and inventory panel are not rendered and are tree-shaken, so they do not reach players. They stay in the tree: removing them drops product scope, which is the owner's call.

## Next steps

- Peter: `git stash drop` the redundant lint-staged backup `b46af8a` (stash@{0}); the permission classifier refused it twice.
- Peter: a browser that ran the old localhost service worker may need it unregistered once; a fresh browser does not.
- Open content work: 37 challenges still pass a printed answer (`hardcode-fails` allowlist in `known-violations.json`). Learners write the data themselves there, so stdout comparison has nothing to vary; they need AST checks such as "uses a for loop", a new engine feature.
- Dialog German was machine-assisted: the register of casual characters (Echo, Nova, Kai) reads stiff in `Sie`, and source inconsistencies remain (NeoCorp versus Rattlesnake Corp, Sterling's "Mr. Snake"). Worth a native read.

## Housekeeping 2026-11-01
- The seven review scripts moved from `.scratch/` to `tools/review/` and pass the hook with real types (no `--no-verify`, no `eslint-disable`, no config change). Usage: `tools/review/README.md`.
- This was a port: since the review `PyodideInterpreter`, `rooms/definitions`, per-challenge exports, esbuild and the old `input()` semantics had gone. `pyo.test.ts` uses `InProcessInterpreter`, `run_py.py` mirrors the current `ChallengeRunner`, `reach.py` reads a metafile from `vite.metafile.config.ts`, `browser-smoke.py` has current selectors.
- Reports go to `.scratch/review/`, now also ignored in the repo `.gitignore`. `tools/review` has no `package.json` or `project.json`, so it is neither a pnpm package nor an Nx project and CI does not run it.
- Current results: 108/108 completable, 0 CPython solution failures on 3.13 and 3.14, 5 scaffolds pass unmodified on 3.14 (exactly the `known-violations.json` list; 3 on 3.13, because `ch11_01` and `ch11_07` only pass through lazy annotations), floor models agree (0/108 mismatches). Still open from review item P0-6: 101/108 challenges have identical test cases, 103/108 are output-only.
- `reach.py` counts barrels and type-only files as dead, so its 6,630 lines overstate dead code.
- Consistency checks are now real tests: every room reachable, chapter list and floor map agree (`world.test.ts`), achievement references exist (`Achievements.test.ts`). Each was shown to fail on deliberately broken data. `tools/review/closure.test.ts` was removed as a duplicate of the existing completability test; `consistency.test.ts` stays as a numeric report.
- Resolved the same day:
  - `.serena/` is no longer tracked and is ignored in the repo too, so `.serena/memories/` left the repo. Git deletes these files from the working tree when a clone pulls this change (it happened here and was restored by hand): on another machine back up `.serena/` first, or let Serena regenerate `project.yml`.
  - CI: lint, test and the audit now block; the audit level rose from critical to moderate.
  - Audit: overrides for `follow-redirects` (GHSA-mrwp-f3q8-3g9p, high) and `minimatch` (GHSA-g3hv-75wg-m249, moderate). The `minimatch` override crosses a major version because Nx and typescript-eslint still pin 10; drop it once they move.
  - Removed the `first_pickup` achievement (no emitter, no translations, no item grants in the live game), so 31 achievements remain, and the dead `roomId` and `terminalId` fields of `Challenge`.
  - `challenge-validator:build` passes through a new `tsconfig.lib.json`.
- Open: one workspace test run failed once right after the override install; the log was lost. It did not recur in 13 further runs, also after a fresh install and at 200 % CPU load, so the cause is unknown. A CI failure in `Test` should be read with this in mind.
- Dev server fix: `pyodide.asm.mjs` was served as `application/octet-stream`, so Python could not start under `pnpm dev`. `.mjs` is now in the MIME table. Verified in a browser: worker loads, a runaway loop times out, the interpreter recovers; `browser-smoke.py` now covers this and fails without the fix. Production build checked through `vite preview`, not on the live host.
- Remaining review items closed: hidden tests of 66 challenges now use other data (a new `hardcode-fails` rule keeps it that way); NPC dialogs render, with an inventory derived from solved challenges; German `dialog.json` is complete; the service worker precaches from a build-generated list, so offline play works after one visit (bump `CACHE_VERSION` when Pyodide changes); a production CSP, an error boundary, and no more orientation lock or duplicate tracebacks.
- Live host checked: it serves `.mjs` as `text/javascript`.
- Released to production 2026-11-01 as `20261101072332-216473` with the local pipeline (`npm run release` in `~/code/lernspiele.aufner.org`): source `a64cb56`. Live check with a desktop `User-Agent`: Python under the CSP, service worker precache, German NPC dialog and an offline reload all work.
