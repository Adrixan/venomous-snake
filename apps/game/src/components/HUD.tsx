import React from 'react';
import { useGameStore } from '../store/gameStore';

export function HUD(): React.JSX.Element {
  const player = useGameStore((state) => state.player);
  const interactionPrompt = useGameStore((state) => state.interactionPrompt);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        pointerEvents: 'none',
        padding: '12px',
        fontFamily: 'monospace',
        color: '#00ff9d',
        zIndex: 10,
      }}
    >
      <div style={{ fontSize: '12px', opacity: 0.7 }}>
        ROOM: {player.currentRoom.toUpperCase()} | POS: {Math.round(player.x)},{Math.round(player.y)}
      </div>

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
    </div>
  );
}
