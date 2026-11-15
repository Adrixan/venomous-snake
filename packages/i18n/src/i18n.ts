import i18n from 'i18next';
import type { BackendModule, ReadCallback, ResourceKey } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const LANGUAGES = ['en', 'de'] as const;
export type Language = (typeof LANGUAGES)[number];

type Bundle = Record<string, ResourceKey>;

// Each language is its own chunk: the player downloads and parses only the one in use first.
const LOADERS: Record<Language, () => Promise<{ default: Bundle }>> = {
  en: () => import('./locales/en'),
  de: () => import('./locales/de'),
};

const bundles = new Map<Language, Promise<Bundle>>();

function isLanguage(code: string): code is Language {
  return (LANGUAGES as readonly string[]).includes(code);
}

/** Loads a language bundle once; a failed load is forgotten so a later attempt can retry. */
export function loadBundle(language: Language): Promise<Bundle> {
  let bundle = bundles.get(language);
  if (bundle === undefined) {
    bundle = LOADERS[language]().then((module) => module.default);
    bundle.catch(() => bundles.delete(language));
    bundles.set(language, bundle);
  }
  return bundle;
}

const lazyLocales: BackendModule = {
  type: 'backend',
  init: () => undefined,
  read(language: string, namespace: string, callback: ReadCallback) {
    const code = language.split('-')[0] ?? language;
    if (!isLanguage(code)) {
      callback(null, {});
      return;
    }
    loadBundle(code).then(
      (bundle) => callback(null, bundle[namespace] ?? {}),
      (error: unknown) => callback(error instanceof Error ? error : new Error(String(error)), null),
    );
  },
};

// Screen readers pick their voice from the document language.
i18n.on('languageChanged', (language) => {
  if (typeof document !== 'undefined') document.documentElement.lang = language;
});

/** Resolves once the active language is loaded; render after it so no raw key flashes. */
export const i18nReady = i18n
  .use(lazyLocales)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // With `languageOnly`, `de-AT` reads the `de` bundle and nothing asks for `de-AT`.
    supportedLngs: [...LANGUAGES],
    load: 'languageOnly',
    // German is complete (`parity.test.ts`), so a German player never needs the English chunk.
    // i18next also calls this without a code to pick the language for unsupported locales.
    fallbackLng: (code?: string) => (code?.startsWith('de') ? [] : ['en']),
    defaultNS: 'common',
    ns: ['common', 'ui', 'challenges', 'dialog', 'chapters', 'story', 'cipher'],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

/**
 * Fetches the other language once the browser is idle, so the switcher also works offline when
 * the service worker was installed by an older release and never precached this chunk.
 */
export function warmInactiveLanguage(): void {
  const active = i18n.resolvedLanguage;
  const idle =
    typeof requestIdleCallback === 'function'
      ? (task: () => void): void => void requestIdleCallback(task)
      : (task: () => void): void => void setTimeout(task, 2000);
  for (const language of LANGUAGES) {
    if (language !== active) idle(() => void loadBundle(language).catch(() => undefined));
  }
}

export default i18n;
