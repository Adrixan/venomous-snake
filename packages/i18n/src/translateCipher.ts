import i18n from './i18n';

/**
 * Looks up a raw CIPHER line in the active language. Placeholders stay in, because CIPHER
 * fills them itself in one pass: text from player names or tracebacks is never expanded.
 */
export function translateCipher(key: string): unknown {
  return i18n.t(key, { ns: 'cipher', returnObjects: true, skipInterpolation: true });
}
