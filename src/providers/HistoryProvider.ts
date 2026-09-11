import { Provider } from '../lib/types';
import { ExtensionBridge } from '../services/ExtensionBridge';
import { fallbackHistory } from '../mockData/fallbackData';

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  visitedAt?: number;
}

export const HistoryProvider: Provider<HistoryItem[]> = {
  id: 'history',
  name: 'Chrome History',
  getData: async () => {
    try {
      const cached = localStorage.getItem('history_cache');
      if (cached) return JSON.parse(cached);

      const data = await ExtensionBridge.send<any[]>({ type: 'GET_HISTORY' });
      const mappedData = data.map((item: any) => ({
        id: item.id,
        title: item.title || item.url,
        url: item.url,
        visitedAt: item.lastVisitTime || item.visitedAt
      }));
      localStorage.setItem('history_cache', JSON.stringify(mappedData));
      return mappedData.length ? mappedData : fallbackHistory.map((item, index) => ({
        ...item,
        visitedAt: Date.now() - (index + 1) * 1000 * 60 * 60 * 8,
      }));
    } catch (error) {
      console.error('Failed to fetch history:', error);
      return fallbackHistory.map((item, index) => ({
        ...item,
        visitedAt: Date.now() - (index + 1) * 1000 * 60 * 60 * 8,
      }));
    }
  },
  refresh: async () => {
    // Logic to force update
  },
};