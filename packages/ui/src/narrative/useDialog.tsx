import { useState, useEffect, useCallback, useRef } from 'react';
import {
  DialogEngine,
  lobbyGuardDialog,
  drSilvaDialog,
  cipherIntroDialog,
  techKaiDialog,
  sysAdminReevesDialog,
  researcherPatelDialog,
  labBotDialog,
  operatorVossDialog,
  analystChenDialog,
  archivistOkaforDialog,
  internJamieDialog,
  commOfficerDiazDialog,
  hackerEchoDialog,
  secretaryKimDialog,
  execBlackwellDialog,
  engineerKowalskiDialog,
  qaBotDelta7Dialog,
  drVolkovDialog,
  aiFragmentDialog,
  coreGuardianDialog,
  ghostInMachineDialog,
  butlerSterlingDialog,
  rivalAgentNovaDialog,
  venomousSnakeDialog,
} from '@venomous-snake/narrative';
import type { DialogNode, DialogChoice } from '@venomous-snake/narrative';
import { EventBus } from '@venomous-snake/engine';

export interface UseDialogReturn {
  isOpen: boolean;
  currentNode: DialogNode | null;
  availableChoices: DialogChoice[];
  /** Advance to the next linear node (no-op when choices are present). */
  advance: () => void;
  selectChoice: (index: number) => void;
}

/**
 * Manages NPC dialog state driven by the EventBus `DIALOG_START` event.
 *
 * Usage: mount once at the app root; DialogOverlay consumes its return value.
 */
export function useDialog(): UseDialogReturn {
  const engineRef = useRef<DialogEngine | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [currentNode, setCurrentNode] = useState<DialogNode | null>(null);
  const [availableChoices, setAvailableChoices] = useState<DialogChoice[]>([]);

  // Initialise the engine once and register all known dialog trees.
  if (engineRef.current === null) {
    const engine = new DialogEngine();
    engine.registerDialog(lobbyGuardDialog);
    engine.registerDialog(drSilvaDialog);
    engine.registerDialog(cipherIntroDialog);
    engine.registerDialog(techKaiDialog);
    engine.registerDialog(sysAdminReevesDialog);
    engine.registerDialog(researcherPatelDialog);
    engine.registerDialog(labBotDialog);
    engine.registerDialog(operatorVossDialog);
    engine.registerDialog(analystChenDialog);
    engine.registerDialog(archivistOkaforDialog);
    engine.registerDialog(internJamieDialog);
    engine.registerDialog(commOfficerDiazDialog);
    engine.registerDialog(hackerEchoDialog);
    engine.registerDialog(secretaryKimDialog);
    engine.registerDialog(execBlackwellDialog);
    engine.registerDialog(engineerKowalskiDialog);
    engine.registerDialog(qaBotDelta7Dialog);
    engine.registerDialog(drVolkovDialog);
    engine.registerDialog(aiFragmentDialog);
    engine.registerDialog(coreGuardianDialog);
    engine.registerDialog(ghostInMachineDialog);
    engine.registerDialog(butlerSterlingDialog);
    engine.registerDialog(rivalAgentNovaDialog);
    engine.registerDialog(venomousSnakeDialog);
    engineRef.current = engine;
  }

  // Subscribe to DialogEngine events.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    return engine.onEvent((event) => {
      if (event.type === 'node_display') {
        setCurrentNode(event.node);
        setAvailableChoices([]);
      } else if (event.type === 'choices_available') {
        setAvailableChoices(event.choices);
      } else if (event.type === 'dialog_complete') {
        setIsOpen(false);
        setCurrentNode(null);
        setAvailableChoices([]);
        EventBus.emit({ type: 'DIALOG_END' });
      }
    });
  }, []);

  // Listen for DIALOG_START on the global EventBus.
  useEffect(() => {
    return EventBus.on((event) => {
      if (event.type !== 'DIALOG_START') return;
      const { dialogId } = event.payload;
      if (!dialogId) return;
      const engine = engineRef.current;
      if (!engine) return;
      try {
        engine.startDialog(dialogId);
        setIsOpen(true);
      } catch (err) {
        console.warn('[useDialog] Failed to start dialog:', dialogId, err);
      }
    });
  }, []);

  const advance = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.advanceToNext();
  }, []);

  const selectChoice = useCallback((index: number) => {
    const engine = engineRef.current;
    if (!engine) return;
    try {
      engine.selectChoice(index);
    } catch (err) {
      console.warn('[useDialog] selectChoice error:', err);
    }
  }, []);

  return { isOpen, currentNode, availableChoices, advance, selectChoice };
}
