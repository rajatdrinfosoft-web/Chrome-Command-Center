# Technical Architecture & Implementation Guide

## Chrome Command Center - Technical Specifications

---

# 1. Project Structure

```
chrome-command-center/
├── public/
│   ├── icons/
│   │   ├── icon-16.png
│   │   ├── icon-48.png
│   │   └── icon-128.png
│   ├── manifest.json (Manifest V3)
│   └── new-tab.html
│
├── src/
│   ├── background/
│   │   ├── service-worker.ts
│   │   ├── messaging.ts
│   │   └── event-handlers.ts
│   │
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── widgets/
│   │   │   ├── ClockWidget.tsx
│   │   │   ├── BookmarkWidget.tsx
│   │   │   ├── TabsWidget.tsx
│   │   │   ├── HistoryWidget.tsx
│   │   │   ├── TasksWidget.tsx
│   │   │   ├── NotesWidget.tsx
│   │   │   ├── DeveloperToolsWidget.tsx
│   │   │   ├── FocusWidget.tsx
│   │   │   ├── WorkspacesWidget.tsx
│   │   │   ├── QuickToolsWidget.tsx
│   │   │   ├── CalendarWidget.tsx (optional)
│   │   │   ├── WeatherWidget.tsx (optional)
│   │   │   ├── GitHubWidget.tsx (optional)
│   │   │   └── StatisticsWidget.tsx
│   │   ├── Dialogs/
│   │   │   ├── SearchDialog.tsx
│   │   │   ├── CommandPalette.tsx
│   │   │   ├── SettingsDialog.tsx
│   │   │   ├── TaskDialog.tsx
│   │   │   └── NoteDialog.tsx
│   │   └── Common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       └── Loading.tsx
│   │
│   ├── services/
│   │   ├── BookmarkService.ts
│   │   ├── TabService.ts
│   │   ├── HistoryService.ts
│   │   ├── SearchService.ts
│   │   ├── TaskService.ts
│   │   ├── NoteService.ts
│   │   ├── FocusService.ts
│   │   ├── WorkspaceService.ts
│   │   ├── StatisticsService.ts
│   │   └── AnalyticsService.ts
│   │
│   ├── providers/
│   │   ├── BookmarkProvider.ts
│   │   ├── TabProvider.ts
│   │   ├── HistoryProvider.ts
│   │   ├── SessionProvider.ts
│   │   ├── TaskProvider.ts
│   │   ├── NoteProvider.ts
│   │   ├── SettingsProvider.ts
│   │   ├── WorkspaceProvider.ts
│   │   ├── StatisticsProvider.ts
│   │   ├── CalendarProvider.ts (optional)
│   │   ├── WeatherProvider.ts (optional)
│   │   └── GitHubProvider.ts (optional)
│   │
│   ├── hooks/
│   │   ├── useProvider.ts
│   │   ├── useSettings.ts
│   │   ├── useWorkspace.ts
│   │   ├── useFocusMode.ts
│   │   ├── useSearch.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── stores/
│   │   ├── appStore.ts (Zustand)
│   │   ├── settingsStore.ts
│   │   ├── workspaceStore.ts
│   │   ├── focusStore.ts
│   │   └── statisticsStore.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── bookmark.ts
│   │   ├── tab.ts
│   │   ├── history.ts
│   │   ├── task.ts
│   │   ├── note.ts
│   │   ├── workspace.ts
│   │   ├── settings.ts
│   │   └── provider.ts
│   │
│   ├── utils/
│   │   ├── storage.ts
│   │   ├── messaging.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── comparators.ts
│   │   ├── search-utils.ts
│   │   └── date-utils.ts
│   │
│   ├── lib/
│   │   ├── lunr-index.ts (full-text search)
│   │   └── analytics.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── shortcuts.ts
│   │   ├── dev-tools-config.ts
│   │   └── defaults.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── animations.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── backend/ (Vercel Functions - Optional)
│   └── api/
│       ├── calendar.ts (optional)
│       ├── weather.ts (optional)
│       └── github.ts (optional)
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

---

# 2. Data Provider Architecture

Every feature uses a standardized provider interface:

```typescript
// types/provider.ts
export interface Provider<T> {
  id: string;
  name: string;
  status: 'idle' | 'loading' | 'error' | 'ready';
  permissions: string[];
  error?: string;

  initialize(): Promise<void>;
  getData(): Promise<T>;
  refresh(): Promise<void>;
  subscribe(callback: (data: T) => void): () => void;
  cleanup(): Promise<void>;
}

// Example implementation
class BookmarkProvider implements Provider<Bookmark[]> {
  id = 'bookmarks';
  name = 'Chrome Bookmarks';
  status: Provider['status'] = 'idle';
  permissions = ['bookmarks'];
  error?: string;

  private subscribers: Set<(data: Bookmark[]) => void> = new Set();

  async initialize(): Promise<void> {
    this.status = 'loading';
    try {
      const bookmarks = await this.loadBookmarks();
      this.notifySubscribers(bookmarks);
      this.status = 'ready';
    } catch (error) {
      this.error = error.message;
      this.status = 'error';
    }
  }

  async getData(): Promise<Bookmark[]> {
    return chrome.bookmarks.getTree();
  }

  async refresh(): Promise<void> {
    const data = await this.getData();
    this.notifySubscribers(data);
  }

  subscribe(callback: (data: Bookmark[]) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  cleanup(): Promise<void> {
    this.subscribers.clear();
    return Promise.resolve();
  }

  private notifySubscribers(data: Bookmark[]) {
    this.subscribers.forEach(callback => callback(data));
  }

  private async loadBookmarks(): Promise<Bookmark[]> {
    // Implementation
  }
}
```

---

# 3. State Management (Zustand)

Use Zustand for global state with local persistence:

```typescript
// stores/appStore.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // UI State
  currentWorkspace: string;
  theme: 'dark' | 'light' | 'auto';
  sidebarOpen: boolean;
  focusModeActive: boolean;

  // Data
  bookmarks: Bookmark[];
  tabs: Tab[];
  history: HistoryEntry[];
  tasks: Task[];
  notes: Note[];
  workspaces: Workspace[];

  // Actions
  setCurrentWorkspace: (workspaceId: string) => void;
  setTheme: (theme: 'dark' | 'light' | 'auto') => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  // ... more actions
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentWorkspace: 'default',
      theme: 'dark',
      sidebarOpen: true,
      focusModeActive: false,
      bookmarks: [],
      tabs: [],
      history: [],
      tasks: [],
      notes: [],
      workspaces: [],

      setCurrentWorkspace: (workspaceId) => set({ currentWorkspace: workspaceId }),
      setTheme: (theme) => set({ theme }),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t
          ),
        })),
      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        })),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

---

# 4. Service Layer

Services handle business logic:

```typescript
// services/TaskService.ts
import { Task } from '@/types';
import { TaskProvider } from '@/providers/TaskProvider';

export class TaskService {
  constructor(private provider: TaskProvider) {}

  async getTasks(): Promise<Task[]> {
    return this.provider.getData();
  }

  async addTask(title: string, priority: 'high' | 'medium' | 'low'): Promise<Task> {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      priority,
      status: 'todo',
      createdAt: new Date(),
      dueDate: null,
      tags: [],
      workspaceId: 'default',
    };

    await this.provider.addTask(task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    await this.provider.updateTask(id, updates);
  }

  async deleteTask(id: string): Promise<void> {
    await this.provider.deleteTask(id);
  }

  async completeTask(id: string): Promise<void> {
    await this.updateTask(id, { status: 'done', completedAt: new Date() });
  }

  getTodaysTasks(tasks: Task[]): Task[] {
    const today = new Date().toDateString();
    return tasks.filter(
      (t) =>
        t.dueDate?.toDateString() === today &&
        (t.status === 'todo' || t.status === 'in-progress')
    );
  }

  getTasksByPriority(tasks: Task[], priority: string): Task[] {
    return tasks.filter((t) => t.priority === priority && t.status !== 'done');
  }
}
```

---

# 5. Custom Hooks

```typescript
// hooks/useProvider.ts
import { useState, useEffect } from 'react';
import { Provider } from '@/types';

export function useProvider<T>(provider: Provider<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        await provider.initialize();
        const initialData = await provider.getData();
        if (isMounted) {
          setData(initialData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    // Subscribe to updates
    const unsubscribe = provider.subscribe((newData) => {
      if (isMounted) {
        setData(newData);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      provider.cleanup();
    };
  }, [provider]);

  return { data, loading, error };
}

// hooks/useSettings.ts
import { useAppStore } from '@/stores/appStore';

export function useSettings() {
  const store = useAppStore();

  return {
    theme: store.theme,
    setTheme: store.setTheme,
    currentWorkspace: store.currentWorkspace,
    setCurrentWorkspace: store.setCurrentWorkspace,
    // ... more settings
  };
}
```

---

# 6. Chrome Extension Messaging

```typescript
// background/service-worker.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, payload } = message;

  switch (type) {
    case 'GET_BOOKMARKS':
      handleGetBookmarks(sendResponse);
      break;

    case 'GET_TABS':
      handleGetTabs(sendResponse);
      break;

    case 'GET_HISTORY':
      handleGetHistory(payload, sendResponse);
      break;

    case 'CLOSE_TAB':
      handleCloseTab(payload.tabId);
      break;

    case 'SWITCH_TAB':
      handleSwitchTab(payload.tabId);
      break;

    case 'BLOCK_SITE':
      handleBlockSite(payload.domain);
      break;

    default:
      sendResponse({ error: 'Unknown message type' });
  }

  return true; // Keep channel open for async response
});

async function handleGetBookmarks(sendResponse: (data: any) => void) {
  try {
    const bookmarks = await chrome.bookmarks.getTree();
    sendResponse({ success: true, data: bookmarks });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

async function handleGetTabs(sendResponse: (data: any) => void) {
  try {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    sendResponse({ success: true, data: tabs });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

async function handleGetHistory(
  payload: { days: number },
  sendResponse: (data: any) => void
) {
  try {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const startTime = Date.now() - payload.days * millisecondsPerDay;

    const history = await chrome.history.search({
      text: '',
      startTime,
      maxResults: 1000,
    });

    sendResponse({ success: true, data: history });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

async function handleCloseTab(tabId: number) {
  await chrome.tabs.remove(tabId);
}

async function handleSwitchTab(tabId: number) {
  await chrome.tabs.update(tabId, { active: true });
}

async function handleBlockSite(domain: string) {
  // Store blocked sites and redirect on navigation
  const blocked = (await chrome.storage.local.get('blockedSites')).blockedSites || [];
  blocked.push(domain);
  await chrome.storage.local.set({ blockedSites: blocked });
}
```

```typescript
// utils/messaging.ts
export interface Message<T = any> {
  type: string;
  payload?: T;
}

export async function sendMessage<R = any>(message: Message): Promise<R> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else if (response?.success === false) {
        reject(new Error(response.error));
      } else {
        resolve(response.data);
      }
    });
  });
}
```

---

# 7. Search Implementation (Lunr.js)

```typescript
// lib/lunr-index.ts
import * as lunr from 'lunr';

interface SearchableItem {
  id: string;
  type: 'bookmark' | 'history' | 'note' | 'task';
  title: string;
  body: string;
  url?: string;
  tags?: string[];
}

export class SearchEngine {
  private index: lunr.Index | null = null;
  private documents: Map<string, SearchableItem> = new Map();

  buildIndex(items: SearchableItem[]): void {
    this.documents.clear();
    items.forEach((item) => this.documents.set(item.id, item));

    this.index = lunr.Index.load(
      lunr((idx) => {
        idx.ref('id');
        idx.field('title', { boost: 10 });
        idx.field('body');
        idx.field('url');
        idx.field('tags');

        items.forEach((item) => idx.add(item));
      })
    );
  }

  search(query: string, type?: string): SearchableItem[] {
    if (!this.index) return [];

    const results = this.index.search(query);
    const items = results
      .map((result) => this.documents.get(result.ref))
      .filter((item): item is SearchableItem => item !== undefined);

    if (type) {
      return items.filter((item) => item.type === type);
    }

    return items;
  }

  addItem(item: SearchableItem): void {
    this.documents.set(item.id, item);
    // Rebuild index when items change
    this.buildIndex(Array.from(this.documents.values()));
  }

  removeItem(id: string): void {
    this.documents.delete(id);
    this.buildIndex(Array.from(this.documents.values()));
  }
}
```

---

# 8. Local Storage Strategy

Use IndexedDB for large datasets, localStorage for small settings:

```typescript
// utils/storage.ts
import Dexie, { Table } from 'dexie';

export class AppDatabase extends Dexie {
  bookmarks!: Table<Bookmark>;
  history!: Table<HistoryEntry>;
  tasks!: Table<Task>;
  notes!: Table<Note>;
  workspaces!: Table<Workspace>;

  constructor() {
    super('CommandCenterDB');
    this.version(1).stores({
      bookmarks: 'id, folderId',
      history: 'id, url, visitTime',
      tasks: 'id, workspaceId, status',
      notes: 'id, workspaceId, createdAt',
      workspaces: 'id, name',
    });
  }
}

export const db = new AppDatabase();

// Settings use localStorage
export const storage = {
  getSettings: () => JSON.parse(localStorage.getItem('settings') || '{}'),
  setSettings: (settings: any) => localStorage.setItem('settings', JSON.stringify(settings)),
  getTheme: () => localStorage.getItem('theme') || 'dark',
  setTheme: (theme: string) => localStorage.setItem('theme', theme),
};
```

---

# 9. Focus Mode Implementation

```typescript
// services/FocusService.ts
export class FocusService {
  private blockedDomains: Set<string> = new Set();
  private focusTimer: NodeJS.Timeout | null = null;

  async startFocusSession(duration: number, blockedSites: string[]) {
    this.blockedDomains = new Set(blockedSites);
    
    // Save to storage
    await chrome.storage.local.set({
      focusMode: {
        active: true,
        startTime: Date.now(),
        duration,
        blockedDomains: blockedSites,
      },
    });

    // Set up alarms
    chrome.alarms.create('focusTimer', { delayInMinutes: duration / 60 });

    // Set up content script blocking
    this.setupBlockingRules();

    // Track statistics
    this.trackFocusSession(duration);
  }

  async stopFocusSession() {
    chrome.alarms.clear('focusTimer');
    await chrome.storage.local.set({ focusMode: { active: false } });
    this.clearBlockingRules();
  }

  private setupBlockingRules() {
    chrome.webRequest.onBeforeRequest.addListener(
      (details) => {
        const url = new URL(details.url);
        if (this.blockedDomains.has(url.hostname)) {
          return { redirectUrl: 'data:text/html,<h1>Focus Mode Active</h1>' };
        }
      },
      { urls: ['<all_urls>'] },
      ['blocking']
    );
  }

  private clearBlockingRules() {
    chrome.webRequest.onBeforeRequest.removeListener(() => {});
  }

  private trackFocusSession(duration: number) {
    db.tasks.where('status').equals('in-progress').toArray().then((tasks) => {
      // Log focus session statistics
      chrome.storage.local.get('focusStats', (result) => {
        const stats = result.focusStats || [];
        stats.push({
          timestamp: Date.now(),
          duration,
          tasksActive: tasks.length,
        });
        chrome.storage.local.set({ focusStats: stats });
      });
    });
  }
}
```

---

# 10. Workspace System

```typescript
// services/WorkspaceService.ts
export class WorkspaceService {
  async createWorkspace(name: string, icon?: string): Promise<Workspace> {
    const workspace: Workspace = {
      id: crypto.randomUUID(),
      name,
      icon: icon || '📁',
      bookmarks: [],
      tasks: [],
      notes: [],
      settings: {},
      createdAt: new Date(),
    };

    await db.workspaces.add(workspace);
    return workspace;
  }

  async switchWorkspace(workspaceId: string) {
    await chrome.storage.local.set({ currentWorkspace: workspaceId });
  }

  async getWorkspaceData(workspaceId: string) {
    const workspace = await db.workspaces.get(workspaceId);
    const tasks = await db.tasks.where('workspaceId').equals(workspaceId).toArray();
    const notes = await db.notes.where('workspaceId').equals(workspaceId).toArray();

    return {
      workspace,
      tasks,
      notes,
    };
  }

  async deleteWorkspace(workspaceId: string) {
    await db.workspaces.delete(workspaceId);
    await db.tasks.where('workspaceId').equals(workspaceId).delete();
    await db.notes.where('workspaceId').equals(workspaceId).delete();
  }
}
```

---

# 11. Statistics Service

```typescript
// services/StatisticsService.ts
export class StatisticsService {
  async getTopDomains(days: number = 30): Promise<DomainStats[]> {
    const history = await db.history
      .where('visitTime')
      .above(Date.now() - days * 24 * 60 * 60 * 1000)
      .toArray();

    const domainMap = new Map<string, number>();

    history.forEach((entry) => {
      if (entry.url) {
        const url = new URL(entry.url);
        const domain = url.hostname;
        domainMap.set(domain, (domainMap.get(domain) || 0) + 1);
      }
    });

    return Array.from(domainMap.entries())
      .map(([domain, visits]) => ({ domain, visits }))
      .sort((a, b) => b.visits - a.visits);
  }

  async getHourlyActivity(): Promise<number[]> {
    const activity = new Array(24).fill(0);
    const history = await db.history.toArray();

    history.forEach((entry) => {
      const hour = new Date(entry.visitTime).getHours();
      activity[hour]++;
    });

    return activity;
  }

  async getTaskCompletionRate(): Promise<number> {
    const tasks = await db.tasks.toArray();
    const completed = tasks.filter((t) => t.status === 'done').length;
    return tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
  }

  async getFocusStats() {
    const stats = (await chrome.storage.local.get('focusStats')).focusStats || [];
    return {
      totalSessions: stats.length,
      totalTime: stats.reduce((sum: number, s: any) => sum + s.duration, 0),
      longestSession: Math.max(...stats.map((s: any) => s.duration)),
      averageSession:
        stats.length > 0
          ? stats.reduce((sum: number, s: any) => sum + s.duration, 0) / stats.length
          : 0,
    };
  }
}
```

---

# 12. React Components (Example Widget)

```typescript
// components/widgets/BookmarkWidget.tsx
import { useProvider } from '@/hooks/useProvider';
import { BookmarkProvider } from '@/providers/BookmarkProvider';
import { BookmarkService } from '@/services/BookmarkService';
import { useState } from 'react';

interface BookmarkWidgetProps {
  provider: BookmarkProvider;
  service: BookmarkService;
}

export function BookmarkWidget({ provider, service }: BookmarkWidgetProps) {
  const { data: bookmarks, loading, error } = useProvider(provider);
  const [searchQuery, setSearchQuery] = useState('');

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 text-red-300 rounded">
        Error loading bookmarks: {error}
      </div>
    );
  }

  if (loading) {
    return <div className="p-4 text-gray-400">Loading bookmarks...</div>;
  }

  const filtered = bookmarks?.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700"
        />
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-gray-400 text-sm">No bookmarks found</div>
        ) : (
          filtered.map((bookmark) => (
            <a
              key={bookmark.id}
              href={bookmark.url}
              className="block p-2 rounded hover:bg-gray-700 text-sm hover:text-white transition"
            >
              {bookmark.title || bookmark.url}
            </a>
          ))
        )}
      </div>
    </div>
  );
}
```

---

# 13. Developer Tools Implementation

```typescript
// components/widgets/DeveloperToolsWidget.tsx
import { useState } from 'react';

export function DeveloperToolsWidget() {
  const [activeTool, setActiveTool] = useState<'json' | 'jwt' | 'base64' | 'url' | 'regex'>('json');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['json', 'jwt', 'base64', 'url', 'regex'].map((tool) => (
          <button
            key={tool}
            onClick={() => setActiveTool(tool as any)}
            className={`px-3 py-1 rounded text-sm ${
              activeTool === tool ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {tool.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTool === 'json' && <JSONTool />}
      {activeTool === 'jwt' && <JWTTool />}
      {activeTool === 'base64' && <Base64Tool />}
      {activeTool === 'url' && <URLTool />}
      {activeTool === 'regex' && <RegexTool />}
    </div>
  );
}

function JSONTool() {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setFormatted(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON here..."
        className="w-full h-24 p-2 bg-gray-800 text-white rounded font-mono text-sm"
      />
      <button
        onClick={handleFormat}
        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
      >
        Format
      </button>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {formatted && (
        <>
          <textarea
            value={formatted}
            readOnly
            className="w-full h-24 p-2 bg-gray-800 text-white rounded font-mono text-sm"
          />
          <button
            onClick={() => navigator.clipboard.writeText(formatted)}
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm"
          >
            Copy
          </button>
        </>
      )}
    </div>
  );
}

// Similar implementations for JWT, Base64, URL, Regex tools...
```

---

# 14. Build Configuration (Vite)

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
  },
});
```

---

# 15. TypeScript Type Definitions

```typescript
// types/index.ts
export interface Bookmark {
  id: string;
  parentId?: string;
  title: string;
  url?: string;
  dateAdded: number;
  children?: Bookmark[];
}

export interface Tab {
  id: number;
  windowId: number;
  index: number;
  url: string;
  title: string;
  active: boolean;
  favIconUrl?: string;
}

export interface HistoryEntry {
  id: string;
  url: string;
  title: string;
  lastVisitTime: number;
  visitCount: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: Date;
  completedAt?: Date;
  tags: string[];
  workspaceId: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  markdown: boolean;
  tags: string[];
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  icon: string;
  bookmarks: Bookmark[];
  tasks: Task[];
  notes: Note[];
  settings: Record<string, any>;
  createdAt: Date;
}

export interface Settings {
  theme: 'dark' | 'light' | 'auto';
  layout: 'minimal' | 'productivity' | 'developer' | 'focus' | 'custom';
  enabledWidgets: string[];
  shortcuts: Record<string, string>;
  focusBlockedSites: string[];
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export interface Statistics {
  topDomains: DomainStats[];
  hourlyActivity: number[];
  taskCompletionRate: number;
  focusStats: FocusStats;
  totalBookmarks: number;
  totalNotes: number;
}

export interface DomainStats {
  domain: string;
  visits: number;
  timeSpent?: number;
}

export interface FocusStats {
  totalSessions: number;
  totalTime: number;
  longestSession: number;
  averageSession: number;
}
```

---

# 16. Testing Strategy

```typescript
// tests/unit/services/BookmarkService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BookmarkService } from '@/services/BookmarkService';
import { BookmarkProvider } from '@/providers/BookmarkProvider';

describe('BookmarkService', () => {
  let service: BookmarkService;
  let provider: BookmarkProvider;

  beforeEach(() => {
    provider = new BookmarkProvider();
    service = new BookmarkService(provider);
  });

  it('should retrieve bookmarks', async () => {
    const bookmarks = await service.getBookmarks();
    expect(Array.isArray(bookmarks)).toBe(true);
  });

  it('should add bookmark', async () => {
    const bookmark = await service.addBookmark({
      title: 'Test',
      url: 'https://example.com',
    });
    expect(bookmark.id).toBeDefined();
  });

  it('should find bookmarks by title', async () => {
    await service.addBookmark({ title: 'GitHub', url: 'https://github.com' });
    const results = service.findByTitle('GitHub');
    expect(results).toHaveLength(1);
  });
});
```

---

# 17. Deployment to Vercel

```bash
# .env.local (for optional backend features)
NEXT_PUBLIC_API_URL=http://localhost:3000
CALENDAR_API_KEY=your_key
WEATHER_API_KEY=your_key

# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

---

# 18. Development Workflow

1. **Setup**: `npm install && npm run dev`
2. **Chrome Extension**: Load `dist/` as unpacked extension
3. **Testing**: `npm run test`
4. **Build**: `npm run build`
5. **Deploy**: Push to GitHub, Vercel auto-deploys

---

# 19. Performance Optimization

- Lazy load widgets
- Cache bookmark/history data in IndexedDB
- Use virtual scrolling for large lists
- Debounce search input
- Code splitting for production
- Minify and compress assets

---

# 20. Security Considerations

- Validate all user inputs
- Sanitize HTML in notes
- Use Content Security Policy
- Never send browser data externally
- Validate extension messages
- Keep dependencies updated
