import { SAVE_FORMAT_VERSION } from './types';
import type { SaveBundle, SaveData, SaveSlot } from './types';
import { InvalidSaveError, parseSaveSlot } from './schema';
import { IndexedDbSaveStore } from './storage';
import type { SaveStore } from './storage';

export const MAX_SAVE_SLOTS = 20;
export const MAX_AUTOSAVE_SLOTS = 3;
/** Imported files larger than this are rejected before parsing. */
export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export class SaveManager {
  /** Serialises writes so concurrent autosaves cannot pick the same slot. */
  private writes: Promise<unknown> = Promise.resolve();

  constructor(private readonly store: SaveStore = new IndexedDbSaveStore()) {}

  private serial<T>(task: () => Promise<T>): Promise<T> {
    const run = this.writes.then(task, task);
    this.writes = run.catch(() => undefined);
    return run;
  }

  /** All valid slots, newest first. Records that fail validation are skipped. */
  async listSlots(): Promise<SaveSlot[]> {
    const raw = await this.store.getAll();
    const slots: SaveSlot[] = [];
    for (const record of raw) {
      try {
        slots.push(parseSaveSlot(record));
      } catch {
        // A corrupt record must not hide the others.
      }
    }
    return slots.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getSlot(id: string): Promise<SaveSlot | undefined> {
    const raw = await this.store.get(id);
    return raw === undefined ? undefined : parseSaveSlot(raw);
  }

  /** The most recently written slot of any kind. */
  async getLatest(): Promise<SaveSlot | undefined> {
    return (await this.listSlots())[0];
  }

  /** Writes a manual save; overwrites `id` when given, otherwise creates a slot. */
  save(name: string, data: SaveData, id?: string): Promise<SaveSlot> {
    return this.serial(async () => {
      const slots = await this.listSlots();
      const existing = id === undefined ? undefined : slots.find((s) => s.id === id);
      const manualCount = slots.filter((s) => !s.isAutoSave).length;
      if (existing === undefined && manualCount >= MAX_SAVE_SLOTS) {
        throw new Error(`At most ${String(MAX_SAVE_SLOTS)} saves are allowed. Delete one first.`);
      }
      const now = new Date().toISOString();
      const slot: SaveSlot = {
        id: existing?.id ?? newId('save'),
        name: name.slice(0, 80),
        data,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        isAutoSave: false,
      };
      await this.store.put(slot);
      return slot;
    });
  }

  /** Writes to the oldest of the rotating autosave slots. */
  autosave(name: string, data: SaveData): Promise<SaveSlot> {
    return this.serial(async () => {
      const autos = (await this.listSlots())
        .filter((s) => s.isAutoSave)
        .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
      const free = Array.from(
        { length: MAX_AUTOSAVE_SLOTS },
        (_, i) => `autosave-${String(i + 1)}`,
      ).find((id) => !autos.some((s) => s.id === id));
      const target = free ?? autos[0]?.id ?? 'autosave-1';
      const now = new Date().toISOString();
      const slot: SaveSlot = {
        id: target,
        name,
        data,
        createdAt: now,
        updatedAt: now,
        isAutoSave: true,
      };
      await this.store.put(slot);
      return slot;
    });
  }

  deleteSlot(id: string): Promise<void> {
    return this.serial(() => this.store.delete(id));
  }

  async renameSlot(id: string, name: string): Promise<void> {
    const slot = await this.getSlot(id);
    if (slot === undefined) throw new Error(`Save slot "${id}" not found`);
    await this.serial(() =>
      this.store.put({ ...slot, name: name.slice(0, 80), updatedAt: new Date().toISOString() }),
    );
  }

  /** Serialises the given slots (or all) into an export file. */
  async exportSlots(ids?: string[]): Promise<string> {
    const all = await this.listSlots();
    const saves = ids === undefined ? all : all.filter((s) => ids.includes(s.id));
    if (saves.length === 0) throw new Error('No saves to export');
    const bundle: SaveBundle = {
      format: 'venomous-snake-saves',
      version: SAVE_FORMAT_VERSION,
      exportedAt: new Date().toISOString(),
      saves,
      checksum: await sha256Hex(JSON.stringify(saves)),
    };
    return JSON.stringify(bundle, null, 2);
  }

  /**
   * Imports saves from an exported file (current or earlier format, or a single
   * slot). Every save is validated; imported saves get fresh ids so they never
   * overwrite existing ones. Returns the imported slots.
   */
  async importFile(text: string): Promise<SaveSlot[]> {
    if (text.length > MAX_IMPORT_BYTES) throw new InvalidSaveError('file is too large');
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new InvalidSaveError('file is not valid JSON');
    }

    let candidates: unknown[];
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      Array.isArray((parsed as { saves?: unknown }).saves)
    ) {
      const bundle = parsed as { saves: unknown[]; checksum?: unknown; format?: unknown };
      if (bundle.format === 'venomous-snake-saves') {
        const expected = typeof bundle.checksum === 'string' ? bundle.checksum : '';
        if (expected !== (await sha256Hex(JSON.stringify(bundle.saves)))) {
          throw new InvalidSaveError('file is damaged (checksum mismatch)');
        }
      }
      candidates = bundle.saves;
    } else {
      candidates = [parsed];
    }
    if (candidates.length === 0) throw new InvalidSaveError('file contains no saves');

    const slots = candidates.map((c) => parseSaveSlot(c));
    const now = new Date().toISOString();
    return this.serial(async () => {
      const imported: SaveSlot[] = [];
      for (const slot of slots) {
        const fresh: SaveSlot = { ...slot, id: newId('import'), isAutoSave: false, updatedAt: now };
        await this.store.put(fresh);
        imported.push(fresh);
      }
      return imported;
    });
  }
}

export const saveManager = new SaveManager();
