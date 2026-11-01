# Review scripts

One-off audit tools from the production readiness review (`.agents/production-readiness-review.md`). They are not a workspace package and not part of `nx` or CI: run them by hand from the repository root. Reports go to `.scratch/review/`.

- Type-check: `pnpm exec tsc -p tools/review/tsconfig.json`
- `pnpm exec vitest run --config tools/review/vitest.config.ts` runs all of:
  - `consistency.test.ts`: numeric report on challenge, room, floor and achievement data (`consistency.txt`); the hard guarantees live in `packages/engine/src/__tests__/world.test.ts`, the `Achievements.test.ts` data block and the challenge validator
  - `dump.test.ts`: challenge export including solutions (`challenges.json`)
  - `pyo.test.ts`: `input()` behaviour on the real Pyodide runtime (`pyo.txt`)
- `uv run --no-project --python 3.14 python tools/review/run_py.py`: every solution and scaffold under native CPython; needs `challenges.json`. Use the Python version Pyodide ships: annotations are lazy since 3.14, so the `___` placeholders in `ch11_01` and `ch11_07` only fail on older versions.
- `reach.py`: source files missing from the production bundle. Build its input first, nothing else is written:
  - `pnpm exec vite build --config tools/review/vite.metafile.config.ts`
  - `python3 tools/review/reach.py`
- `browser-smoke.py`: title screen check against a running dev server (`pnpm dev`): `uv run tools/review/browser-smoke.py`.
