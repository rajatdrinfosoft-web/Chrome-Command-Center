import { Provider } from '../lib/types';

export interface Tab {
  id: string;
  title: string;
  url: string;
}

export const TabProvider: Provider<Tab[]> = {
  id: 'tabs',
  name: 'Chrome Tabs',
  getData: async () => {
    return [
      { id: '1', title: 'Product Specification', url: 'https://ais-dev.run.app/guide/spec' },
      { id: '2', title: 'Technical Architecture', url: 'https://ais-dev.run.app/guide/tech' },
      { id: '3', title: 'GitHub Issue #42', url: 'https://github.com/issues/42' },
      { id: '4', title: 'Figma Design', url: 'https://figma.com/design' },
      { id: '5', title: 'Calendar Meeting', url: 'https://meet.google.com' },
    ];
  },
  refresh: async () => {
    // Logic to force update
  },
};
