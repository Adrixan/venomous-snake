import React, { useEffect, useState } from 'react';
import {
  getFloorConfig,
  getFloorProgress,
  getFloorNumberFromId,
} from '@venomous-snake/challenge-engine';

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";

export interface FloorProgressBarProps {
  /** Current floor ID string from the store (e.g. 'lobby', 'floor_3'). */
  floorId: string;
  /** Array of completed challenge IDs from the store. */
  completedChallenges: string[];
  /** Whether to suppress animations (accessibility / reduced motion). */
  reducedMotion?: boolean;
}

/**
 * HUD component showing the current floor name and challenge completion progress.
 * Glows green when the floor is fully complete.
 */
export function FloorProgressBar({
  floorId,
  completedChallenges,
  reducedMotion = false,
}: FloorProgressBarProps): React.JSX.Element {
  const floorNumber = getFloorNumberFromId(floorId);
  const config = getFloorConfig(floorNumber);
  const { completed, total, percentage } = getFloorProgress(floorNumber, completedChallenges);
  const isComplete = completed >= total && total > 0;

  const [isGlowing, setIsGlowing] = useState(false);
  const prevCompletedRef = React.useRef(completed);

  useEffect(() => {
    if (completed > prevCompletedRef.current && !reducedMotion) {
      setIsGlowing(true);
      const timer = setTimeout(() => setIsGlowing(false), 1200);
      prevCompletedRef.current = completed;
      return () => clearTimeout(timer);
    }
    prevCompletedRef.current = completed;
    return undefined;
  }, [completed, reducedMotion]);

  const floorName = config?.name ?? floorId;

  const containerStyle: React.CSSProperties = {
    fontFamily: FONT_FAMILY,
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    minWidth: '180px',
  };

  const headerRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '8px',
  };

  const floorNameStyle: React.CSSProperties = {
    color: isComplete ? '#00ff9d' : '#e0e0e0',
    fontSize: '11px',
    fontWeight: isComplete ? 'bold' : 'normal',
    letterSpacing: '0.5px',
    textShadow: isComplete && !reducedMotion ? '0 0 8px #00ff9d' : 'none',
    transition: reducedMotion ? 'none' : 'color 0.4s ease, text-shadow 0.4s ease',
  };

  const countStyle: React.CSSProperties = {
    color: isComplete ? '#00ff9d' : '#ffb454',
    fontSize: '10px',
    whiteSpace: 'nowrap',
  };

  const trackStyle: React.CSSProperties = {
    height: '5px',
    background: '#1a1a2e',
    borderRadius: '3px',
    overflow: 'hidden',
    border: `1px solid ${isComplete ? '#00ff9d44' : '#222'}`,
    position: 'relative',
    transition: reducedMotion ? 'none' : 'border-color 0.4s ease',
  };

  const fillStyle: React.CSSProperties = {
    height: '100%',
    width: `${percentage}%`,
    background: isGlowing ? '#fff' : isComplete ? '#00ff9d' : '#00b4d8',
    borderRadius: '3px',
    transition: reducedMotion
      ? 'none'
      : 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease',
    boxShadow: isGlowing ? '0 0 10px #00ff9d' : isComplete ? '0 0 6px #00ff9d66' : 'none',
  };

  const label = `Floor: ${floorName} — ${completed}/${total} challenges`;

  return (
    <div
      style={containerStyle}
      aria-label={label}
      title={isComplete ? 'Floor complete! Use the elevator to proceed.' : label}
    >
      <div style={headerRowStyle}>
        <span style={floorNameStyle}>
          {isComplete ? '✓ ' : ''}
          {floorName.toUpperCase()}
        </span>
        <span style={countStyle}>
          {completed}/{total}
        </span>
      </div>
      <div
        style={trackStyle}
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${completed} of ${total} challenges completed`}
      >
        <div style={fillStyle} />
      </div>
    </div>
  );
}
