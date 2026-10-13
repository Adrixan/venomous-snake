import path from 'node:path';

const PACKAGES = [
  'engine',
  'ui',
  'python-runtime',
  'challenge-engine',
  'challenges',
  'narrative',
  'audio',
  'i18n',
  'save-system',
  'shared-types',
] as const;

/** Maps `@venomous-snake/<pkg>` to each package's TypeScript entry point. */
export function workspaceAliases(root: string): Record<string, string> {
  return Object.fromEntries(
    PACKAGES.map((pkg) => [
      `@venomous-snake/${pkg}`,
      path.resolve(root, `packages/${pkg}/src/index.ts`),
    ]),
  );
}
