import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Workspace {
  id: string;
  name: string;
  color: string;
  enabledWidgets?: string[];
  widgetOrder?: string[];
}

export interface FocusSession {
  id: string;
  startedAt: number;
  endedAt: number;
  durationMinutes: number;
  blockedSites: string[];
}

export type CommandAction = 'focus-search' | 'settings' | 'toggle-widgets' | 'reload';

export interface CustomCommand {
  id: string;
  label: string;
  shortcut: string;
  action: CommandAction;
}

export type ThemeMode = 'dark' | 'light' | 'auto';
export type BackgroundMode = 'charcoal' | 'midnight' | 'custom';

export interface LayoutPreset {
  id: string;
  name: string;
  widgetOrder: string[];
}

interface AppState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  backgroundMode: BackgroundMode;
  setBackgroundMode: (mode: BackgroundMode) => void;
  customBackground: string;
  setCustomBackground: (value: string) => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  currentWorkspace: string;
  setCurrentWorkspace: (workspaceId: string) => void;
  workspaces: Workspace[];
  createWorkspace: (name: string) => void;
  renameWorkspace: (workspaceId: string, name: string) => void;
  deleteWorkspace: (workspaceId: string) => void;
  enabledWidgets: string[];
  setEnabledWidgets: (widgets: string[]) => void;
  widgetOrder: string[];
  setWidgetOrder: (widgets: string[]) => void;
  layoutPresets: LayoutPreset[];
  saveLayoutPreset: (name: string) => void;
  applyLayoutPreset: (presetId: string) => void;
  removeLayoutPreset: (presetId: string) => void;
  focusMode: boolean;
  setFocusMode: (value: boolean) => void;
  blockedSites: string[];
  addBlockedSite: (site: string) => void;
  removeBlockedSite: (site: string) => void;
  focusSessions: FocusSession[];
  startFocusSession: (durationMinutes: number, blockedSites?: string[]) => void;
  endFocusSession: (durationMinutes?: number) => void;
  keyboardShortcuts: {
    openPalette: string;
    focusSearch: string;
  };
  setKeyboardShortcut: (key: 'openPalette' | 'focusSearch', value: string) => void;
  vimMode: boolean;
  setVimMode: (value: boolean) => void;
  customCommands: CustomCommand[];
  addCustomCommand: (command: Omit<CustomCommand, 'id'>) => void;
  removeCustomCommand: (commandId: string) => void;
  searchQueries: string[];
  recordSearchQuery: (query: string) => void;
}

const createWorkspaceId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `workspace-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const defaultWorkspaces: Workspace[] = [
  { 
    id: 'default', 
    name: 'Default', 
    color: '#22d3ee',
    enabledWidgets: ['clock', 'search', 'workspaces', 'calendar', 'weather', 'recentWork', 'tasks', 'notes', 'bookmarks', 'tabs', 'history', 'recentlyClosed', 'pomodoro', 'analytics', 'sessionHeatmap', 'quickTools', 'statistics', 'sessions', 'tabGroups', 'github', 'extensionInfo'],
    widgetOrder: ['workspaces', 'calendar', 'weather', 'recentWork', 'bookmarks', 'tabs', 'tasks', 'notes', 'history', 'recentlyClosed', 'pomodoro', 'analytics', 'sessionHeatmap', 'quickTools', 'statistics', 'sessions', 'tabGroups', 'github', 'extensionInfo']
  },
  { 
    id: 'work', 
    name: 'Work', 
    color: '#a78bfa',
    enabledWidgets: ['clock', 'search', 'workspaces', 'calendar', 'recentWork', 'tasks', 'pomodoro', 'notes', 'analytics', 'statistics', 'github'],
    widgetOrder: ['workspaces', 'calendar', 'recentWork', 'tasks', 'pomodoro', 'notes', 'analytics', 'statistics', 'github']
  },
  { 
    id: 'personal', 
    name: 'Personal', 
    color: '#34d399',
    enabledWidgets: ['clock', 'search', 'workspaces', 'bookmarks', 'tabs', 'history', 'recentlyClosed', 'quickTools', 'sessions'],
    widgetOrder: ['workspaces', 'bookmarks', 'tabs', 'history', 'recentlyClosed', 'quickTools', 'sessions']
  },
];

const defaultBlockedSites = ['youtube.com', 'reddit.com', 'x.com'];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      accentColor: '#22d3ee',
      setAccentColor: (accentColor) => set({ accentColor }),
      backgroundMode: 'charcoal',
      setBackgroundMode: (backgroundMode) => set({ backgroundMode }),
      customBackground: '',
      setCustomBackground: (customBackground) => set({ customBackground }),
      reducedMotion: false,
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      currentWorkspace: 'default',
      setCurrentWorkspace: (workspaceId) => set((state) => {
        const workspace = state.workspaces.find(w => w.id === workspaceId);
        if (!workspace) return { currentWorkspace: workspaceId };
        
        const defaultEnabled = ['clock', 'search', 'workspaces', 'calendar', 'weather', 'recentWork', 'tasks', 'notes', 'bookmarks', 'tabs', 'history', 'recentlyClosed', 'pomodoro', 'analytics', 'sessionHeatmap', 'quickTools', 'statistics', 'sessions', 'tabGroups', 'github', 'extensionInfo'];
        const defaultOrder = ['workspaces', 'calendar', 'weather', 'recentWork', 'bookmarks', 'tabs', 'tasks', 'notes', 'history', 'recentlyClosed', 'pomodoro', 'analytics', 'sessionHeatmap', 'quickTools', 'statistics', 'sessions', 'tabGroups', 'github', 'extensionInfo'];

        return { 
          currentWorkspace: workspaceId,
          enabledWidgets: workspace.enabledWidgets || defaultEnabled,
          widgetOrder: workspace.widgetOrder || defaultOrder
        };
      }),
      workspaces: defaultWorkspaces,
      createWorkspace: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;

        const defaultEnabled = ['clock', 'search', 'workspaces', 'calendar', 'weather', 'recentWork', 'tasks', 'notes', 'bookmarks', 'tabs', 'history', 'recentlyClosed', 'pomodoro', 'analytics', 'sessionHeatmap', 'quickTools', 'statistics', 'sessions', 'tabGroups', 'github', 'extensionInfo'];
        const defaultOrder = ['workspaces', 'calendar', 'weather', 'recentWork', 'bookmarks', 'tabs', 'tasks', 'notes', 'history', 'recentlyClosed', 'pomodoro', 'analytics', 'sessionHeatmap', 'quickTools', 'statistics', 'sessions', 'tabGroups', 'github', 'extensionInfo'];

        const workspace: Workspace = {
          id: createWorkspaceId(),
          name: trimmed,
          color: ['#22d3ee', '#a78bfa', '#f59e0b', '#34d399', '#f472b6'][Math.floor(Math.random() * 5)],
          enabledWidgets: defaultEnabled,
          widgetOrder: defaultOrder,
        };

        set((state) => ({
          workspaces: [...state.workspaces, workspace],
          currentWorkspace: workspace.id,
          enabledWidgets: defaultEnabled,
          widgetOrder: defaultOrder,
        }));
      },
      renameWorkspace: (workspaceId, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;

        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId ? { ...workspace, name: trimmed } : workspace
          ),
        }));
      },
      deleteWorkspace: (workspaceId) => {
        set((state) => {
          const nextWorkspaces = state.workspaces.filter((workspace) => workspace.id !== workspaceId);
          const fallbackWorkspace = nextWorkspaces[0]?.id ?? 'default';
          
          const targetWorkspace = nextWorkspaces.find(w => w.id === fallbackWorkspace);

          return {
            workspaces: nextWorkspaces.length ? nextWorkspaces : defaultWorkspaces,
            currentWorkspace: state.currentWorkspace === workspaceId ? fallbackWorkspace : state.currentWorkspace,
            ...(state.currentWorkspace === workspaceId ? { enabledWidgets: targetWorkspace?.enabledWidgets || ['clock', 'search', 'workspaces', 'calendar', 'weather', 'recentWork', 'tasks', 'notes', 'bookmarks', 'tabs', 'history', 'recentlyClosed', 'pomodoro', 'analytics', 'sessionHeatmap', 'quickTools', 'statistics', 'sessions', 'tabGroups', 'github', 'extensionInfo'] } : {}),
            ...(state.currentWorkspace === workspaceId ? { widgetOrder: targetWorkspace?.widgetOrder || ['workspaces', 'calendar', 'weather', 'recentWork', 'bookmarks', 'tabs', 'tasks', 'notes', 'history', 'recentlyClosed', 'pomodoro', 'analytics', 'sessionHeatmap', 'quickTools', 'statistics', 'sessions', 'tabGroups', 'github', 'extensionInfo'] } : {})
          };
        });
      },
      enabledWidgets: ['clock', 'search', 'workspaces', 'calendar', 'weather', 'recentWork', 'tasks', 'notes', 'bookmarks', 'tabs', 'history', 'recentlyClosed', 'pomodoro', 'analytics', 'sessionHeatmap', 'quickTools', 'statistics', 'sessions', 'tabGroups', 'github', 'extensionInfo'],
      setEnabledWidgets: (widgets) => set((state) => ({ 
        enabledWidgets: widgets,
        workspaces: state.workspaces.map(w => w.id === state.currentWorkspace ? { ...w, enabledWidgets: widgets } : w)
      })),
      widgetOrder: ['workspaces', 'calendar', 'weather', 'recentWork', 'bookmarks', 'tabs', 'tasks', 'notes', 'history', 'recentlyClosed', 'pomodoro', 'analytics', 'sessionHeatmap', 'quickTools', 'statistics', 'sessions', 'tabGroups', 'github', 'extensionInfo'],
      setWidgetOrder: (widgets) => set((state) => ({ 
        widgetOrder: widgets,
        workspaces: state.workspaces.map(w => w.id === state.currentWorkspace ? { ...w, widgetOrder: widgets } : w)
      })),
      layoutPresets: [],
      saveLayoutPreset: (name) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        set((state) => ({
          layoutPresets: [...state.layoutPresets, { id: `layout-${Date.now()}`, name: trimmedName, widgetOrder: state.widgetOrder }].slice(-10),
        }));
      },
      applyLayoutPreset: (presetId) => {
        set((state) => {
          const preset = state.layoutPresets.find((item) => item.id === presetId);
          return preset ? { widgetOrder: preset.widgetOrder, enabledWidgets: [...new Set(['clock', 'search', ...preset.widgetOrder])] } : state;
        });
      },
      removeLayoutPreset: (presetId) => set((state) => ({ layoutPresets: state.layoutPresets.filter((preset) => preset.id !== presetId) })),
      focusMode: false,
      setFocusMode: (value) => set({ focusMode: value }),
      blockedSites: defaultBlockedSites,
      addBlockedSite: (site) => {
        const normalizedSite = site.trim().toLowerCase();
        if (!normalizedSite) return;

        set((state) => ({
          blockedSites: state.blockedSites.includes(normalizedSite)
            ? state.blockedSites
            : [...state.blockedSites, normalizedSite],
        }));
      },
      removeBlockedSite: (site) => {
        set((state) => ({
          blockedSites: state.blockedSites.filter((item) => item !== site),
        }));
      },
      focusSessions: [],
      startFocusSession: (durationMinutes, blockedSites = []) => {
        set({
          focusMode: true,
          blockedSites: blockedSites.length ? [...new Set(blockedSites)] : defaultBlockedSites,
        });
      },
      endFocusSession: (durationMinutes = 25) => {
        set((state) => ({
          focusMode: false,
          focusSessions: [
            {
              id: `focus-${Date.now()}`,
              startedAt: Date.now() - durationMinutes * 60 * 1000,
              endedAt: Date.now(),
              durationMinutes,
              blockedSites: state.blockedSites,
            },
            ...state.focusSessions,
          ].slice(0, 20),
        }));
      },
      keyboardShortcuts: {
        openPalette: 'mod+k',
        focusSearch: '/',
      },
      setKeyboardShortcut: (key, value) => {
        set((state) => ({
          keyboardShortcuts: { ...state.keyboardShortcuts, [key]: value.trim().toLowerCase() },
        }));
      },
      vimMode: false,
      setVimMode: (value) => set({ vimMode: value }),
      customCommands: [],
      addCustomCommand: (command) => {
        const label = command.label.trim();
        const shortcut = command.shortcut.trim().toLowerCase();
        if (!label || !shortcut) return;

        set((state) => ({
          customCommands: [
            ...state.customCommands,
            { ...command, id: `custom-${Date.now()}`, label, shortcut },
          ],
        }));
      },
      removeCustomCommand: (commandId) => {
        set((state) => ({ customCommands: state.customCommands.filter(({ id }) => id !== commandId) }));
      },
      searchQueries: [],
      recordSearchQuery: (query) => {
        const normalizedQuery = query.trim();
        if (!normalizedQuery) return;
        set((state) => ({
          searchQueries: [normalizedQuery, ...state.searchQueries.filter((item) => item !== normalizedQuery)].slice(0, 50),
        }));
      },
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
