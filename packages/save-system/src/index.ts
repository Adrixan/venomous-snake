// @venomous-snake/save-system
// Persistence layer: IndexedDB storage and JSON save/load
export const SAVE_SYSTEM_VERSION = '0.0.1';

export type { GameSettings, InventoryItem, SaveData, SaveSlot } from './types';
export { saveManager, MAX_SAVE_SLOTS, MAX_AUTOSAVE_SLOTS } from './SaveManager';
