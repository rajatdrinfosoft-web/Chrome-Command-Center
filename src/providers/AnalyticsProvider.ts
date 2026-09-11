import { Provider } from '../lib/types';
import { fallbackAnalytics } from '../mockData/fallbackData';

export interface SiteStats {
  url: string;
  count: number;
  timeSpentMs?: number;
  busiestHour?: number;
}

export const AnalyticsProvider: Provider<SiteStats[]> = {
  id: 'analytics',
  name: 'Browser Analytics',
  getData: async () => {
    // In production, analyze chrome.history data
    return fallbackAnalytics;
  },
  refresh: async () => {},
};
