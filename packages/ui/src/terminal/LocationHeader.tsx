import React from 'react';
import { useTranslation } from 'react-i18next';

export interface LocationHeaderProps {
  floorNumber: number;
  floorName: string;
  roomName: string;
  xp: number;
  level: number;
  completedChallenges: number;
  totalChallenges: number;
}

const XP_PER_LEVEL = 100;
const BAR_SEGMENTS = 10;

function buildXpBar(xp: number): { filled: number; total: number; percent: number } {
  const xpInLevel = xp % XP_PER_LEVEL;
  const percent = Math.round((xpInLevel / XP_PER_LEVEL) * 100);
  const filled = Math.round((xpInLevel / XP_PER_LEVEL) * BAR_SEGMENTS);
  return { filled, total: BAR_SEGMENTS, percent };
}

function LocationHeaderInner({
  floorNumber,
  floorName,
  roomName,
  xp,
  level,
  completedChallenges,
  totalChallenges,
}: LocationHeaderProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const bar = buildXpBar(xp);

  return (
    <div className="story-location-header" role="banner">
      <div className="story-location-info">
        <span className="story-location-floor">
          ▸{' '}
          {t('storyTerminal.floor', `FLOOR ${String(floorNumber)}`).replace(
            '{n}',
            String(floorNumber),
          )}
          : {floorName}
        </span>
        <span className="story-location-sep">│</span>
        <span className="story-location-room">{roomName}</span>
      </div>

      <div className="story-location-stats">
        <span className="story-level-badge">Lv.{level}</span>
        <span
          className="story-xp-bar"
          aria-label={t('storyTerminal.xpProgress', `XP: ${String(bar.percent)}%`)}
        >
          <span className="story-xp-bar-track" aria-hidden="true">
            <span className="story-xp-bar-filled">{'█'.repeat(bar.filled)}</span>
            <span className="story-xp-bar-empty">{'░'.repeat(bar.total - bar.filled)}</span>
          </span>
        </span>
        <span className="story-challenge-progress">
          {completedChallenges}/{totalChallenges}
        </span>
      </div>
    </div>
  );
}

export const LocationHeader = React.memo(LocationHeaderInner);
