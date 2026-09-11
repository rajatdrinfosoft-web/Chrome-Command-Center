import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IndexedDbService } from './indexedDbService';

describe('IndexedDbService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    const storeMap = new Map<string, Map<string, unknown>>();

    const createStore = (name: string) => {
      if (!storeMap.has(name)) {
        storeMap.set(name, new Map());
      }
      return storeMap.get(name)!;
    };

    const createRequest = <T>(value: T) => ({
      result: value,
      onsuccess: null as ((event?: any) => void) | null,
      onerror: null as ((event?: any) => void) | null,
      onupgradeneeded: null as ((event?: any) => void) | null,
      onblocked: null as ((event?: any) => void) | null,
      error: null,
    });

    const fakeDb = {
      objectStoreNames: {
        contains: (name: string) => storeMap.has(name),
      },
      createObjectStore: (name: string) => createStore(name),
      transaction: (stores: string[], mode: string) => {
        const tx = {
          objectStore: (storeName: string) => ({
            put: (value: any) => {
              const store = createStore(storeName);
              const key = value.id ?? value.key ?? 'default';
              store.set(String(key), value);
              const req = createRequest(value);
              setTimeout(() => req.onsuccess?.({ target: { result: value } }));
              return req;
            },
            get: (key: string) => {
              const store = createStore(storeName);
              const req = createRequest(store.get(String(key)) ?? null);
              setTimeout(() => req.onsuccess?.({ target: { result: store.get(String(key)) ?? null } }));
              return req;
            },
            clear: () => {
              const store = createStore(storeName);
              store.clear();
              const req = createRequest(undefined);
              setTimeout(() => req.onsuccess?.({ target: { result: undefined } }));
              return req;
            },
          }),
        };

        return tx;
      },
      close: () => undefined,
    };

    const fakeOpenRequest = createRequest(fakeDb);

    Object.defineProperty(globalThis, 'indexedDB', {
      configurable: true,
      value: {
        open: vi.fn(() => {
          setTimeout(() => {
            fakeOpenRequest.onsuccess?.({ target: { result: fakeDb } });
          }, 0);
          return fakeOpenRequest;
        }),
      },
    });
  });

  it('persists and restores history snapshots in IndexedDB', async () => {
    const snapshot = [{ id: '1', title: 'Docs', url: 'https://example.com/docs', visitedAt: 123 }];

    await expect(IndexedDbService.saveHistorySnapshot(snapshot, 'latest')).resolves.toBe(true);
    await expect(IndexedDbService.loadHistorySnapshot('latest')).resolves.toEqual(snapshot);
  });
});
