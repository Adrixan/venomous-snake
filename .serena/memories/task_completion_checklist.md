# Task Completion Checklist

After completing a task, run these checks:

1. **Type-check** the affected packages:
   - `nx run <project>:type-check` for specific packages
   - Or `npx tsc --noEmit -p <path>/tsconfig.json` directly
   - Note: `python-runtime` has pre-existing rootDir issues; ignore MiniPythonEvaluator errors when type-checking `game`

2. **Lint** the affected code:
   - `nx lint <project>` for specific packages

3. **Run tests** for affected packages:
   - `nx test <project>` for specific packages
   - For challenge changes: `npx vitest run packages/python-runtime/src/__tests__/challenge_validation.test.ts`

4. **Format check** (optional, Husky handles on commit):
   - `pnpm format` to check
   - `pnpm format:fix` to auto-fix

5. **Build** if structural changes were made:
   - `cd apps/game && npx vite build` (preferred over NX build to avoid python-runtime rootDir issue)
