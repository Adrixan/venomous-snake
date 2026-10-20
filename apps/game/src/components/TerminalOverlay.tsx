import React, { useEffect, useCallback, useState } from 'react';
import { getSharedInterpreter, initializeSharedInterpreter } from '@venomous-snake/python-runtime';
import { HackingTerminal, TerminalBootSequence } from '@venomous-snake/ui';
import { useGameStore } from '../store/gameStore';
import { EventBus } from '@venomous-snake/engine';

export const TerminalOverlay = React.memo(function TerminalOverlay(): React.JSX.Element | null {
  const terminalOpen = useGameStore((s) => s.overlay.terminalOpen);
  const closeTerminal = useGameStore((s) => s.closeTerminal);
  const currentChallengeId = useGameStore((s) => s.currentChallengeId);
  const [bootDone, setBootDone] = useState(false);

  // Start Pyodide initialization eagerly when the terminal opens
  useEffect(() => {
    if (terminalOpen) {
      initializeSharedInterpreter().catch(() => undefined);
    }
  }, [terminalOpen]);

  useEffect(() => {
    return () => {
      // Don't terminate the shared interpreter — other components may use it
    };
  }, []);

  const handleClose = useCallback((): void => {
    closeTerminal();
    EventBus.emit({ type: 'TERMINAL_CLOSE' });
  }, [closeTerminal]);

  const handleChallengeSuccess = useCallback(
    (_challengeId: string, _xpEarned: number): void => {
      // The GameController session owns XP, achievements, and completion events.
      // This callback only closes the presentation overlay after the success animation.
      // Auto-close is handled by ChallengeSuccessOverlay after 3 s;
      // also close store state now so the overlay unmounts after the animation.
      setTimeout(() => {
        closeTerminal();
        EventBus.emit({ type: 'TERMINAL_CLOSE' });
      }, 3200);
    },
    [closeTerminal],
  );

  if (!terminalOpen) return null;

  return (
    <div className="terminal-overlay" role="dialog" aria-modal="true" aria-label="Hacking Terminal">
      {/* Boot sequence shown on first open each session */}
      {!bootDone && <TerminalBootSequence onComplete={() => setBootDone(true)} />}

      {/* Actual terminal — rendered beneath boot sequence then revealed */}
      {bootDone &&
        (currentChallengeId !== null ? (
          <HackingTerminal
            challengeId={currentChallengeId}
            onClose={handleClose}
            onChallengeSuccess={handleChallengeSuccess}
          />
        ) : (
          <HackingTerminal
            interpreter={getSharedInterpreter()}
            onClose={handleClose}
            initialCode={'# Write your Python code here\n'}
          />
        ))}
    </div>
  );
});
