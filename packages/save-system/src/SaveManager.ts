import type { SaveSlot, SaveData, SaveBundle } from './types';
import { computeSignature, verifySignature } from './integrity';

const DB_NAME = 'venomous-snake-saves';
const DB_VERSION = 1;
const STORE_NAME = 'saves';

export const MAX_SAVE_SLOTS = 20;
export const MAX_AUTOSAVE_SLOTS = 3;

class SaveManager {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        this.dbPromise = null;
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  async getSaveSlots(): Promise<SaveSlot[]> {
    const db = await this.openDB();
    return new Promise<SaveSlot[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as SaveSlot[]);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getSaveSlot(id: string): Promise<SaveSlot | undefined> {
    const db = await this.openDB();
    return new Promise<SaveSlot | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result as SaveSlot | undefined;
        resolve(result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async saveSaveSlot(slot: SaveSlot): Promise<void> {
    const db = await this.openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(slot);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async deleteSaveSlot(id: string): Promise<void> {
    const db = await this.openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async renameSaveSlot(id: string, name: string): Promise<void> {
    const slot = await this.getSaveSlot(id);
    if (slot === undefined) {
      throw new Error(`Save slot "${id}" not found`);
    }
    slot.name = name;
    slot.updatedAt = new Date().toISOString();
    await this.saveSaveSlot(slot);
  }

  async exportSaveSlot(id: string): Promise<void> {
    const slot = await this.getSaveSlot(id);
    if (slot === undefined) {
      throw new Error(`Save slot "${id}" not found`);
    }

    const savesJson = JSON.stringify([slot]);
    const signature = await computeSignature(savesJson);

    const bundle: SaveBundle = {
      version: 1,
      exportedAt: new Date().toISOString(),
      saves: [slot],
      signature,
    };

    const json = JSON.stringify(bundle, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `venomous-snake-save-${slot.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async exportAllSaves(): Promise<void> {
    const slots = await this.getSaveSlots();
    if (slots.length === 0) {
      throw new Error('No save files to export');
    }

    const savesJson = JSON.stringify(slots);
    const signature = await computeSignature(savesJson);

    const bundle: SaveBundle = {
      version: 1,
      exportedAt: new Date().toISOString(),
      saves: slots,
      signature,
    };

    const json = JSON.stringify(bundle, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `venomous-snake-saves-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async importAllSaves(file: File): Promise<number> {
    const text = await file.text();
    const parsed: unknown = JSON.parse(text);

    if (!isSaveBundle(parsed)) {
      throw new Error('Invalid save bundle format');
    }

    const bundle = parsed;

    // Verify HMAC signature
    const savesJson = JSON.stringify(bundle.saves);
    const valid = await verifySignature(savesJson, bundle.signature);
    if (!valid) {
      throw new Error('Save file integrity check failed — file may have been modified');
    }

    // Import all saves
    for (const slot of bundle.saves) {
      slot.updatedAt = new Date().toISOString();
      await this.saveSaveSlot(slot);
    }

    return bundle.saves.length;
  }

  async importSaveSlot(file: File): Promise<SaveSlot> {
    const text = await file.text();
    const parsed: unknown = JSON.parse(text);

    // Handle new bundle format
    if (isSaveBundle(parsed)) {
      const savesJson = JSON.stringify(parsed.saves);
      const valid = await verifySignature(savesJson, parsed.signature);
      if (!valid) {
        throw new Error('Save file integrity check failed — file may have been modified');
      }
      if (parsed.saves.length === 0) {
        throw new Error('Save bundle contains no saves');
      }
      // Import all saves from bundle
      for (const slot of parsed.saves) {
        slot.updatedAt = new Date().toISOString();
        await this.saveSaveSlot(slot);
      }
      const first = parsed.saves[0];
      if (first === undefined) {
        throw new Error('Save bundle contains no saves');
      }
      return first;
    }

    // Handle legacy plain SaveSlot format (no signature check for backwards compatibility)
    if (!isSaveSlot(parsed)) {
      throw new Error('Invalid save file format');
    }

    const slot = parsed;
    slot.updatedAt = new Date().toISOString();
    await this.saveSaveSlot(slot);
    return slot;
  }

  async createAutoSave(data: SaveData): Promise<void> {
    const slots = await this.getSaveSlots();
    const autoSaves = slots
      .filter((s) => s.isAutoSave)
      .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));

    let targetId: string;

    if (autoSaves.length < MAX_AUTOSAVE_SLOTS) {
      targetId = `autosave-${String(autoSaves.length + 1)}`;
    } else {
      // Rotate: overwrite the oldest autosave
      const oldest = autoSaves[0];
      targetId = oldest !== undefined ? oldest.id : 'autosave-1';
    }

    const now = new Date().toISOString();
    const slot: SaveSlot = {
      id: targetId,
      name: `Auto Save`,
      data,
      createdAt: now,
      updatedAt: now,
      isAutoSave: true,
    };

    await this.saveSaveSlot(slot);
  }
}

function isSaveSlot(value: unknown): value is SaveSlot {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj['id'] === 'string' &&
    typeof obj['name'] === 'string' &&
    typeof obj['data'] === 'object' &&
    obj['data'] !== null &&
    typeof obj['createdAt'] === 'string' &&
    typeof obj['updatedAt'] === 'string' &&
    typeof obj['isAutoSave'] === 'boolean'
  );
}

function isSaveBundle(value: unknown): value is SaveBundle {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj['version'] === 'number' &&
    typeof obj['exportedAt'] === 'string' &&
    Array.isArray(obj['saves']) &&
    typeof obj['signature'] === 'string' &&
    (obj['saves'] as unknown[]).every((s) => isSaveSlot(s))
  );
}

export const saveManager = new SaveManager();
