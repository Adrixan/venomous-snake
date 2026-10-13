# Session handoff

Date: 2026-10-13

## Intent

Understand the Venomous Snake application, find bugs and unnecessary complexity, propose steps to reach production quality.

## State

Review complete, no source files changed. Full findings: `.agents/production-readiness-review.md` (P0 to P2 with file:line evidence and a recommended order).

Untracked helper material in `.scratch/` (consistency, closure and reachability scripts, CPython and Pyodide harnesses). `.scratch/` is not in `.gitignore`.

## Pending decisions for the owner

- Which dormant features are in scope (credits, cutscenes, tutorial, skill tree, achievements, inventory) versus to be removed.
- Single narrative source: `engine/narrative/storyContent.ts` or `narrative/dialogs` plus `dialog.json`.
- Whether a no-WASM fallback (`MiniPythonEvaluator`) has a real requirement.
- Canonical floor/chapter table (12 floors with chapters 1 and 2 sharing the lobby, or one chapter per floor).

## Next steps

- Add a Pyodide-based challenge validation job (solutions pass, scaffolds fail, hidden tests differ from visible tests).
- Fix input echo and multi-line input splitting.
- Move Python execution to a Web Worker with terminate-on-timeout; self-host the Pyodide runtime.
- Unify progression through `GameController` and introduce a single save snapshot with a round-trip test.
