import { create } from 'zustand';
import type { GameStoreState } from '@venomous-snake/shared-types';

export const useGameStore = create<GameStoreState>((set) => ({
  player: {
    x: 0,
    y: 0,
    direction: 'down',
    currentRoom: 'lobby',
  },
  overlay: {
    terminalOpen: false,
    dialogOpen: false,
    menuOpen: false,
    inventoryOpen: false,
    mapOpen: false,
    skillTreeOpen: false,
  },
  isPaused: false,
  interactionPrompt: null,

  setPlayerPosition: (x, y) =>
    set((state) => ({ player: { ...state.player, x, y } })),
  setPlayerDirection: (direction) =>
    set((state) => ({ player: { ...state.player, direction } })),
  setCurrentRoom: (room) =>
    set((state) => ({ player: { ...state.player, currentRoom: room } })),
  openTerminal: (_terminalId) =>
    set((state) => ({
      overlay: { ...state.overlay, terminalOpen: true },
      isPaused: true,
    })),
  closeTerminal: () =>
    set((state) => ({
      overlay: { ...state.overlay, terminalOpen: false },
      isPaused: false,
    })),
  openDialog: (_dialogId, _npcId) =>
    set((state) => ({
      overlay: { ...state.overlay, dialogOpen: true },
      isPaused: true,
    })),
  closeDialog: () =>
    set((state) => ({
      overlay: { ...state.overlay, dialogOpen: false },
      isPaused: false,
    })),
  toggleMenu: () =>
    set((state) => ({
      overlay: { ...state.overlay, menuOpen: !state.overlay.menuOpen },
      isPaused: !state.overlay.menuOpen,
    })),
  toggleInventory: () =>
    set((state) => ({
      overlay: { ...state.overlay, inventoryOpen: !state.overlay.inventoryOpen },
    })),
  toggleMap: () =>
    set((state) => ({
      overlay: { ...state.overlay, mapOpen: !state.overlay.mapOpen },
    })),
  toggleSkillTree: () =>
    set((state) => ({
      overlay: { ...state.overlay, skillTreeOpen: !state.overlay.skillTreeOpen },
    })),
  setPaused: (paused) => set({ isPaused: paused }),
  setInteractionPrompt: (prompt) => set({ interactionPrompt: prompt }),
}));
