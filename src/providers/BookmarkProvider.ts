import { Provider } from '../types/provider';

export interface Bookmark {
  id: string;
  parentId?: string;
  title: string;
  url?: string;
  children?: Bookmark[];
}

import { Provider } from '../types/provider';

export interface Bookmark {
  id: string;
  parentId?: string;
  title: string;
  url?: string;
  children?: Bookmark[];
}

export const BookmarkProvider: Provider<Bookmark[]> = {
  id: 'bookmarks',
  name: 'Chrome Bookmarks',
  status: 'idle',
  permissions: ['bookmarks'],
  
  initialize: async () => {},
  
  getData: async () => {
    return [
      { id: '1', title: 'GitHub', url: 'https://github.com' },
      { id: '2', title: 'React Documentation', url: 'https://react.dev' },
      { id: '3', title: 'Tailwind CSS', url: 'https://tailwindcss.com' },
      { id: '4', title: 'Figma', url: 'https://figma.com' },
      { id: '5', title: 'Google Calendar', url: 'https://calendar.google.com' },
    ];
  },

  refresh: async () => {},

  subscribe: (callback: (data: Bookmark[]) => void) => {
    return () => {};
  },

  cleanup: async () => {},
};
