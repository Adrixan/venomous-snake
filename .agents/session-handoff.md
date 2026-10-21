# Session handoff

Date: 2026-10-21

## CI follow-up

- Removed the production SCP deployment from push/PR CI. CI retains lint/typecheck/test/build and the build artifact; hosting deployment remains manual, while Lernspiele publishing is handled by the existing dispatch notification/release pipeline.
- GitHub Actions run 39581905945 passed all CI stages after this change. The prior failure was the obsolete automatic SCP deploy, which failed because deployment SSH credentials were unavailable.

## Intent

Fix local Vite development worker load failure caused by the production service worker intercepting Vite's `/@fs/...` worker request.

## State

Service-worker registration in `apps/game/index.html` is now production-only using Vite's `%MODE%` HTML replacement. Production output retains registration; workspace tests, type-check, lint, and build pass.

Untracked helper material in `.scratch/` (consistency, closure and reachability scripts, CPython and Pyodide harnesses) is user-owned and retained. `.scratch/challenges.json` was explicitly removed per request.

## Pending decisions for the owner

- Which dormant features are in scope (credits, cutscenes, tutorial, skill tree, achievements, inventory) versus to be removed.
- Single narrative source: `engine/narrative/storyContent.ts` or `narrative/dialogs` plus `dialog.json`.
- Whether a no-WASM fallback (`MiniPythonEvaluator`) has a real requirement.
- Canonical floor/chapter table (12 floors with chapters 1 and 2 sharing the lobby, or one chapter per floor).

## Next steps

- Unregister any existing localhost service worker once in the browser and reload the dev server page to verify the worker request succeeds.
- Commit and push this fix to `main`.
