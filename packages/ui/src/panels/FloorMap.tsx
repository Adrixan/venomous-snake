import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FLOORS } from '@venomous-snake/challenges';
import { translateText } from '../i18n/translateText';

interface FloorDefinition {
  id: string;
  name: string;
  chapterNum: number;
  floorNum: number;
}

export interface FloorMapProps {
  isOpen: boolean;
  onClose: () => void;
  currentFloor: string;
  unlockedFloors: string[];
  onFloorSelect: (floorId: string) => void;
}

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";

const floors: FloorDefinition[] = FLOORS.map((floor) => ({
  id: floor.id,
  name: `story.floors.${String(floor.number)}.name`,
  chapterNum: floor.chapterId,
  floorNum: floor.number + 1,
}));

// Display bottom-to-top
const floorsReversed = [...floors].reverse();

export function FloorMap({
  isOpen,
  onClose,
  currentFloor,
  unlockedFloors,
  onFloorSelect,
}: FloorMapProps): React.JSX.Element {
  const { t } = useTranslation(['ui', 'story']);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    },
    [isOpen, onClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    width: '380px',
    maxWidth: '100vw',
    background: '#0d1117',
    borderLeft: '1px solid #00ff9d',
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease',
    zIndex: 300,
    fontFamily: FONT_FAMILY,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #333',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: '#e0e0e0',
    fontSize: '20px',
    cursor: 'pointer',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <h2 style={{ color: '#00ff9d', fontSize: '16px', margin: 0 }}>{t('floor_map.title')}</h2>
        <button style={closeButtonStyle} onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
        {floorsReversed.map((floor) => {
          const isCurrent = floor.id === currentFloor;
          const isUnlocked = unlockedFloors.includes(floor.id);
          const isLocked = !isUnlocked;

          const floorStyle: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            margin: '3px 0',
            background: isCurrent ? '#00ff9d11' : 'transparent',
            border: isCurrent ? '1px solid #00ff9d' : '1px solid #222',
            borderRadius: '2px',
            opacity: isLocked ? 0.4 : 1,
            cursor: isUnlocked && !isCurrent ? 'pointer' : 'default',
            transition: 'all 0.15s ease',
          };

          return (
            <div
              key={floor.id}
              style={floorStyle}
              onClick={() => {
                if (isUnlocked && !isCurrent) {
                  onFloorSelect(floor.id);
                }
              }}
            >
              <div>
                <div
                  style={{
                    color: isCurrent ? '#00ff9d' : isLocked ? '#666' : '#e0e0e0',
                    fontSize: '13px',
                    fontWeight: isCurrent ? 'bold' : 'normal',
                  }}
                >
                  {isLocked ? '🔒 ' : ''}
                  {translateText(t, floor.name)}
                </div>
                <div style={{ color: '#666', fontSize: '10px', marginTop: '2px' }}>
                  {t('floor_map.floor', { num: floor.floorNum })} · Ch.{floor.chapterNum}
                </div>
              </div>
              <div>
                {isCurrent && (
                  <span style={{ color: '#00ff9d', fontSize: '11px', whiteSpace: 'nowrap' }}>
                    ◄ {t('floor_map.current').toUpperCase()}
                  </span>
                )}
                {isLocked && (
                  <span style={{ color: '#666', fontSize: '11px' }}>{t('floor_map.locked')}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
