import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/gameStore';
import { FloorProgressBar, FloorAnnouncementOverlay, useReducedMotion } from '@venomous-snake/ui';
import { getFloorConfig, getFloorNumberFromId } from '@venomous-snake/challenge-engine';

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";

export function HUD(): React.JSX.Element {
  const { t } = useTranslation('ui');
  const player = useGameStore((state) => state.player);
  const interactionPrompt = useGameStore((state) => state.interactionPrompt);
  const level = useGameStore((state) => state.level);
  const xp = useGameStore((state) => state.xp);
  const currentFloor = useGameStore((state) => state.currentFloor);
  const setActivePanel = useGameStore((state) => state.setActivePanel);
  const reducedMotion = useReducedMotion();

  // Floor name entry animation
  const prevFloorRef = useRef(currentFloor);
  const [floorAnimating, setFloorAnimating] = useState(false);
  useEffect(() => {
    if (currentFloor !== prevFloorRef.current && !reducedMotion) {
      prevFloorRef.current = currentFloor;
      setFloorAnimating(true);
      const t = setTimeout(() => setFloorAnimating(false), 900);
      return () => clearTimeout(t);
    }
    prevFloorRef.current = currentFloor;
    return undefined;
  }, [currentFloor, reducedMotion]);

  // XP bar animation: track previous XP for smooth width transition
  const prevXpRef = useRef(xp);
  const [xpGain, setXpGain] = useState(false);
  useEffect(() => {
    if (xp > prevXpRef.current && !reducedMotion) {
      setXpGain(true);
      const t = setTimeout(() => setXpGain(false), 800);
      prevXpRef.current = xp;
      return () => clearTimeout(t);
    }
    prevXpRef.current = xp;
    return undefined;
  }, [xp, reducedMotion]);

  const completedChallenges = useGameStore((state) => state.completedChallenges);

  // Floor announcement overlay: show briefly when the floor changes
  const [announcementVisible, setAnnouncementVisible] = useState(false);
  const isFirstMount = useRef(true);
  const announcementFloorRef = useRef(currentFloor);

  useEffect(() => {
    // Skip the very first render so we don't show an announcement on game load
    if (isFirstMount.current) {
      isFirstMount.current = false;
      announcementFloorRef.current = currentFloor;
      return;
    }
    if (currentFloor !== announcementFloorRef.current) {
      announcementFloorRef.current = currentFloor;
      setAnnouncementVisible(true);
    }
  }, [currentFloor]);

  const handleAnnouncementDismiss = useCallback(() => {
    setAnnouncementVisible(false);
  }, []);

  const floorNumber = getFloorNumberFromId(currentFloor);
  const floorConfig = getFloorConfig(floorNumber);

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
    minWidth: '48px',
    minHeight: '48px',
    padding: '12px',
    background: 'rgba(10, 10, 15, 0.85)',
    border: '1px solid #00ff9d55',
    color: '#00ff9d',
    fontFamily: FONT_FAMILY,
    fontSize: '16px',
    cursor: 'pointer',
    pointerEvents: 'auto',
    boxShadow: '0 0 6px rgba(0,255,157,0.15)',
  };

  const bottomRightStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    display: 'flex',
    gap: '6px',
    pointerEvents: 'auto',
  };

  const floorLabelStyle: React.CSSProperties = {
    display: 'inline-block',
    transition: reducedMotion ? 'none' : 'opacity 0.4s ease, transform 0.4s ease',
    opacity: floorAnimating ? 1 : 0.85,
    transform: floorAnimating ? 'translateY(0) scale(1.05)' : 'translateY(0) scale(1)',
    color: floorAnimating ? '#fff' : '#00ff9d',
    textShadow: floorAnimating ? '0 0 12px rgba(0,255,157,0.8)' : 'none',
  };

  const xpBarWrapStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '52px',
    right: '12px',
    width: '160px',
    pointerEvents: 'none',
  };

  const xpTrackStyle: React.CSSProperties = {
    height: '4px',
    background: '#111',
    border: '1px solid #222',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '3px',
  };

  // Simple XP progress — use level-relative progress
  const XP_PER_LEVEL = 100; // placeholder
  const xpInLevel = xp % XP_PER_LEVEL;
  const xpPct = Math.round((xpInLevel / XP_PER_LEVEL) * 100);

  const xpFillStyle: React.CSSProperties = {
    height: '100%',
    width: `${xpPct}%`,
    background: xpGain ? '#fff' : '#00ff9d',
    borderRadius: '2px',
    boxShadow: xpGain ? '0 0 8px #00ff9d' : 'none',
    transition: reducedMotion
      ? 'none'
      : 'width 0.6s cubic-bezier(0.4,0,0.2,1), background 0.3s ease, box-shadow 0.3s ease',
  };

  const hudButtons: { label: string; panel: 'inventory' | 'questlog' | 'map' | 'settings' }[] = [
    { label: '📦', panel: 'inventory' },
    { label: '📋', panel: 'questlog' },
    { label: '🗺', panel: 'map' },
    { label: '⚙', panel: 'settings' },
  ];

  return (
    <>
      <div style={containerStyle}>
        {/* Top bar */}
        <div style={topBarStyle}>
          <div>
            <span style={floorLabelStyle}>
              {t('hud.floor').toUpperCase()}: {currentFloor.toUpperCase()}
            </span>
            {' | '}ROOM: {player.currentRoom.toUpperCase()}
          </div>
          <div>
            LVL {level} | {xp} {t('hud.xp')}
          </div>
        </div>

        {/* Floor progress bar — bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            left: '12px',
            pointerEvents: 'none',
          }}
        >
          <FloorProgressBar
            floorId={currentFloor}
            completedChallenges={completedChallenges}
            reducedMotion={reducedMotion}
          />
        </div>

        {/* XP bar */}
        <div style={xpBarWrapStyle} aria-hidden="true">
          <div style={{ fontSize: '9px', color: '#555', textAlign: 'right' }}>XP</div>
          <div style={xpTrackStyle}>
            <div style={xpFillStyle} />
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

      {/* Floor announcement overlay — outside the HUD container so it renders above everything */}
      <FloorAnnouncementOverlay
        floorNumber={floorNumber}
        floorName={floorConfig?.name ?? currentFloor}
        subtitle={floorConfig?.subtitle ?? ''}
        isVisible={announcementVisible}
        onDismiss={handleAnnouncementDismiss}
      />
    </>
  );
}
