import { Tab } from './TabProvider';

export interface BrowserSession {
  id: string;
  name: string;
  createdAt: number;
  tabs: Tab[];
}

const STORAGE_KEY = 'command-center:sessions';

export const SessionProvider = {
  getData: async (): Promise<BrowserSession[]> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) as BrowserSession[] : [];
    } catch {
      return [];
    }
  },
  save: async (name: string, tabs: Tab[]) => {
    const sessions = await SessionProvider.getData();
    const session: BrowserSession = {
      id: `session-${Date.now()}`,
      name: name.trim() || `Session ${sessions.length + 1}`,
      createdAt: Date.now(),
      tabs,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([session, ...sessions].slice(0, 20)));
    return session;
  },
  remove: async (id: string) => {
    const sessions = await SessionProvider.getData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.filter((session) => session.id !== id)));
  },
};
