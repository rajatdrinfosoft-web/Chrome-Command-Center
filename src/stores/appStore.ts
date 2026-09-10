import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  theme: 'dark' | 'light' | 'auto';
  setTheme: (theme: 'dark' | 'light' | 'auto') => void;
  currentWorkspace: string;
  setCurrentWorkspace: (workspaceId: string) => void;
  enabledWidgets: string[];
  setEnabledWidgets: (widgets: string[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      currentWorkspace: 'default',
      setCurrentWorkspace: (workspaceId) => set({ currentWorkspace: workspaceId }),
      enabledWidgets: ['clock', 'search', 'tasks', 'notes', 'bookmarks', 'tabs', 'history', 'recentlyClosed', 'pomodoro', 'analytics', 'sessionHeatmap'],
      setEnabledWidgets: (widgets) => set({ enabledWidgets: widgets }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
