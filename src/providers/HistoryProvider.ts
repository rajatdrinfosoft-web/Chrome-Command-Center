import { Provider } from '../lib/types';

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
}

export const HistoryProvider: Provider<HistoryItem[]> = {
  id: 'history',
  name: 'Chrome History',
  getData: async () => {
    return [
      { id: '1', title: 'How to use Tailwind CSS', url: 'https://tailwindcss.com/docs' },
      { id: '2', title: 'Advanced React Patterns', url: 'https://react.dev/patterns' },
      { id: '3', title: 'Chrome Extension APIs', url: 'https://developer.chrome.com' },
      { id: '4', title: 'TypeScript Best Practices', url: 'https://typescriptlang.org' },
    ];
  },
  refresh: async () => {
    // Logic to force update
  },
};
