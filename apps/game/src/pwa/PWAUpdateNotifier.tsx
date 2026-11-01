import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePWA } from './usePWA';

const styles: Record<string, React.CSSProperties> = {
  banner: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '8px 16px',
    background: 'linear-gradient(90deg, #0d1a2a 0%, #0a0e14 100%)',
    borderBottom: '1px solid #00b4d8',
    boxShadow: '0 4px 20px rgba(0, 180, 216, 0.15)',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    color: '#b3b1ad',
    fontSize: '13px',
    cursor: 'pointer',
  },
  icon: {
    color: '#00b4d8',
    fontSize: '16px',
  },
  label: {
    color: '#00b4d8',
    fontWeight: 'bold',
  },
  hint: {
    color: '#5c6773',
    fontSize: '11px',
  },
};

export function PWAUpdateNotifier(): React.JSX.Element | null {
  const { t } = useTranslation('ui');
  const { isUpdateAvailable, update } = usePWA();

  if (!isUpdateAvailable) return null;

  return (
    <div
      style={styles['banner']}
      role="alert"
      aria-live="polite"
      onClick={update}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') update();
      }}
      aria-label={t('pwa.update_aria')}
    >
      <span style={styles['icon']} aria-hidden="true">
        ↻
      </span>
      <span style={styles['label']}>{t('pwa.update_title')}</span>
      <span aria-hidden="true">—</span>
      <span>{t('pwa.update_action')}</span>
      <span style={styles['hint']}>{t('pwa.update_hint')}</span>
    </div>
  );
}
