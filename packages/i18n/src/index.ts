export { default as i18n, i18nReady, warmInactiveLanguage, LANGUAGES } from './i18n';
export type { Language } from './i18n';
export { translateCipher } from './translateCipher';
// For tests only; unused in the game, so the bundler drops them from the main chunk.
export { default as cipherEn } from './locales/en/cipher.json';
export { default as cipherDe } from './locales/de/cipher.json';
