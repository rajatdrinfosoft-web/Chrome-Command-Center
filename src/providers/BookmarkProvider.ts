import type { Provider } from '../types/provider';
import { fallbackBookmarks } from '../mockData/fallbackData';

export interface Bookmark {
  id: string;
  parentId?: string;
  title: string;
  url?: string;
  children?: Bookmark[];
  category?: string;
  usageCount?: number;
  lastUsed?: number;
  status?: 'active' | 'dead';
  isFolder?: boolean;
}

export const BookmarkProvider: Provider<Bookmark[]> = {
  id: 'bookmarks',
  name: 'Chrome Bookmarks',
  status: 'idle',
  permissions: ['bookmarks'],

  initialize: async () => {},

  getData: async () => {
    return fallbackBookmarks.map((bookmark) => ({
      ...bookmark,
      children: [],
    }));
  },

  refresh: async () => {},

  subscribe: (callback: (data: Bookmark[]) => void) => {
    return () => {};
  },

  cleanup: async () => {},
};
