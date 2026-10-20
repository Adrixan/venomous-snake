// @venomous-snake/save-system
// Validated persistence of save games in IndexedDB, plus export and import.
export { SAVE_FORMAT_VERSION } from './types';
export type { SaveData, SaveSlot, SaveBundle, PlayerGender } from './types';
export {
  SaveManager,
  saveManager,
  MAX_SAVE_SLOTS,
  MAX_AUTOSAVE_SLOTS,
  MAX_IMPORT_BYTES,
} from './SaveManager';
export { parseSaveData, parseSaveSlot, InvalidSaveError } from './schema';
export { IndexedDbSaveStore, MemorySaveStore, StorageUnavailableError } from './storage';
export type { SaveStore } from './storage';
export { downloadTextFile } from './download';
