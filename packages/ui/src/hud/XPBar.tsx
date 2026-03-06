import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { XPSystem, LEVEL_THRESHOLDS } from '@venomous-snake/challenge-engine';

export interface XPBarProps {
  xp: number;
  level: number;
  title: string;
  reducedMotion?: boolean;
}

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";
const xpSystem = new XPSystem();

export function XPBar({ xp, level, title, reducedMotion = false }: XPBarProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const prevXpRef = useRef(xp);
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    if (xp > prevXpRef.current && !reducedMotion) {
      setIsGlowing(true);
      const timer = setTimeout(() => setIsGlowing(false), 1200);
      prevXpRef.current = xp;
      return () => clearTimeout(timer);
    }
    prevXpRef.current = xp;
    return undefined;
  }, [xp, reducedMotion]);

  const progress = xpSystem.getProgressToNextLevel(xp);
  const isMaxLevel = level >= (LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]?.level ?? 10);

  const containerStyle: React.CSSProperties = {
    fontFamily: FONT_FAMILY,
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    minWidth: '180px',
  };

  const topRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '8px',
  };

  const trackStyle: React.CSSProperties = {
    height: '6px',
    background: '#1a1a2e',
    borderRadius: '3px',
    overflow: 'hidden',
    border: '1px solid #222',
    position: 'relative',
  };

  const fillStyle: React.CSSProperties = {
    height: '100%',
    width: `${progress.percentage}%`,
    background: isGlowing ? '#fff' : '#00ff9d',
    borderRadius: '3px',
    transition: reducedMotion
      ? 'none'
      : 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease',
    boxShadow: isGlowing ? '0 0 12px #00ff9d' : 'none',
  };

  const xpText = isMaxLevel
    ? t('hud.max_level')
    : `${progress.current} / ${progress.needed} ${t('hud.xp')}`;

  return (
    <div style={containerStyle} aria-label={`${t('hud.level')} ${level}: ${title}`}>
      <div style={topRowStyle}>
        <span
          style={{
            color: '#00ff9d',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
          }}
        >
          {t('hud.level')} {level}
        </span>
        <span
          style={{
            color: '#ffb454',
            fontSize: '10px',
            maxWidth: '110px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={title}
        >
          {title}
        </span>
      </div>
      <div
        style={trackStyle}
        role="progressbar"
        aria-valuenow={progress.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div style={fillStyle} />
      </div>
      <div style={{ color: '#555', fontSize: '9px', textAlign: 'right' }}>{xpText}</div>
    </div>
  );
}
