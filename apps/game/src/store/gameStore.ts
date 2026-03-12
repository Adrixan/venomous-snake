import { create } from 'zustand';
import type { GameStoreState, NarrativeEntry } from '@venomous-snake/shared-types';

const STORAGE_KEY = 'vs-settings';

function loadAudioFromStorage(): { masterVolume: number; musicVolume: number; sfxVolume: number } {
  if (typeof window === 'undefined') {
    return { masterVolume: 0.8, musicVolume: 0.6, sfxVolume: 0.7 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        const p = parsed as Record<string, unknown>;
        return {
          masterVolume: typeof p['volumeMaster'] === 'number' ? p['volumeMaster'] / 100 : 0.8,
          musicVolume: typeof p['volumeMusic'] === 'number' ? p['volumeMusic'] / 100 : 0.6,
          sfxVolume: typeof p['volumeSfx'] === 'number' ? p['volumeSfx'] / 100 : 0.7,
        };
      }
    }
  } catch {
    // ignore parse errors
  }
  return { masterVolume: 0.8, musicVolume: 0.6, sfxVolume: 0.7 };
}

function saveAudioToStorage(masterVolume: number, musicVolume: number, sfxVolume: number): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: Record<string, unknown> =
      raw !== null ? (JSON.parse(raw) as Record<string, unknown>) : {};
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...existing,
        volumeMaster: Math.round(masterVolume * 100),
        volumeMusic: Math.round(musicVolume * 100),
        volumeSfx: Math.round(sfxVolume * 100),
      }),
    );
  } catch {
    // ignore write errors
  }
}

const initialAudio = loadAudioFromStorage();

const MAX_NARRATIVE_LOG = 500;

const INITIAL_OVERLAY_STATE = {
  terminalOpen: false,
  dialogOpen: false,
  menuOpen: false,
  inventoryOpen: false,
  mapOpen: false,
};

export const useGameStore = create<GameStoreState>((set) => ({
  currentRoomId: 'lobby_entrance',
  overlay: INITIAL_OVERLAY_STATE,

  // UI shell state
  gamePhase: 'menu',
  activePanel: 'none',
  playerName: '',
  playerGender: 'nonbinary',
  xp: 0,
  level: 1,
  currentFloor: 0,

  // Text adventure state
  visitedRooms: [],
  pickedUpItems: [],
  storyFlags: {},
  narrativeLog: [],
  availableActions: [],

  // Challenge state
  currentChallengeId: null,
  activeChallengeId: null,
  challengeResult: null,
  completedChallenges: [],
  unlockedFloors: [0],
  dialogActive: false,
  dialogContent: null,

  // Inventory
  inventory: [],

  // Alert / stealth level
  alertLevel: 0 as 0 | 1 | 2 | 3,

  // Game completion
  gameCompleted: false,

  // Audio settings
  masterVolume: initialAudio.masterVolume,
  musicVolume: initialAudio.musicVolume,
  sfxVolume: initialAudio.sfxVolume,
  isMuted: false,

  // Room/navigation actions
  setCurrentRoom: (roomId) => set({ currentRoomId: roomId }),
  addVisitedRoom: (roomId) =>
    set((state) => ({
      visitedRooms: state.visitedRooms.includes(roomId)
        ? state.visitedRooms
        : [...state.visitedRooms, roomId],
    })),
  setStoryFlag: (flag, value) =>
    set((state) => ({
      storyFlags: { ...state.storyFlags, [flag]: value },
    })),
  appendNarrative: (entry: NarrativeEntry) =>
    set((state) => ({
      narrativeLog:
        state.narrativeLog.length >= MAX_NARRATIVE_LOG
          ? [...state.narrativeLog.slice(-MAX_NARRATIVE_LOG + 1), entry]
          : [...state.narrativeLog, entry],
    })),
  clearNarrative: () => set({ narrativeLog: [] }),
  setAvailableActions: (actions) => set({ availableActions: actions }),

  openTerminal: (_terminalId, challengeId) =>
    set((state) => ({
      overlay: { ...state.overlay, terminalOpen: true },
      currentChallengeId: challengeId ?? null,
    })),
  closeTerminal: () =>
    set((state) => ({
      overlay: { ...state.overlay, terminalOpen: false },
      currentChallengeId: null,
    })),
  openDialog: (_dialogId, _npcId) =>
    set((state) => ({
      overlay: { ...state.overlay, dialogOpen: true },
    })),
  closeDialog: () =>
    set((state) => ({
      overlay: { ...state.overlay, dialogOpen: false },
    })),
  toggleMenu: () =>
    set((state) => ({
      overlay: { ...state.overlay, menuOpen: !state.overlay.menuOpen },
    })),
  toggleInventory: () =>
    set((state) => ({
      overlay: { ...state.overlay, inventoryOpen: !state.overlay.inventoryOpen },
    })),
  toggleMap: () =>
    set((state) => ({
      overlay: { ...state.overlay, mapOpen: !state.overlay.mapOpen },
    })),

  // UI shell actions
  setGamePhase: (phase) => set({ gamePhase: phase }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setPlayerName: (name) => set({ playerName: name }),
  setPlayerGender: (gender) => set({ playerGender: gender }),
  addXp: (amount) =>
    set((state) => {
      const newXp = state.xp + amount;
      return { xp: newXp, level: Math.floor(newXp / 100) + 1 };
    }),
  setLevel: (level) => set({ level }),
  setCurrentFloor: (floor) => set({ currentFloor: floor }),

  // Challenge actions
  setActiveChallenge: (id) => set({ activeChallengeId: id }),
  setChallengeResult: (result) => set({ challengeResult: result }),
  addCompletedChallenge: (id) =>
    set((state) => ({
      completedChallenges: state.completedChallenges.includes(id)
        ? state.completedChallenges
        : [...state.completedChallenges, id],
    })),
  addPickedUpItem: (itemId) =>
    set((state) => ({
      pickedUpItems: state.pickedUpItems.includes(itemId)
        ? state.pickedUpItems
        : [...state.pickedUpItems, itemId],
    })),
  unlockFloor: (n) =>
    set((state) => ({
      unlockedFloors: state.unlockedFloors.includes(n)
        ? state.unlockedFloors
        : [...state.unlockedFloors, n],
    })),
  setDialog: (content) => set({ dialogActive: true, dialogContent: content }),
  clearDialog: () => set({ dialogActive: false, dialogContent: null }),

  // Inventory actions
  addToInventory: (itemId) =>
    set((state) => ({
      inventory: state.inventory.includes(itemId) ? state.inventory : [...state.inventory, itemId],
    })),
  removeFromInventory: (itemId) =>
    set((state) => ({
      inventory: state.inventory.filter((id) => id !== itemId),
    })),

  // Alert / stealth actions
  setAlertLevel: (level) => set({ alertLevel: level }),
  incrementAlertLevel: () =>
    set((state) => ({
      alertLevel: Math.min(3, state.alertLevel + 1) as 0 | 1 | 2 | 3,
    })),

  // Game completion actions
  setGameCompleted: (completed) => set({ gameCompleted: completed }),

  // Audio actions
  setMasterVolume: (volume) => {
    const v = Math.max(0, Math.min(1, volume));
    set((state) => {
      saveAudioToStorage(v, state.musicVolume, state.sfxVolume);
      return { masterVolume: v };
    });
  },
  setMusicVolume: (volume) => {
    const v = Math.max(0, Math.min(1, volume));
    set((state) => {
      saveAudioToStorage(state.masterVolume, v, state.sfxVolume);
      return { musicVolume: v };
    });
  },
  setSfxVolume: (volume) => {
    const v = Math.max(0, Math.min(1, volume));
    set((state) => {
      saveAudioToStorage(state.masterVolume, state.musicVolume, v);
      return { sfxVolume: v };
    });
  },
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  resetGameState: () =>
    set({
      currentRoomId: 'lobby_entrance',
      overlay: INITIAL_OVERLAY_STATE,
      gamePhase: 'menu',
      activePanel: 'none',
      xp: 0,
      level: 1,
      currentFloor: 0,
      visitedRooms: [],
      pickedUpItems: [],
      storyFlags: {},
      narrativeLog: [],
      availableActions: [],
      currentChallengeId: null,
      activeChallengeId: null,
      challengeResult: null,
      completedChallenges: [],
      unlockedFloors: [0],
      dialogActive: false,
      dialogContent: null,
      inventory: [],
      alertLevel: 0,
      gameCompleted: false,
    }),
}));
