import React from 'react';
import { useTranslation } from 'react-i18next';

export interface LocaleSwitcherProps {
  className?: string;
}

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";
const LANGUAGES = ['en', 'de'] as const;
type Language = (typeof LANGUAGES)[number];

const LABELS: Record<Language, string> = {
  en: 'EN',
  de: 'DE',
};

export function LocaleSwitcher({ className }: LocaleSwitcherProps): React.JSX.Element {
  const { i18n } = useTranslation();
  const current = (LANGUAGES.includes(i18n.language as Language) ? i18n.language : 'en') as Language;

  const switchTo = (lang: Language) => {
    void i18n.changeLanguage(lang);
  };

  return (
    <div
      className={className}
      role="group"
      aria-label="Language selector"
      style={{
        display: 'inline-flex',
        border: '1px solid #1a2a3a',
        overflow: 'hidden',
      }}
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          onClick={() => switchTo(lang)}
          aria-pressed={current === lang}
          style={{
            background: current === lang ? 'rgba(0,255,136,0.15)' : 'transparent',
            border: 'none',
            borderRight: lang !== LANGUAGES[LANGUAGES.length - 1] ? '1px solid #1a2a3a' : 'none',
            color: current === lang ? '#00ff88' : '#3d4752',
            fontFamily: FONT_FAMILY,
            fontSize: 12,
            fontWeight: current === lang ? 'bold' : 'normal',
            padding: '6px 12px',
            cursor: 'pointer',
            letterSpacing: '0.05em',
            transition: 'all 0.15s ease',
          }}
        >
          {LABELS[lang]}
        </button>
      ))}
    </div>
  );
}
