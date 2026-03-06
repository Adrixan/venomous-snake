import React, { useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { TerminalOverlay } from './components/TerminalOverlay';
import { useGameStore } from './store/gameStore';

export function App(): React.JSX.Element {
  const terminalOpen = useGameStore((state) => state.overlay.terminalOpen);
  const openTerminal = useGameStore((state) => state.openTerminal);

  // Open terminal with T key for development testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 't' && !terminalOpen) {
        openTerminal('dev-terminal');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [terminalOpen, openTerminal]);

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
      <TerminalOverlay />
    </div>
  );
}
