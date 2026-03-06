import React, { useRef, useEffect } from 'react';
import { MockInterpreter } from '@venomous-snake/python-runtime';
import { HackingTerminal } from '@venomous-snake/ui';
import { useGameStore } from '../store/gameStore';
import { EventBus } from '@venomous-snake/engine';

export const TerminalOverlay = React.memo(function TerminalOverlay(): React.JSX.Element | null {
  const terminalOpen = useGameStore((s) => s.overlay.terminalOpen);
  const closeTerminal = useGameStore((s) => s.closeTerminal);
  const interpreterRef = useRef<MockInterpreter | null>(null);

  if (!interpreterRef.current) {
    interpreterRef.current = new MockInterpreter();
  }

  useEffect(() => {
    return () => {
      interpreterRef.current?.terminate().catch(() => undefined);
    };
  }, []);

  if (!terminalOpen) return null;

  const handleClose = (): void => {
    closeTerminal();
    EventBus.emit({ type: 'TERMINAL_CLOSE' });
  };

  return (
    <div className="terminal-overlay" role="dialog" aria-modal="true" aria-label="Hacking Terminal">
      <HackingTerminal
        interpreter={interpreterRef.current}
        onClose={handleClose}
        initialCode={'# Write your Python code here\n'}
      />
    </div>
  );
});
