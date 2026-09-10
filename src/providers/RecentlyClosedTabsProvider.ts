import { Provider } from '../lib/types';

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
    return [
      { id: '1', title: 'Product Specification', url: '#' },
      { id: '2', title: 'Dashboard Planning', url: '#' },
    ];
  },
  refresh: async () => {},
};
