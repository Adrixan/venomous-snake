import { describe, expect, it } from 'vitest';
import en from '../locales/en';
import de from '../locales/de';

/** Lists every string leaf of a resource by its key path. */
function leafKeys(node: unknown, path = ''): string[] {
  if (typeof node === 'string') return [path];
  if (typeof node !== 'object' || node === null) return [];
  return Object.entries(node).flatMap(([key, value]) =>
    leafKeys(value, path === '' ? key : `${path}.${key}`),
  );
}

// German runs without an English fallback (`i18n.ts`), so every English string needs German.
describe('German locale parity', () => {
  it.each(Object.keys(en))('has every English key of %s', (namespace) => {
    const german = new Set(leafKeys(de[namespace as keyof typeof de]));
    const missing = leafKeys(en[namespace as keyof typeof en]).filter((key) => !german.has(key));
    expect(missing).toEqual([]);
  });
});
