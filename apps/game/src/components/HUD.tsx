import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/gameStore';

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";

export function HUD(): React.JSX.Element {
  const { t } = useTranslation('ui');
  const player = useGameStore((state) => state.player);
  const interactionPrompt = useGameStore((state) => state.interactionPrompt);
  const level = useGameStore((state) => state.level);
  const xp = useGameStore((state) => state.xp);
  const currentFloor = useGameStore((state) => state.currentFloor);
  const setActivePanel = useGameStore((state) => state.setActivePanel);

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    fontFamily: FONT_FAMILY,
    color: '#00ff9d',
    zIndex: 10,
  };

  const topBarStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    fontSize: '12px',
    opacity: 0.85,
  };

  const hudButtonStyle: React.CSSProperties = {
    minWidth: '44px',
    minHeight: '44px',
    padding: '6px 10px',
    background: 'rgba(10, 10, 15, 0.8)',
    border: '1px solid #333',
    color: '#e0e0e0',
    fontFamily: FONT_FAMILY,
    fontSize: '12px',
    cursor: 'pointer',
    pointerEvents: 'auto',
  };

  const bottomRightStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    display: 'flex',
    gap: '6px',
    pointerEvents: 'auto',
  };

  const hudButtons: { label: string; panel: 'inventory' | 'questlog' | 'map' | 'settings' }[] = [
    { label: '📦', panel: 'inventory' },
    { label: '📋', panel: 'questlog' },
    { label: '🗺', panel: 'map' },
    { label: '⚙', panel: 'settings' },
  ];

  return (
    <div style={containerStyle}>
      {/* Top bar */}
      <div style={topBarStyle}>
        <div>
          {t('hud.floor').toUpperCase()}: {currentFloor.toUpperCase()} | ROOM:{' '}
          {player.currentRoom.toUpperCase()}
        </div>
        <div>
          LVL {level} | {xp} {t('hud.xp')}
        </div>
      </div>

      {/* Interaction prompt */}
      {interactionPrompt ? (
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(10, 10, 15, 0.9)',
            border: '1px solid #00ff9d',
            padding: '8px 16px',
            fontSize: '14px',
            pointerEvents: 'auto',
          }}
          role="status"
          aria-live="polite"
        >
          {interactionPrompt.promptText}
        </div>
      ) : null}

      {/* HUD buttons */}
      <div style={bottomRightStyle}>
        {hudButtons.map((btn) => (
          <button
            key={btn.panel}
            style={hudButtonStyle}
            onClick={() => setActivePanel(btn.panel)}
            aria-label={btn.panel}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
