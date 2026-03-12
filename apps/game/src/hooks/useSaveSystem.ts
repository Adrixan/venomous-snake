import { useCallback, useEffect, useRef } from 'react';
import type React from 'react';
import { saveManager } from '@venomous-snake/save-system';
import type { SaveSlot, SaveData } from '@venomous-snake/save-system';
import { useGameStore } from '../store/gameStore';
import type { GameController } from '../GameController';
import type { CurriculumProgress } from '@venomous-snake/shared-types';
import type { NarrativeState } from '@venomous-snake/narrative';

const SAVE_VERSION = '1.0.0';

const DEFAULT_CURRICULUM: CurriculumProgress = {
  challenges: {},
  currentChapter: 1,
  totalXp: 0,
  completedChallenges: 0,
  unlockedFloors: ['lobby'],
};

function buildSaveData(
  state: ReturnType<typeof useGameStore.getState>,
  controller: GameController | null | undefined,
): SaveData {
  const curriculumProgress = controller?.getProgress() ?? DEFAULT_CURRICULUM;

  let narrativeState: NarrativeState;
  if (controller !== null && controller !== undefined) {
    narrativeState = controller.getDialogEngine().getState();
  } else {
    narrativeState = {
      flags: {},
      completedDialogs: [],
      playerName: state.playerName,
      playerGender: state.playerGender,
    };
  }

  return {
    version: SAVE_VERSION,
    timestamp: new Date().toISOString(),
    playerName: state.playerName,
    playerGender: state.playerGender,
    currentFloor: String(state.currentFloor),
    currentRoom: state.currentRoomId,
    playerPosition: { x: 0, y: 0 },
    curriculumProgress,
    narrativeState,
    inventory: [],
    settings: {
      language: 'en',
      volumeMaster: 1,
      volumeMusic: 0.8,
      volumeSfx: 1,
      fullscreen: false,
      reducedMotion: false,
    },
    playTimeMs: 0,
    xp: state.xp,
    level: state.level,
    gameCompleted: state.gameCompleted,
    storyFlags: state.storyFlags,
    visitedRooms: state.visitedRooms,
  };
}

export interface SaveSystemHook {
  /** Save to an explicit slot (generates a new ID if omitted). */
  save: (slotId?: string) => Promise<void>;
  /** Load a slot and restore store state. Returns the SaveData for callers to use. */
  load: (slotId: string) => Promise<SaveData | undefined>;
  listSaves: () => Promise<SaveSlot[]>;
  deleteSave: (slotId: string) => Promise<void>;
  exportSave: (slotId: string) => Promise<void>;
  importSave: (file: File) => Promise<SaveSlot>;
  /** Trigger an auto-save (rotates among the 3 auto-save slots). */
  triggerAutoSave: () => Promise<void>;
}

/**
 * Wires the SaveManager to the Zustand game store.
 *
 * Pass an optional `controllerRef` (populated by GameControllerProvider) to
 * include curriculum progress and narrative state in every save.
 *
 * Auto-saves are triggered automatically on challenge completion and floor
 * transitions.
 */
export function useSaveSystem(
  controllerRef?: React.RefObject<GameController | null>,
): SaveSystemHook {
  const prevCompletedLenRef = useRef(0);
  const prevFloorRef = useRef(-1);

  const save = useCallback(
    async (slotId?: string): Promise<void> => {
      const state = useGameStore.getState();
      const controller = controllerRef?.current;
      const data = buildSaveData(state, controller);
      const now = new Date().toISOString();
      const id = slotId ?? `manual-${Date.now()}`;

      const existing = await saveManager.getSaveSlot(id);
      const slot: SaveSlot = {
        id,
        name: `Save — ${state.playerName || 'Agent'} · Floor ${state.currentFloor}`,
        data,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        isAutoSave: false,
      };

      await saveManager.saveSaveSlot(slot);
    },
    [controllerRef],
  );

  const load = useCallback(async (slotId: string): Promise<SaveData | undefined> => {
    const slot = await saveManager.getSaveSlot(slotId);
    if (slot === undefined) return undefined;

    const { data } = slot;
    const store = useGameStore.getState();

    // Clear transient challenge / dialog state
    store.setChallengeResult(null);
    store.setActiveChallenge(null);
    store.clearDialog();
    store.closeTerminal();

    // Restore persisted state
    store.setPlayerName(data.playerName);
    store.setPlayerGender(data.playerGender);
    store.setCurrentFloor(parseInt(data.currentFloor, 10) || 0);
    store.setCurrentRoom(data.currentRoom);
    store.setLevel(data.level);
    store.addXp(data.xp - useGameStore.getState().xp);

    return data;
  }, []);

  const listSaves = useCallback((): Promise<SaveSlot[]> => {
    return saveManager.getSaveSlots();
  }, []);

  const deleteSave = useCallback(async (slotId: string): Promise<void> => {
    await saveManager.deleteSaveSlot(slotId);
  }, []);

  const exportSave = useCallback(async (slotId: string): Promise<void> => {
    await saveManager.exportSaveSlot(slotId);
  }, []);

  const importSave = useCallback(async (file: File): Promise<SaveSlot> => {
    return saveManager.importSaveSlot(file);
  }, []);

  const triggerAutoSave = useCallback(async (): Promise<void> => {
    const state = useGameStore.getState();
    const controller = controllerRef?.current;
    const data = buildSaveData(state, controller);
    await saveManager.createAutoSave(data);
  }, [controllerRef]);

  // Auto-save on challenge completion
  useEffect(() => {
    return useGameStore.subscribe((state, prevState) => {
      if (state.completedChallenges.length > prevCompletedLenRef.current) {
        prevCompletedLenRef.current = state.completedChallenges.length;
        void triggerAutoSave();
      } else if (state.completedChallenges.length !== prevState.completedChallenges.length) {
        prevCompletedLenRef.current = state.completedChallenges.length;
      }
    });
  }, [triggerAutoSave]);

  // Auto-save on floor transition (skip initial mount)
  useEffect(() => {
    return useGameStore.subscribe((state) => {
      const floor = state.currentFloor;
      if (prevFloorRef.current === -1) {
        prevFloorRef.current = floor;
        return;
      }
      if (floor !== prevFloorRef.current) {
        prevFloorRef.current = floor;
        void triggerAutoSave();
      }
    });
  }, [triggerAutoSave]);

  return { save, load, listSaves, deleteSave, exportSave, importSave, triggerAutoSave };
}
