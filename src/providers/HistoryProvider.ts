import { Provider } from '../lib/types';
import { ExtensionBridge } from '../services/ExtensionBridge';
import { IndexedDbService } from '../services/indexedDbService';
import { fallbackHistory } from '../mockData/fallbackData';

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  visitedAt?: number;
}

const buildFallbackHistory = (): HistoryItem[] =>
  fallbackHistory.map((item, index) => ({
    ...item,
    visitedAt: Date.now() - (index + 1) * 1000 * 60 * 60 * 8,
  }));

export const HistoryProvider: Provider<HistoryItem[]> = {
  id: 'history',
  name: 'Chrome History',
  getData: async () => {
    try {
      const idbCached = await IndexedDbService.loadHistorySnapshot<HistoryItem>('latest');
      if (idbCached.length) return idbCached;

      const localCached = localStorage.getItem('history_cache');
      if (localCached) {
        const parsed = JSON.parse(localCached) as HistoryItem[];
        if (Array.isArray(parsed) && parsed.length) {
          await IndexedDbService.saveHistorySnapshot(parsed, 'latest');
          return parsed;
        }
      }

      const data = await ExtensionBridge.send<any[]>({ type: 'GET_HISTORY' });
      const mappedData = data.map((item: any) => ({
        id: item.id,
        title: item.title || item.url,
        url: item.url,
        visitedAt: item.lastVisitTime || item.visitedAt,
      }));

      const nextData = mappedData.length ? mappedData : buildFallbackHistory();
      localStorage.setItem('history_cache', JSON.stringify(nextData));
      await IndexedDbService.saveHistorySnapshot(nextData, 'latest');
      return nextData;
    } catch (error) {
      console.error('Failed to fetch history:', error);
      const fallback = buildFallbackHistory();
      await IndexedDbService.saveHistorySnapshot(fallback, 'latest').catch(() => undefined);
      return fallback;
    }
  },
  refresh: async () => {
    try {
      const data = await ExtensionBridge.send<any[]>({ type: 'GET_HISTORY' });
      const mappedData = data.map((item: any) => ({
        id: item.id,
        title: item.title || item.url,
        url: item.url,
        visitedAt: item.lastVisitTime || item.visitedAt,
      }));

      const nextData = mappedData.length ? mappedData : buildFallbackHistory();
      localStorage.setItem('history_cache', JSON.stringify(nextData));
      await IndexedDbService.saveHistorySnapshot(nextData, 'latest');
    } catch (error) {
      console.error('Failed to refresh history:', error);
    }
  },
};