import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig, EventBus } from '@venomous-snake/engine';
import { useGameStore } from '../store/gameStore';

export function GameCanvas(): React.JSX.Element {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPaused = useGameStore((state) => state.isPaused);
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setPlayerDirection = useGameStore((state) => state.setPlayerDirection);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config = createGameConfig(containerRef.current);
    gameRef.current = new Phaser.Game(config);

    const unsubscribe = EventBus.on((event) => {
      if (event.type === 'PLAYER_MOVE') {
        setPlayerPosition(event.payload.x, event.payload.y);
        setPlayerDirection(event.payload.direction);
      }
    });

    return () => {
      unsubscribe();
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [setPlayerPosition, setPlayerDirection]);

  useEffect(() => {
    if (isPaused) {
      EventBus.emit({ type: 'GAME_PAUSE' });
    } else {
      EventBus.emit({ type: 'GAME_RESUME' });
    }
  }, [isPaused]);

  return (
    <div
      ref={containerRef}
      aria-label="Game world view"
      role="application"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
}
