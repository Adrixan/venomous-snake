/** Minimal key-value persistence used by the save manager. */
export interface SaveStore {
  getAll(): Promise<unknown[]>;
  get(id: string): Promise<unknown>;
  put<T extends { id: string }>(record: T): Promise<void>;
  delete(id: string): Promise<void>;
}

/** Raised when the browser refuses persistent storage (private mode, quota, policy). */
export class StorageUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Saving is not available in this browser session');
    this.name = 'StorageUnavailableError';
    if (cause !== undefined) (this as { cause?: unknown }).cause = cause;
  }
}

const DB_NAME = 'venomous-snake-saves';
const DB_VERSION = 1;
const STORE_NAME = 'saves';

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    req.onsuccess = (): void => resolve(req.result);
    req.onerror = (): void => reject(req.error ?? new Error('IndexedDB request failed'));
  });
}

/** IndexedDB-backed store. Asks the browser to keep the data persistent. */
export class IndexedDbSaveStore implements SaveStore {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private open(): Promise<IDBDatabase> {
    if (this.dbPromise !== null) return this.dbPromise;
    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new StorageUnavailableError());
        return;
      }
      let req: IDBOpenDBRequest;
      try {
        req = indexedDB.open(DB_NAME, DB_VERSION);
      } catch (err) {
        reject(new StorageUnavailableError(err));
        return;
      }
      req.onupgradeneeded = (): void => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = (): void => resolve(req.result);
      req.onerror = (): void => reject(new StorageUnavailableError(req.error));
      req.onblocked = (): void => reject(new StorageUnavailableError('blocked'));
    });
    this.dbPromise.catch(() => {
      this.dbPromise = null;
    });
    void this.requestPersistence();
    return this.dbPromise;
  }

  private async requestPersistence(): Promise<void> {
    try {
      if (typeof navigator !== 'undefined' && navigator.storage?.persist !== undefined) {
        await navigator.storage.persist();
      }
    } catch {
      // Best effort: browsers may decline without consequences for this session.
    }
  }

  private async store(mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = await this.open();
    return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
  }

  async getAll(): Promise<unknown[]> {
    return request((await this.store('readonly')).getAll());
  }

  async get(id: string): Promise<unknown> {
    return request((await this.store('readonly')).get(id));
  }

  async put<T extends { id: string }>(record: T): Promise<void> {
    await request((await this.store('readwrite')).put(record));
  }

  async delete(id: string): Promise<void> {
    await request((await this.store('readwrite')).delete(id));
  }
}

/** In-memory store for tests and for sessions without persistent storage. */
export class MemorySaveStore implements SaveStore {
  private readonly records = new Map<string, unknown>();

  getAll(): Promise<unknown[]> {
    return Promise.resolve([...this.records.values()].map((r) => structuredClone(r)));
  }

  get(id: string): Promise<unknown> {
    const r = this.records.get(id);
    return Promise.resolve(r === undefined ? undefined : structuredClone(r));
  }

  put<T extends { id: string }>(record: T): Promise<void> {
    this.records.set(record.id, structuredClone(record));
    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    this.records.delete(id);
    return Promise.resolve();
  }
}
