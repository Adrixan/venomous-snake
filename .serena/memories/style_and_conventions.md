# Code Style & Conventions

## TypeScript
- **Strict mode** enabled with `noImplicitAny`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- Target: ES2022, Module: ESNext, ModuleResolution: bundler
- Unused vars/params are errors; prefix unused params with `_`
- No `any` — `@typescript-eslint/no-explicit-any: error`

## Prettier Config
- Single quotes
- Trailing commas (all)
- Print width: 100
- Tab width: 2 (spaces)
- Semicolons: yes
- Arrow parens: always
- End of line: LF

## ESLint
- Flat config (eslint.config.mjs)
- NX module boundary enforcement enabled
- React hooks rules enforced
- Extends NX base, TypeScript, and JavaScript configs

## Naming
- Package aliases: `@venomous-snake/<package-name>` (e.g., `@venomous-snake/engine`)
- Challenge IDs: `ch##_##` format (e.g., `ch07_01`)
- Floor keys: `floor_00` format (zero-padded)
- NPC dialog tracking: `npc_{id}_line` story flags

## Important Patterns
- Challenge hints must use `tier: N as const` for TypeScript literal types
- Optional fields must be **omitted** (not set to undefined) due to `exactOptionalPropertyTypes`
- i18n keys use `:` as namespace separator (not `.`) — use `nsKey()` for conversion
- EventBus pattern for cross-component communication
- PyodideInterpreter is a shared singleton via `getSharedInterpreter()`
