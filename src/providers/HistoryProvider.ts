import { Provider } from '../lib/types';
import { ExtensionBridge } from '../services/ExtensionBridge';

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
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
      return data;
    } catch (error) {
      console.error('Failed to fetch history:', error);
      return [];
    }
  },
  refresh: async () => {
    // Logic to force update
  },
};
