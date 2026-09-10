import { Provider } from '../lib/types';

export interface SiteStats {
  url: string;
  count: number;
}

export const AnalyticsProvider: Provider<SiteStats[]> = {
  id: 'analytics',
  name: 'Browser Analytics',
  getData: async () => {
    // In production, analyze chrome.history data
    return [
      { url: 'google.com', count: 42 },
      { url: 'github.com', count: 28 },
    ];
  },
  refresh: async () => {},
};
