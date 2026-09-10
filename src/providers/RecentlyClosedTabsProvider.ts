import { Provider } from '../lib/types';
import { fallbackRecentlyClosedTabs } from '../mockData/fallbackData';

export interface ClosedTab {
  id: string;
  title: string;
  url: string;
}

export const RecentlyClosedTabsProvider: Provider<ClosedTab[]> = {
  id: 'recentlyClosed',
  name: 'Recently Closed Tabs',
  getData: async () => {
    // In production extension, call: chrome.sessions.getRecentlyClosed(...)
    return fallbackRecentlyClosedTabs;
  },
  refresh: async () => {},
};
