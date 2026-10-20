# Session handoff

Date: 2026-10-20

## Intent

Dependency and content cleanup: update compatible dependencies, remove `challenges.json`, validate security and release checks, and push the result to `main`.

## State

Dependency refresh and i18n cleanup complete. Both localized `challenges.json` files were removed and their translations moved to TypeScript resource modules. Nx test targets use `@nx/vitest:test`; Pyodide 314 asset handling uses `pyodide.asm.mjs`. Tests, type-check, lint, build, and `pnpm audit` pass.

Untracked helper material in `.scratch/` (consistency, closure and reachability scripts, CPython and Pyodide harnesses) is user-owned and retained. `.scratch/challenges.json` was explicitly removed per request.

## Pending decisions for the owner

- Which dormant features are in scope (credits, cutscenes, tutorial, skill tree, achievements, inventory) versus to be removed.
- Single narrative source: `engine/narrative/storyContent.ts` or `narrative/dialogs` plus `dialog.json`.
- Whether a no-WASM fallback (`MiniPythonEvaluator`) has a real requirement.
- Canonical floor/chapter table (12 floors with chapters 1 and 2 sharing the lobby, or one chapter per floor).

## Next steps

- Commit the verified changes to `main` and push to `origin/main`.
