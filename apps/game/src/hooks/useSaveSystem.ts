/* eslint-disable @nx/enforce-module-boundaries */
import { useCallback, useEffect, useRef } from 'react';
import type React from 'react';
import { saveManager } from '@venomous-snake/save-system';
import type { SaveSlot, SaveData } from '@venomous-snake/save-system';
import { SAVE_FORMAT_VERSION } from '@venomous-snake/save-system';
import { downloadTextFile } from '@venomous-snake/save-system';
import { useGameStore } from '../store/gameStore';
import type { GameController } from '../GameController';
import { TextAdventureEngine, getRoomById } from '@venomous-snake/engine';
import { challengeMap } from '@venomous-snake/challenges';

function buildSaveData(
  state: ReturnType<typeof useGameStore.getState>,
  controller: GameController | null | undefined,
): SaveData {
  const curriculum = controller?.getProgress();
  const challenges =
    curriculum?.challenges ??
    Object.fromEntries(
      state.completedChallenges.map((id) => [
        id,
        { challengeId: id, completed: true, attempts: 1, hintsUsed: 0 },
      ]),
    );
  return {
    version: SAVE_FORMAT_VERSION,
    savedAt: new Date().toISOString(),
    playerName: state.playerName || 'Agent',
    playerGender: state.playerGender,
    playTimeMs: 0,
    engine: new TextAdventureEngine({
      currentRoomId: state.currentRoomId,
      visitedRooms: state.visitedRooms,
      storyFlags: state.storyFlags,
      completedChallenges: state.completedChallenges,
    }).toSnapshot(),
    progress: {
      challenges,
      totalXp: curriculum?.totalXp ?? state.xp,
      spentSkillXp: 0,
      achievements: [],
      skills: [],
      inventory: [],
      streak: 0,
    },
    narrative: { flags: {}, completedDialogs: [] },
    alertLevel: state.alertLevel,
    gameCompleted: state.gameCompleted,
    seenCutscenes: [],
    newGamePlus: 0,
  };
}

function restore(data: SaveData): void {
  const state = useGameStore.getState();
  const completed = [
    ...new Set([
      ...data.engine.completedChallenges,
      ...Object.values(data.progress.challenges)
        .filter((p) => p.completed)
        .map((p) => p.challengeId),
    ]),
  ];
  state.resetGameState();
  state.setPlayerName(data.playerName);
  state.setPlayerGender(data.playerGender);
  state.setCurrentRoom(data.engine.currentRoomId);
  state.setCurrentFloor(getRoomById(data.engine.currentRoomId)?.floor ?? 0);
  for (const room of data.engine.visitedRooms) state.addVisitedRoom(room);
  for (const [key, value] of Object.entries(data.engine.storyFlags)) state.setStoryFlag(key, value);
  for (const id of completed) state.addCompletedChallenge(id);
  state.addXp(data.progress.totalXp);
  state.setAlertLevel(data.alertLevel as 0 | 1 | 2 | 3);
  state.setGameCompleted(data.gameCompleted);
  for (let floor = 0; floor <= 11; floor++) {
    const ids = Object.values(challengeMap)
      .filter((c) => c.chapter <= floor + 1)
      .map((c) => c.id);
    if (ids.every((id) => completed.includes(id))) state.unlockFloor(floor);
  }
  state.setGamePhase('playing');
}

export interface SaveSystemHook {
  save: (slotId?: string) => Promise<void>;
  load: (slotId: string) => Promise<SaveData | undefined>;
  listSaves: () => Promise<SaveSlot[]>;
  deleteSave: (slotId: string) => Promise<void>;
  exportSave: (slotId: string) => Promise<void>;
  importSave: (file: File) => Promise<SaveSlot>;
  triggerAutoSave: () => Promise<void>;
}

export function useSaveSystem(
  controllerRef?: React.RefObject<GameController | null>,
): SaveSystemHook {
  const previous = useRef({ completed: 0, floor: -1 });
  const save = useCallback(
    async (slotId?: string): Promise<void> => {
      const state = useGameStore.getState();
      await saveManager.save(
        `Save — ${state.playerName || 'Agent'} · Floor ${state.currentFloor}`,
        buildSaveData(state, controllerRef?.current),
        slotId,
      );
    },
    [controllerRef],
  );
  const load = useCallback(async (slotId: string): Promise<SaveData | undefined> => {
    const slot = await saveManager.getSlot(slotId);
    if (!slot) return undefined;
    restore(slot.data);
    return slot.data;
  }, []);
  const listSaves = useCallback(() => saveManager.listSlots(), []);
  const deleteSave = useCallback((id: string) => saveManager.deleteSlot(id), []);
  const exportSave = useCallback(async (id: string) => {
    const text = await saveManager.exportSlots([id]);
    downloadTextFile(`venomous-snake-${id}.json`, text);
  }, []);
  const importSave = useCallback(async (file: File) => {
    const imported = await saveManager.importFile(await file.text());
    const first = imported[0];
    if (!first) throw new Error('Import contained no saves');
    return first;
  }, []);
  const triggerAutoSave = useCallback(async () => {
    const state = useGameStore.getState();
    await saveManager.autosave(
      `Auto Save — ${state.playerName || 'Agent'} · Floor ${state.currentFloor}`,
      buildSaveData(state, controllerRef?.current),
    );
  }, [controllerRef]);
  useEffect(
    () =>
      useGameStore.subscribe((state) => {
        const now = { completed: state.completedChallenges.length, floor: state.currentFloor };
        if (previous.current.completed === 0) previous.current.completed = now.completed;
        if (
          now.completed > previous.current.completed ||
          (previous.current.floor >= 0 && now.floor !== previous.current.floor)
        ) {
          previous.current = now;
          void triggerAutoSave().catch((error: unknown) => console.error('Autosave failed', error));
        } else previous.current = now;
      }),
    [triggerAutoSave],
  );
  return { save, load, listSaves, deleteSave, exportSave, importSave, triggerAutoSave };
}
