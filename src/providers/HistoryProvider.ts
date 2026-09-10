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

      const data = await ExtensionBridge.send<HistoryItem[]>({ type: 'GET_HISTORY' });
      localStorage.setItem('history_cache', JSON.stringify(data));
      return data.length ? data : fallbackHistory.map((item, index) => ({
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