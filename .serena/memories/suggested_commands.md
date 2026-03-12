# Suggested Commands

## Development
- `pnpm dev` or `nx serve game` — Start the game dev server
- `pnpm build` or `nx build game` — Build the game app
- Alternative: `cd apps/game && npx vite build` — Direct Vite build (avoids NX issues)

## Testing
- `pnpm test` or `nx run-many --target=test --all` — Run all tests
- `nx test <project>` — Run tests for a specific package (e.g., `nx test engine`)
- `npx vitest run <path>` — Run a specific test file directly

## Type Checking
- `pnpm type-check` or `nx run-many --target=type-check --all` — Check all projects
- `nx run <project>:type-check` — Check a specific package
- `npx tsc --noEmit -p <path>/tsconfig.json` — Direct tsc check

## Linting & Formatting
- `pnpm lint` or `nx run-many --target=lint --all` — Lint all projects
- `nx lint <project>` — Lint a specific package
- `pnpm format` — Check formatting (Prettier)
- `pnpm format:fix` — Auto-fix formatting

## Challenge Validation
- `npx vitest run packages/python-runtime/src/__tests__/challenge_validation.test.ts` — Validate all 216 challenge test cases

## Git
- Uses Husky for git hooks + lint-staged (auto-formats and lints staged files on commit)
- System: Linux — standard Unix commands available (git, ls, cd, grep, find, etc.)

## NX-specific
- `nx graph` — Visualize project dependency graph
- `nx affected --target=test` — Run tests only for affected projects
