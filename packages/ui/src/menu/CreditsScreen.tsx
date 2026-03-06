import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface CreditsScreenProps {
  /** Stats gathered during the run */
  stats: {
    challengesCompleted: number;
    totalXp: number;
    /** Total play time in seconds */
    timePlayed: number;
    achievementsUnlocked: number;
    floorsCleared: number;
  };
  onNewGamePlus: () => void;
  onReturnToMenu: () => void;
}

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function CreditsScreen({
  stats,
  onNewGamePlus,
  onReturnToMenu,
}: CreditsScreenProps): React.JSX.Element {
  const { t } = useTranslation('story');
  const [scrollOffset, setScrollOffset] = useState(600);

  useEffect(() => {
    const id = setInterval(() => {
      setScrollOffset((y) => y - 0.6);
    }, 16);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        onReturnToMenu();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onReturnToMenu]);

  const statItems: { labelKey: string; value: string }[] = [
    { labelKey: 'credits.stats.challengesCompleted', value: String(stats.challengesCompleted) },
    { labelKey: 'credits.stats.totalXp', value: `${stats.totalXp.toLocaleString()} XP` },
    { labelKey: 'credits.stats.timePlayed', value: formatTime(stats.timePlayed) },
    { labelKey: 'credits.stats.achievementsUnlocked', value: String(stats.achievementsUnlocked) },
    { labelKey: 'credits.stats.floorsCleared', value: String(stats.floorsCleared) },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(180deg, #000005 0%, #0a0a1a 60%, #0d1b2a 100%)',
        fontFamily: FONT_FAMILY,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Static top: stats panel */}
      <div
        style={{
          padding: '40px 40px 0',
          flexShrink: 0,
          maxWidth: 600,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <h1
          style={{
            color: '#00e5ff',
            fontSize: 'clamp(22px, 4vw, 36px)',
            textAlign: 'center',
            margin: '0 0 6px',
            letterSpacing: '0.1em',
            textShadow: '0 0 20px rgba(0,229,255,0.5)',
          }}
        >
          {t('credits.title')}
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            fontSize: 13,
            margin: '0 0 28px',
            letterSpacing: '0.05em',
          }}
        >
          {t('credits.subtitle')}
        </p>

        {/* Stats box */}
        <div
          style={{
            background: 'rgba(0,229,255,0.04)',
            border: '1px solid rgba(0,229,255,0.2)',
            padding: '20px 24px',
            marginBottom: 28,
          }}
        >
          <h2
            style={{
              color: '#00ff88',
              fontSize: 12,
              letterSpacing: '0.12em',
              margin: '0 0 16px',
              textTransform: 'uppercase',
            }}
          >
            {t('credits.stats.heading')}
          </h2>
          {statItems.map(({ labelKey, value }) => (
            <div
              key={labelKey}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '6px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>{t(labelKey)}</span>
              <span style={{ color: '#d0d0d0', fontSize: 14, fontWeight: 700 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
          <button
            onClick={onNewGamePlus}
            style={{
              flex: 1,
              minWidth: 160,
              background: 'rgba(0,255,136,0.08)',
              border: '1px solid #00ff88',
              color: '#00ff88',
              fontFamily: FONT_FAMILY,
              fontSize: 12,
              padding: '10px 16px',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              textAlign: 'center',
            }}
          >
            ⚡ {t('credits.newGamePlus')}
          </button>
          <button
            onClick={onReturnToMenu}
            autoFocus
            style={{
              flex: 1,
              minWidth: 140,
              background: 'rgba(0,229,255,0.08)',
              border: '1px solid #00e5ff',
              color: '#00e5ff',
              fontFamily: FONT_FAMILY,
              fontSize: 12,
              padding: '10px 16px',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              textAlign: 'center',
            }}
          >
            ← {t('credits.returnToMenu')}
          </button>
        </div>
      </div>

      {/* Scrolling credits area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Fade out at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 48,
            background: 'linear-gradient(to bottom, #0a0a1a, transparent)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: `translate(-50%, ${scrollOffset}px)`,
            textAlign: 'center',
            width: '100%',
            maxWidth: 540,
            padding: '0 24px',
          }}
        >
          <div
            style={{
              color: '#00e5ff',
              fontSize: 'clamp(18px, 3.5vw, 28px)',
              fontWeight: 700,
              letterSpacing: '0.15em',
              marginBottom: 8,
              textShadow: '0 0 16px rgba(0,229,255,0.4)',
            }}
          >
            {t('credits.scrollTitle')}
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: 13,
              letterSpacing: '0.06em',
              marginBottom: 60,
            }}
          >
            {t('credits.scrollSubtitle')}
          </div>

          <div
            style={{
              color: '#00ff88',
              fontSize: 'clamp(20px, 4vw, 32px)',
              fontWeight: 700,
              letterSpacing: '0.12em',
              marginBottom: 12,
              textShadow: '0 0 20px rgba(0,255,136,0.4)',
            }}
          >
            {t('credits.thankYou')}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 80 }}>
            {t('credits.builtWith')}
          </div>

          {/* Decorative terminal block */}
          <div
            style={{
              color: 'rgba(0,229,255,0.25)',
              fontSize: 11,
              lineHeight: 1.8,
              letterSpacing: '0.05em',
            }}
          >
            <div>$ python --version</div>
            <div>Python 3.12.0</div>
            <div>&nbsp;</div>
            <div>$ ./venomous_snake --credits</div>
            <div>Mission complete. Well played.</div>
            <div>&nbsp;</div>
            <div>█</div>
          </div>
        </div>
      </div>
    </div>
  );
}
