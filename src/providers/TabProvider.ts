import { Provider } from '../lib/types';
import { fallbackTabs } from '../mockData/fallbackData';

export interface Tab {
  id: string;
  title: string;
  url: string;
}

export const TabProvider: Provider<Tab[]> = {
  id: 'tabs',
  name: 'Chrome Tabs',
  getData: async () => {
    return fallbackTabs;
  },
  refresh: async () => {
    // Logic to force update
  },
};
