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
- 2026-11-04 later: on Peter's request the text link became the official Ko-fi logo (`kofi_logo.svg` from Ko-fi brand asset kit v2, self-hosted, unmodified, 22 px high, alt text with link name and new-tab hint). Live: lernspiele release 20261104064840-316540 (820 files, 31 routes 200), lernmaterial fa024e2; snake precaches the logo.

## 2026-11-05 prof.aufner.org link
- Main menu support line starts with "Ein Angebot von Prof. Aufner" (EN "Brought to you by"), link https://prof.aufner.org/, new tab, rel=noopener, screen-reader hint. Commit `e47ab91`, merge `d612724`; lint, type-check, test, build passed. Live via lernspiele release `20261105042700-768200`; the lernspiele release fails if the bundle lacks either URL.

## 2026-11-07: relicensed to PolyForm Noncommercial 1.0.0
- Peter's order: only he may make money from the games. `LICENSE` is the verbatim PolyForm Noncommercial 1.0.0 text with `Required Notice: Copyright 2026 Peter Aufner (https://prof.aufner.org)`; root and all workspace `package.json` files carry `"license": "PolyForm-Noncommercial-1.0.0"`; README licence section rewritten (content CC BY-NC-SA 4.0, third-party Pyodide MPL-2.0). Versions before 2026-11-07 stay AGPL-3.0 for those who received them.
- Open: `dist/pyodide/` ships Pyodide (MPL-2.0) without a licence or source notice next to the files; MPL 3.2 wants recipients of the executable form told where the source is. Proposal: emit a short `pyodide/LICENSE.txt` in `selfHostedPyodide()`.
- Gates green (pnpm audit 0, lint, type-check, tests, build). Release via lernspiele by the coordinator.

## 2026-11-15 Modern Web Guidance run (web-modernize timer)
- `legacy-scan` (modern-web-guidance 1.0.0) on `apps/game` and `packages`: one finding, `ime-safe-enter-submit` at `packages/ui/src/terminal/OutputPanel.tsx:36`, kept. Fix: Enter in the stdin field is ignored while composing (`isComposing` or `keyCode === 229`), plus `preventDefault`. Commit `85af55a`, merged to `main`. Re-scan: 0 findings.
- Gates: lint, type-check, test, build green. Browser check (headless Playwright against `pnpm dev`, script kept locally in `.scratch/mwg/ime-check.py`): a composing Enter and a 229 Enter keep the field, a plain Enter submits, no page errors.
- Not released: releases run through `npm run release` in `~/code/lernspiele.aufner.org` (another project; release by the coordinator or Peter).
- Proposals in `.agents/to-do.md`: free-mode terminal is not interactive, so the stdin field is unreachable in play.

## 2026-11-15 Interactive input() (Peter's decision "Venomous Snake input()")
- Trajectory: free mode runs Python with `interactive: true` and `echoPrompts: true`; challenge mode subscribes `onInputRequest` in `useChallengeTerminal` for free runs (graded runs stay non-interactive, `ChallengeRunner`). The stdin field in `OutputPanel` is a `<form>` with a visible `<label for>` ("Eingabe für input():" / "Input for input():"), the prompt as `aria-describedby`, a `type="submit"` button ("Senden ⏎" / "Send ⏎"); Enter goes through `requestSubmit` and keeps the IME guard. i18n key `input_aria` replaced by `input_label` and `input_submit`.
- Runtime: `BaseInterpreter` ends a run waiting for input when the last `onInputRequest` listener unsubscribes (terminal closed), so the shared interpreter queue cannot stall; `requestInput` without listeners resolves to `null`.
- Fixed on the way: free mode appended streamed output and tracebacks twice (it also collected `result.output`). Output chunks are now `display: inline`, so an answer continues its prompt's line.
- Tests: new `packages/ui/src/terminal/__tests__/OutputPanel.test.tsx` (jsdom via `// @vitest-environment jsdom`, react-dom `act`, no new dependency), two runtime tests (cancel on unsubscribe, EOFError without interactive). Gates lint, type-check, test, build, `pnpm audit` 0 green.
- Browser check (headless Chromium `/usr/bin/chromium`, `pnpm dev`, script `.scratch/input/input-check.py`, screenshots there): free mode and a challenge free run both ask `Name:` then `Alter:`, answers via the Send button and via Enter, output `Name: Ada / Alter: 36 / Hallo Ada 37`, closing while input is pending leaves the next run working, no overflow at 360 px. Only console errors: `favicon.ico` 404 under the dev server (pre-existing, unrelated).
- Commit `4f8fe87`, merged to `main` as `1d3658e`, pushed. Not released (by order); Greeter told the lernspiele release may go ahead.
- Open: Run stays disabled while a program waits for input; the way out is answering or closing the terminal. A Stop button would be a small follow-up if Peter wants one.

## 2026-11-15 D52 Pyodide upstream report (from the Code session, Peter's tick in `~/code/.agents/archive/open-tasks-2026-11-15.md` line 139)
- Verified in the shipped `pyodide.asm.wasm` (314.0.7): SQLite `3.39.0` (2022-06-25), bzip2 `1.0.6, 6-Sept-2010`. Pyodide 314.0.8 (latest, 2026-11-13) and `main` still pin `sqlite-autoconf-3390000` (`cpython/Makefile` line 30) and use Emscripten's `-sUSE_BZIP2` port, which is 1.0.6 in Emscripten 5.0.3 and `main`; `emscripten-ports/bzip2` `decompress.c` lacks the CVE-2019-12900 upper bound. No existing issue; open PR pyodide#6533 (sqlite extensions) keeps 3.39.0.
- Pyodide's `SECURITY.md` says vulnerabilities go through GitHub Security Advisories, not public issues, so the draft is written for the advisory form.
- Draft: `docs/upstream-pyodide-issue.md`.
- Needs Peter: open https://github.com/pyodide/pyodide/security/advisories/new, paste the title and body from the draft (fields "Type of issue" etc. are in the file), submit. Optional: a separate report to Emscripten for its bzip2 and sqlite3 ports (not drafted).

## 2026-11-15 Lazy locales, German manifest, Pyodide licence, switcher fix (brief from the dispatcher)
- Trajectory: Peter's open items from the retired list (archive `~/code/.agents/archive/open-tasks-peter-2026-11-15-0804.md` line 532) done: `pyodide/LICENSE.txt`, German manifest and meta description, lazy-loaded inactive language. Found and fixed on the way: the title screen language switcher was invisible.
- Locales (`packages/i18n/src/i18n.ts`): custom i18next backend over `import('./locales/<lng>')`, so `en` and `de` are separate chunks; `main.tsx` renders after `i18nReady` and then `warmInactiveLanguage()` fetches the other chunk when idle (an SW installed by an older release never precached it, so this keeps offline switching working). Main chunk 948 KB -> 549 KB (en 180 KB, de 245 KB); cipher texts left the main chunk. German has no English fallback; new `packages/i18n/src/__tests__/parity.test.ts` guards that every English key exists in German. `supportedLngs` en/de with `load: 'languageOnly'`: unsupported locales (fr-FR) get English. `i18n.language` can still be `de-AT`/`en-US`; read `resolvedLanguage` for the bundle code. Tests that need a language call `await i18nReady; await i18n.loadLanguages(...)` (storyContent, challenge-validator).
- German `manifest.json` (name "Venomous Snake – Python-Hacking-RPG" as the in-game subtitle, description, `lang: de`), meta description, `<html lang="de">` before i18n sets it.
- `pyodide/LICENSE.txt` is generated in `selfHostedPyodide()` (`apps/game/vite.config.ts`): version from the package, MPL 3.2 source links (`github.com/pyodide/pyodide/tree/<version>`, npm), MPL 2.0 text (`apps/game/licenses/MPL-2.0.txt`, Mozilla's copy), CPython licence (`apps/game/licenses/CPython-3.14-LICENSE.txt`, from tag v3.14.2; the Pyodide wasm and stdlib ship CPython 3.14.2 without it). The build fails when Pyodide moves to a Python line other than 3.14: vendor that line's `LICENSE` then. README licence line mentions the file.
- Switcher: since `b88b00e` the main menu is fixed at z-index 100 and covered the switcher (z-index 10). Now top right at z-index 101, inactive label #a3a3a3 (7.8:1 instead of 2.1:1), pressed state from `resolvedLanguage` (de-AT showed EN as active).
- Gates: lint, type-check, all 12 test projects, build, `pnpm audit` 0; CI run 43723766197 green on 850ef25. Browser (headless `/usr/bin/chromium` against `vite preview`, scripts `.scratch/i18n/lazy-check.py`, `.scratch/i18n/switcher-check.py`, screenshots there): en-US, de-AT, stored `de`, fr-FR each load only their chunk first, the other after render; switching works both ways; switcher visible and clickable at 1280 and 360 px; no page errors (only the known `favicon.ico` 404). `tools/review/browser-smoke.py` passes against `pnpm dev`. `apps/game/index.html` fails `prettier --check`: pre-existing on main, not touched.
- Commits: `91053d6` (merge `850ef25`), `29ede6c` (merge `8d13e07`), pushed; branches `feat/lazy-locales-pyodide-licence` and `fix/locale-switcher-above-menu` kept on the remote.
- Release: handed to "Code: lernspiele.aufner.org" (`rc code lernspiele.aufner.org --brief -`, then a SendMessage about `8d13e07`). Check its handoff for the release id.

## Open decisions
- Third-party notices beyond MPL and PSF: the shipped wasm also carries bzip2 1.0.6, zlib, SQLite (public domain), libffi, expat, mpdecimal and HACL*; bzip2, mpdecimal (BSD-style) and libffi, expat (MIT) ask that their notices travel with binaries. `LICENSE.txt` now only points to docs.python.org/3.14/license.html. Options: A an agent appends the full notices to `LICENSE.txt` (vendored texts, about 1 h) **recommended**, since the pointer is not the notice those licences ask for; B keep the pointer.

## Needs Peter
- Post the drafted private advisory at https://github.com/pyodide/pyodide/security/advisories/new (title and body in `docs/upstream-pyodide-issue.md`). Unchanged; agents do not redraft it.
- Native read of the machine-assisted German dialog (Echo, Nova, Kai read stiff; NeoCorp versus Rattlesnake Corp). Old item, no deadline.

## Dated, not yet due
- Once a Pyodide release ships SQLite >= 3.50.2 and bzip2 1.0.8: bump `pyodide` in `packages/python-runtime`, bump `CACHE_VERSION` in `apps/game/public/sw.js`, check the vendored CPython licence line (build guard), then move the Android `web/` pin in `~/code/venomous-snake-android`. Last checked 2026-11-15: 314.0.8 still pins SQLite 3.39.0 and bzip2 1.0.6.

## Next steps
- Only the open decision above and what Peter asks for. BIMM is out of scope (Peter handles it himself).
