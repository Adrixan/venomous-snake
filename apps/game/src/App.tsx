import React from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';

export function App(): React.JSX.Element {
  return (
    <div
      style={{
        background: '#0a0a0f',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <GameCanvas />
      <HUD />
    </div>
  );
}
