export type IndexedDbStoreName = 'historySnapshots' | 'largeCache';

export interface IndexedDbRow<T> {
  id: string;
  value: T;
  savedAt: number;
}

export class IndexedDbService {
  static readonly DB_NAME = 'command-center-db';
  static readonly DB_VERSION = 1;
  static readonly STORES = {
    HISTORY_SNAPSHOTS: 'historySnapshots',
    LARGE_CACHE: 'largeCache',
  } as const;

  static async openDatabase(): Promise<IDBDatabase | null> {
    if (typeof indexedDB === 'undefined') {
      return null;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.STORES.HISTORY_SNAPSHOTS)) {
          db.createObjectStore(this.STORES.HISTORY_SNAPSHOTS);
        }

        if (!db.objectStoreNames.contains(this.STORES.LARGE_CACHE)) {
          db.createObjectStore(this.STORES.LARGE_CACHE);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('IndexedDB open request failed'));
    });
  }

  static async saveRecord<T>(storeName: IndexedDbStoreName, key: string, value: T): Promise<boolean> {
    const db = await this.openDatabase();
    if (!db) return false;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({ id: key, value, savedAt: Date.now() } as IndexedDbRow<T>);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error ?? new Error(`Failed to save record for ${key}`));
    });
  }

  static async loadRecord<T>(storeName: IndexedDbStoreName, key: string): Promise<T | null> {
    const db = await this.openDatabase();
    if (!db) return null;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result as IndexedDbRow<T> | undefined;
        resolve(result && 'value' in result ? result.value : null);
      };

      request.onerror = () => reject(request.error ?? new Error(`Failed to load record for ${key}`));
    });
  }

  static async saveHistorySnapshot<T>(items: T[], key = 'latest'): Promise<boolean> {
    return this.saveRecord<T[]>(this.STORES.HISTORY_SNAPSHOTS, key, items);
  }

  static async loadHistorySnapshot<T>(key = 'latest'): Promise<T[]> {
    const record = await this.loadRecord<T[]>(this.STORES.HISTORY_SNAPSHOTS, key);
    return Array.isArray(record) ? record : [];
  }

  static async saveLargeData<T>(key: string, value: T): Promise<boolean> {
    return this.saveRecord<T>(this.STORES.LARGE_CACHE, key, value);
  }

  static async loadLargeData<T>(key: string): Promise<T | null> {
    return this.loadRecord<T>(this.STORES.LARGE_CACHE, key);
  }

  static async clearStore(storeName: IndexedDbStoreName): Promise<boolean> {
    const db = await this.openDatabase();
    if (!db) return false;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error ?? new Error(`Failed to clear store ${storeName}`));
    });
  }
}
