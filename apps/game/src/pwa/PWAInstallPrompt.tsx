import React, { useState, useEffect } from 'react';
import { usePWA } from './usePWA';

const SESSION_KEY = 'pwa-install-dismissed';

const styles: Record<string, React.CSSProperties> = {
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    background: 'linear-gradient(90deg, #0a0e14 0%, #0d1a2a 100%)',
    borderTop: '1px solid #00ff9d',
    boxShadow: '0 -4px 20px rgba(0, 255, 157, 0.15)',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    color: '#b3b1ad',
    fontSize: '13px',
    gap: '12px',
  },
  icon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  text: {
    flex: 1,
    lineHeight: 1.4,
  },
  title: {
    color: '#00ff9d',
    fontWeight: 'bold',
    display: 'block',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  installBtn: {
    background: '#00ff9d',
    color: '#0a0e14',
    border: 'none',
    padding: '6px 14px',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    letterSpacing: '0.05em',
  },
  dismissBtn: {
    background: 'transparent',
    color: '#5c6773',
    border: '1px solid #1a2a3a',
    padding: '6px 10px',
    fontFamily: 'inherit',
    fontSize: '12px',
    cursor: 'pointer',
  },
};

export function PWAInstallPrompt(): React.JSX.Element | null {
  const { isInstallable, isInstalled, install } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      setDismissed(true);
    }
  }, []);

  if (!isInstallable || isInstalled || dismissed) return null;

  const handleInstall = async () => {
    setInstalling(true);
    try {
      await install();
    } finally {
      setInstalling(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setDismissed(true);
  };

  return (
    <div style={styles['banner']} role="complementary" aria-label="Install app banner">
      <span style={styles['icon']} aria-hidden="true">
        ⬇
      </span>
      <div style={styles['text']}>
        <span style={styles['title']}>Install Venomous Snake</span>
        <span>Play offline, faster load times</span>
      </div>
      <div style={styles['actions']}>
        <button
          style={styles['installBtn']}
          onClick={() => void handleInstall()}
          disabled={installing}
          aria-label="Install app"
        >
          {installing ? 'INSTALLING...' : 'INSTALL'}
        </button>
        <button
          style={styles['dismissBtn']}
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
