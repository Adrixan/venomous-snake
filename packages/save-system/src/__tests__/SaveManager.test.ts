import { describe, expect, it } from 'vitest';
import { MemorySaveStore } from '../storage';
import { SaveManager } from '../SaveManager';
import { SAVE_FORMAT_VERSION } from '../types';
import type { SaveData } from '../types';

const data: SaveData = {
  version: SAVE_FORMAT_VERSION,
  savedAt: '2026-01-01T00:00:00.000Z',
  playerName: 'Viper',
  playerGender: 'nonbinary',
  playTimeMs: 42,
  engine: {
    currentRoomId: 'lobby_entrance',
    visitedRooms: ['lobby_entrance'],
    storyFlags: {},
    completedChallenges: ['ch01_01_hello_world'],
  },
  progress: {
    challenges: {
      ch01_01_hello_world: {
        challengeId: 'ch01_01_hello_world',
        completed: true,
        attempts: 2,
        hintsUsed: 1,
      },
    },
    totalXp: 123,
    spentSkillXp: 0,
    achievements: ['first_hack'],
    skills: [],
    inventory: [],
    streak: 0,
  },
  narrative: { flags: {}, completedDialogs: [] },
  alertLevel: 0,
  gameCompleted: false,
  seenCutscenes: ['intro'],
  newGamePlus: 0,
};

describe('SaveManager', () => {
  it('round-trips progress and imports/exports without overwriting existing saves', async () => {
    const manager = new SaveManager(new MemorySaveStore());
    const saved = await manager.save('manual', data);
    expect((await manager.getSlot(saved.id))?.data).toEqual(data);
    const exported = await manager.exportSlots([saved.id]);
    const imported = await manager.importFile(exported);
    expect(imported).toHaveLength(1);
    expect(imported[0]?.id).not.toBe(saved.id);
    expect(imported[0]?.data).toEqual(data);
  });

  it('rejects modified export bundles', async () => {
    const manager = new SaveManager(new MemorySaveStore());
    await manager.save('manual', data);
    const bundle = JSON.parse(await manager.exportSlots()) as { saves: Array<{ data: SaveData }> };
    bundle.saves[0]!.data.progress.totalXp += 1;
    await expect(manager.importFile(JSON.stringify(bundle))).rejects.toThrow(/checksum/i);
  });

  it('rotates autosaves within the configured slot limit', async () => {
    const manager = new SaveManager(new MemorySaveStore());
    await Promise.all(
      Array.from({ length: 5 }, (_, index) => manager.autosave(`auto ${index}`, data)),
    );
    const autos = (await manager.listSlots()).filter((slot) => slot.isAutoSave);
    expect(autos).toHaveLength(3);
  });
});
