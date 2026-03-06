import React, { useRef, useEffect, useCallback } from 'react';
import { MockInterpreter } from '@venomous-snake/python-runtime';
import { HackingTerminal } from '@venomous-snake/ui';
import { useGameStore } from '../store/gameStore';
import { EventBus } from '@venomous-snake/engine';

export const TerminalOverlay = React.memo(function TerminalOverlay(): React.JSX.Element | null {
  const terminalOpen = useGameStore((s) => s.overlay.terminalOpen);
  const closeTerminal = useGameStore((s) => s.closeTerminal);
  const addXp = useGameStore((s) => s.addXp);
  const currentChallengeId = useGameStore((s) => s.currentChallengeId);
  const interpreterRef = useRef<MockInterpreter | null>(null);

  if (!interpreterRef.current) {
    interpreterRef.current = new MockInterpreter();
  }

  useEffect(() => {
    return () => {
      interpreterRef.current?.terminate().catch(() => undefined);
    };
  }, []);

  const handleClose = useCallback((): void => {
    closeTerminal();
    EventBus.emit({ type: 'TERMINAL_CLOSE' });
  }, [closeTerminal]);

  const handleChallengeSuccess = useCallback(
    (_challengeId: string, xpEarned: number): void => {
      addXp(xpEarned);
      // Auto-close is handled by ChallengeSuccessOverlay after 3 s;
      // also close store state now so the overlay unmounts after the animation.
      setTimeout(() => {
        closeTerminal();
        EventBus.emit({ type: 'TERMINAL_CLOSE' });
      }, 3200);
    },
    [addXp, closeTerminal],
  );

  if (!terminalOpen) return null;

  return (
    <div className="terminal-overlay" role="dialog" aria-modal="true" aria-label="Hacking Terminal">
      {currentChallengeId !== null ? (
        <HackingTerminal
          challengeId={currentChallengeId}
          onClose={handleClose}
          onChallengeSuccess={handleChallengeSuccess}
        />
      ) : (
        <HackingTerminal
          interpreter={interpreterRef.current}
          onClose={handleClose}
          initialCode={'# Write your Python code here\n'}
        />
      )}
    </div>
  );
});
