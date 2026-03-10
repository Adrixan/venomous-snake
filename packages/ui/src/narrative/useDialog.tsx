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
import type { DialogNode, DialogChoice, ChoiceWithState } from '@venomous-snake/narrative';
import { EventBus } from '@venomous-snake/engine';

export interface UseDialogOptions {
  /**
   * The player's current inventory (item IDs). Passed to the dialog engine so
   * it can gate choices that require specific items.
   */
  inventory?: string[];
  /**
   * Called whenever the dialog engine sets a flag whose ID starts with
   * `raise_alert_`. Use this to increment the game-level alert state.
   */
  onAlertRaised?: () => void;
}

export interface UseDialogReturn {
  isOpen: boolean;
  currentNode: DialogNode | null;
  availableChoices: DialogChoice[];
  /**
   * All choices for the current node that pass narrative conditions, annotated
   * with availability. Inventory-locked choices are included but marked
   * `available: false` so the UI can render them grayed-out with a tooltip.
   */
  displayChoices: ChoiceWithState[];
  /** Advance to the next linear node (no-op when choices are present). */
  advance: () => void;
  /** Select an available choice by its index in `availableChoices`. */
  selectChoice: (index: number) => void;
}

/**
 * Manages NPC dialog state driven by the EventBus `DIALOG_START` event.
 *
 * Usage: mount once at the app root; DialogOverlay consumes its return value.
 *
 * @param options.inventory  Current player inventory (item IDs). When provided,
 *   the engine filters choices that require items not in the inventory, showing
 *   them as locked in the UI instead.
 * @param options.onAlertRaised  Called whenever a `raise_alert_*` flag is set
 *   during dialog, so the caller can increment the game-level alert counter.
 */
export function useDialog(options: UseDialogOptions = {}): UseDialogReturn {
  const { inventory, onAlertRaised } = options;
  const engineRef = useRef<DialogEngine | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [currentNode, setCurrentNode] = useState<DialogNode | null>(null);
  const [availableChoices, setAvailableChoices] = useState<DialogChoice[]>([]);
  const [displayChoices, setDisplayChoices] = useState<ChoiceWithState[]>([]);

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
        setDisplayChoices([]);
      } else if (event.type === 'choices_available') {
        setAvailableChoices(event.choices);
        // Compute annotated display choices (includes inventory-locked ones)
        const display = engineRef.current?.getDisplayChoices() ?? [];
        setDisplayChoices(display);
      } else if (event.type === 'flag_set') {
        // Any flag starting with 'raise_alert_' triggers the alert callback and
        // also marks the engine-level 'alert_active' flag for condition checks.
        if (event.flagId.startsWith('raise_alert_')) {
          onAlertRaised?.();
          engineRef.current?.setFlag('alert_active', true);
        }
      } else if (event.type === 'dialog_complete') {
        setIsOpen(false);
        setCurrentNode(null);
        setAvailableChoices([]);
        setDisplayChoices([]);
        EventBus.emit({ type: 'DIALOG_END' });
      }
    });
  }, [onAlertRaised]);

  // Keep the engine's inventory snapshot in sync with the caller's inventory.
  useEffect(() => {
    engineRef.current?.setInventory(inventory ?? []);
  }, [inventory]);

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
        // Emit DIALOG_END so GameScene unfreezes the player
        EventBus.emit({ type: 'DIALOG_END' });
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

  return { isOpen, currentNode, availableChoices, displayChoices, advance, selectChoice };
}
