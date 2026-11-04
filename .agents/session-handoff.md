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
- Dormant features: all enabled on 2026-11-01 (see below). Still not used, on purpose: `ChallengePanel` (the terminal objectives replaced it), `ResponsiveLayout` and `useArrowNavigation` (the screens have their own layout and key handling), `AudioManager` with `MusicTracks` and `SoundEffects` (they expect `.ogg` files the repo does not have; the game uses procedural audio), `StoryManager`, `useCurriculumProgress`, `utils/performance.ts`.

## Next steps

- Peter: `git stash drop` the redundant lint-staged backup `b46af8a` (stash@{0}); the permission classifier refused it twice.
- Peter: a browser that ran the old localhost service worker may need it unregistered once; a fresh browser does not.
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

## Dormant features and AST checks 2026-11-01
- Writing rules: `Challenge.structureChecks` (node, call, assign, import), evaluated with Python's `ast` in `packages/challenge-engine/src/StructureChecker.ts` after the output tests pass and shown as objectives. Rules ask only for the taught concept, so alternatives stay valid. Leftover `___` blanks always fail. Only `ch01_01` stays on the allowlists: printing is the exercise there.
- Wired: intro, floor, boss and victory cutscenes, credits, New Game+ (keeps XP, skills, achievements), tutorial overlay (rewritten for the text UI, restart in Settings), tutor mode, inventory panel with pickup toasts, skill tree with real effects (`speed_bonus`, `hint_boost`, XP is spent), floor banner and progress bar, CIPHER dialog and error explanations (new `cipher` i18n namespace), language switcher, Python loading screen, focus trap, screen reader announcements.
- Saves now really hold skills, spent XP, achievements, seen cutscenes, play time and the New Game+ cycle.
- Live bugs fixed on the way: XP never reached the store for any player, a second key handler in `StatusBar` paused the game on Esc, the tutorial bubble left the screen, `InventoryPanel` used the wrong namespace, `ch01_02` described a variable the test did not use.
- `tools/review/browser-smoke.py` drives the full opening; rerun it after UI changes.
- Released as `20261101101744-252581` (source `95ead96`). Live browser check in German with a desktop `User-Agent`: cutscene, tutorial, skills, NPC dialog, CIPHER error text, XP and level, a hard-coded answer rejected, inventory, service worker, offline resume. No console, CSP or HTTP errors.

## Full German 2026-11-01
- Everything a player perceives is German in German mode, including aria labels and starter code comments. Stays English on purpose: Python tracebacks and all program output, because tests compare it. `apps/game/public/manifest.json` and the meta description in `index.html` stay English.
- English hints, test descriptions and comments live in the challenge data; German in `packages/i18n/src/locales/de/challengeDetails.json`. Engine packages carry keys (`HintResult.key`, `TestResult.failure`, `SaveSystemError.code`), the UI words them. Adding a challenge fails the validator until its German exists.
- Comments are the keys of a map, so read them raw with `getResource`: i18next splits keys on `:` and `.`.
- The main chunk is 948 KB with both languages. Lazy-loading the inactive language would reduce it.
- Released as `20261101110425-290099` (source `d984548`). Live browser check in German with a desktop `User-Agent`: quest log, starter comments, objectives, hint, failure text and a solved challenge, no console, CSP or HTTP errors.

## Exit state 2026-11-01
- Trajectory: review scripts moved to `tools/review`, review findings closed, dormant features and ast writing rules enabled, full German translation, three production releases. Latest live: `20261101110425-290099`. Peter considers this work done.
- Open, none blocking: native read of the German; `manifest.json` and the `index.html` meta description are English; main chunk 948 KB (lazy-load the inactive language); one unexplained test failure on 2026-11-01 never recurred; skill purchases that spend XP and the skill effects are unit-tested only, the endgame was driven through the event bus, not played.
- Decisions pending: none. Next step: only what Peter asks for.

## 2026-11-04 Ko-fi support link (prepared, NOT deployed)
- Task from Peter via the Greeter: Ko-fi link (https://ko-fi.com/prof_aufner, from prof.aufner.org) on lernspiele, all games, lernmaterial and all materials, default for all releases.
- Branch `feat/kofi-support-link` pushed in lernspiele.aufner.org (b2e77ea), lernmaterial.aufner.org (da4aabe), venomous-snake (34ee456). Not merged to main: releases build from default branches.
- Mechanism: `scripts/support-footer.mjs` (identical in both site repos) injects the line at release time, inside `<footer class="footer">` or as a band, styles in `/css/support-footer.css`; release fails if a page lacks it. Venomous Snake is a fixed full-screen app: link in its main menu, manifest `supportFooter: "in-app"`, release checks the bundle.
- Verified: snake lint/type-check/test/build, lernmaterial tests and `release:build`, lernspiele injection on a copy of release 20261103205921-190890 with screenshots (desktop and mobile).
- Blocked on Peter: go/no-go, given § 46 SchUG open item (ask the Direktion about personal links on school materials) and Prof. Aufner rule 4 (Ko-fi never pushed at minors; text addresses adults). Kids games (kids/*) also get the line unless Peter excludes them.
- On go: merge the three branches (--no-ff), `npm run release` in lernspiele.aufner.org and lernmaterial.aufner.org (one SSH attempt, fallback DEPLOY_VIA=m11x).
- DEPLOYED 2026-11-04 on Peter's go ("Deploy everywhere", kids games included, § 46 SchUG question accepted by him): merged to main (venomous-snake 63aa115, lernspiele 6227477, lernmaterial 1eecac8). lernspiele release 20261104063004-309030 (818 files match, 31 routes HTTP 200, backup ~/lernspiele-backup-20261104063004-309030.tar.gz); lernmaterial release 1eecac8 (all deploy checks ok). Live curl check: link on landing pages, kids/mathematik, sudoku, cast-game, zaehlen-denken-wahrnehmen, snake bundle; /css/support-footer.css 200 on both hosts.
