import type { TFunction } from 'i18next';
import type { TextParams } from '@venomous-snake/shared-types';

/** Resolve namespace-prefixed domain keys and translated interpolation values. */
export function translateText(t: TFunction, key: string, params?: TextParams): string {
  const options: Record<string, string | number> = {};
  for (const [name, value] of Object.entries(params ?? {})) {
    options[name.replace(/Key$/, '')] =
      name.endsWith('Key') && typeof value === 'string' ? translateText(t, value) : value;
  }
  const separator = key.indexOf('.');
  const qualified = separator < 0 ? key : `${key.slice(0, separator)}:${key.slice(separator + 1)}`;
  return t(qualified, options);
}
