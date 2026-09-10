# Chrome Command Center - Features Implementation Guide

---

# Features List & Implementation Priority

## Phase 1: MVP (Weeks 1-4)

### 1. Clock & Time Widget ✅
- **Complexity**: Easy
- **Time**: 1-2 hours
- **Implementation**:
  - Display current time (HH:MM format)
  - Show date and day
  - Dynamic greeting based on hour
  - Optional: 12/24 hour toggle
  
```typescript
// components/widgets/ClockWidget.tsx
export function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hour = time.getHours();
  const greeting =
    hour < 12 ? '🌅 Good morning' :
    hour < 18 ? '☀️ Good afternoon' :
    '🌙 Good evening';

  return (
    <div className="text-center space-y-2">
      <div className="text-6xl font-light">
        {time.toLocaleTimeString()}
      </div>
      <div className="text-gray-400">
        {time.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      <div className="text-lg text-gray-300">{greeting}</div>
    </div>
  );
}
```

### 2. Universal Search ✅
- **Complexity**: Medium
- **Time**: 2-3 hours
- **Dependencies**: Lunr.js for full-text search
- **Features**:
  - Search across bookmarks, history, tabs
  - Grouped results
  - Keyboard shortcuts (Cmd/Ctrl+K)
  - Command detection

```typescript
// components/SearchBar.tsx
export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      const newResults = searchEngine.search(query);
      setResults(newResults);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-2xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder="Search (Cmd+K)..."
        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
      />

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-gray-900 rounded-lg border border-gray-700 shadow-lg">
          {groupResults(results).map(([type, items]) => (
            <div key={type} className="border-b border-gray-700 last:border-b-0">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
                {type}
              </div>
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 transition text-sm"
                >
                  {item.title}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 3. Bookmarks Widget ✅
- **Complexity**: Easy-Medium
- **Time**: 2-3 hours
- **Features**:
  - Display Chrome bookmarks
  - Quick open
  - Search bookmarks
  - Folder hierarchy
  
```typescript
// providers/BookmarkProvider.ts
export class BookmarkProvider implements Provider<Bookmark[]> {
  id = 'bookmarks';
  name = 'Chrome Bookmarks';
  status: Provider['status'] = 'idle';
  permissions = ['bookmarks'];

  private subscribers: Set<(data: Bookmark[]) => void> = new Set();

  async initialize(): Promise<void> {
    try {
      this.status = 'loading';
      const tree = await chrome.bookmarks.getTree();
      this.notifySubscribers(tree);
      this.status = 'ready';
    } catch (error) {
      this.status = 'error';
      throw error;
    }
  }

  async getData(): Promise<Bookmark[]> {
    const tree = await chrome.bookmarks.getTree();
    return tree;
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
    this.subscribers.forEach(cb => cb(data));
  }
}
```

### 4. Tabs Widget ✅
- **Complexity**: Easy-Medium
- **Time**: 2-3 hours
- **Features**:
  - List open tabs
  - Quick switch
  - Tab search
  - Recently closed tabs (using chrome.sessions)

```typescript
// components/widgets/TabsWidget.tsx
export function TabsWidget() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadTabs = async () => {
      const result = await sendMessage({ type: 'GET_TABS' });
      setTabs(result);
    };

    loadTabs();

    // Listen for tab changes
    chrome.tabs.onCreated.addListener(loadTabs);
    chrome.tabs.onRemoved.addListener(loadTabs);

    return () => {
      chrome.tabs.onCreated.removeListener(loadTabs);
      chrome.tabs.onRemoved.removeListener(loadTabs);
    };
  }, []);

  const filtered = tabs.filter(tab =>
    tab.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tabs..."
        className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700"
      />

      <div className="space-y-2">
        {filtered.map((tab) => (
          <button
            key={tab.id}
            onClick={() => chrome.tabs.update(tab.id!, { active: true })}
            className="w-full text-left p-2 hover:bg-gray-700 rounded transition flex items-center gap-2"
          >
            {tab.favIconUrl && (
              <img src={tab.favIconUrl} alt="" className="w-4 h-4" />
            )}
            <span className="text-sm flex-1 truncate">{tab.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### 5. Tasks Widget ✅
- **Complexity**: Medium
- **Time**: 2-3 hours
- **Features**:
  - Create tasks
  - Mark complete/incomplete
  - Delete tasks
  - Local storage with IndexedDB

```typescript
// providers/TaskProvider.ts
export class TaskProvider implements Provider<Task[]> {
  id = 'tasks';
  name = 'Local Tasks';
  status: Provider['status'] = 'idle';
  permissions = [];

  private subscribers: Set<(data: Task[]) => void> = new Set();

  async initialize(): Promise<void> {
    this.status = 'ready';
  }

  async getData(): Promise<Task[]> {
    return db.tasks.toArray();
  }

  async refresh(): Promise<void> {
    const data = await this.getData();
    this.notifySubscribers(data);
  }

  subscribe(callback: (data: Task[]) => void): () => void {
    this.subscribers.add(callback);
    this.getData().then(callback);
    return () => this.subscribers.delete(callback);
  }

  async addTask(task: Task): Promise<void> {
    await db.tasks.add(task);
    this.refresh();
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    await db.tasks.update(id, updates);
    this.refresh();
  }

  async deleteTask(id: string): Promise<void> {
    await db.tasks.delete(id);
    this.refresh();
  }

  cleanup(): Promise<void> {
    this.subscribers.clear();
    return Promise.resolve();
  }

  private notifySubscribers(data: Task[]) {
    this.subscribers.forEach(cb => cb(data));
  }
}
```

### 6. Notes Widget ✅
- **Complexity**: Medium
- **Time**: 2-3 hours
- **Features**:
  - Create/edit notes
  - Delete notes
  - Local storage
  - Basic markdown support

### 7. Basic Settings ✅
- **Complexity**: Easy
- **Time**: 1-2 hours
- **Features**:
  - Theme toggle (dark/light)
  - Widget visibility toggle
  - Basic preferences

### 8. Dashboard Layout ✅
- **Complexity**: Medium
- **Time**: 2-3 hours
- **Features**:
  - Responsive grid layout
  - Widget arrangement
  - Persist layout

---

## Phase 2: Core Features (Weeks 5-8)

### 9. Focus Mode ⭐
- **Complexity**: High
- **Time**: 4-5 hours
- **Features**:
  - Pomodoro timer
  - Site blocker
  - Focus statistics
  - Break reminders

```typescript
// services/FocusService.ts
export class FocusService {
  async startFocusSession(duration: number, blockedSites: string[]) {
    await chrome.storage.local.set({
      focusMode: {
        active: true,
        startTime: Date.now(),
        duration,
        blockedSites,
      },
    });

    // Set timer
    chrome.alarms.create('focusTimer', {
      delayInMinutes: duration / 60000,
    });

    // Track
    this.trackFocusSession(duration);
  }

  async stopFocusSession() {
    chrome.alarms.clear('focusTimer');
    await chrome.storage.local.set({ focusMode: { active: false } });
  }

  private trackFocusSession(duration: number) {
    chrome.storage.local.get('focusStats', (result) => {
      const stats = result.focusStats || [];
      stats.push({
        timestamp: Date.now(),
        duration,
      });
      chrome.storage.local.set({ focusStats: stats });
    });
  }
}
```

### 10. Advanced History Widget ⭐
- **Complexity**: High
- **Time**: 3-4 hours
- **Features**:
  - Timeline view
  - Domain grouping
  - Visit statistics
  - Time filtering

### 11. Workspaces ⭐
- **Complexity**: High
- **Time**: 4-5 hours
- **Features**:
  - Create workspaces
  - Switch workspaces
  - Workspace-specific data
  - Auto-switch by time

### 12. Developer Tools Widget ⭐
- **Complexity**: High (many tools)
- **Time**: 5-6 hours
- **Includes**:
  - JSON formatter/minifier
  - Base64 encoder/decoder
  - URL parser
  - JWT decoder
  - UUID generator
  - Hash generator (MD5, SHA256)
  - Timestamp converter

```typescript
// components/widgets/DeveloperToolsWidget.tsx
export function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setOutput(`Error: ${e.message}`);
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setOutput(`Error: ${e.message}`);
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON..."
        className="w-full h-32 p-2 bg-gray-800 text-white rounded font-mono text-sm"
      />
      <div className="flex gap-2">
        <button
          onClick={format}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Format
        </button>
        <button
          onClick={minify}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Minify
        </button>
      </div>
      {output && (
        <textarea
          value={output}
          readOnly
          className="w-full h-32 p-2 bg-gray-800 text-white rounded font-mono text-sm"
        />
      )}
    </div>
  );
}
```

### 13. Quick Tools Widget ⭐
- **Complexity**: Medium-High
- **Time**: 3-4 hours
- **Includes**:
  - Calculator
  - Timer/Stopwatch
  - Password generator
  - Unit converter
  - Text statistics
  - QR code generator
  - Countdown timer

### 14. Advanced Search with Filters ⭐
- **Complexity**: High
- **Time**: 3-4 hours
- **Features**:
  - Filter by type
  - Filter by date
  - Filter by domain
  - Regex search
  - Search analytics

### 15. Bookmark Organization ⭐
- **Complexity**: Medium-High
- **Time**: 3-4 hours
- **Features**:
  - Auto-categorization
  - Duplicate detection
  - Dead link checker
  - Organization score
  - Export/import

### 16. Statistics Dashboard ⭐
- **Complexity**: High
- **Time**: 4-5 hours
- **Features**:
  - Top domains
  - Hourly activity
  - Task completion
  - Focus statistics
  - Usage charts

---

## Phase 3: Advanced Features (Weeks 9-12)

### 17. Calendar Integration 📅
- **Complexity**: Medium-High
- **Time**: 3-4 hours
- **Requires**: Google Calendar API (optional)
- **Features**:
  - Show upcoming events
  - Event quick add
  - Multiple calendars
  - Notifications

### 18. Weather Widget 🌤️
- **Complexity**: Medium
- **Time**: 2-3 hours
- **Requires**: Weather API
- **Features**:
  - Current weather
  - Forecast
  - Multiple locations
  - Severe weather alerts

### 19. GitHub Integration (Optional)
- **Complexity**: Medium-High
- **Time**: 3-4 hours
- **Requires**: GitHub token (user provides)
- **Features**:
  - PRs
  - Issues
  - Notifications
  - Repo status

### 20. Command Palette ⭐
- **Complexity**: Medium
- **Time**: 2-3 hours
- **Features**:
  - Quick actions
  - Custom commands
  - Keyboard shortcuts
  - Help/hints

### 21. Tab Groups & Sessions
- **Complexity**: Medium-High
- **Time**: 3-4 hours
- **Features**:
  - Group tabs
  - Save/restore sessions
  - Tab history
  - Session naming

### 22. Keyboard Navigation & Vim Mode (Optional)
- **Complexity**: Medium
- **Time**: 2-3 hours
- **Features**:
  - hjkl navigation
  - Custom shortcuts
  - Vim mode toggle

---

## Phase 4: Polish & Scaling (Weeks 13-16)

### 23. Advanced Theming
- **Complexity**: Medium
- **Time**: 2-3 hours
- **Features**:
  - Color scheme customization
  - Font selection
  - Background images
  - Theme export/import

### 24. Data Management & Backup
- **Complexity**: Medium
- **Time**: 2-3 hours
- **Features**:
  - Export all data
  - Import from backup
  - Auto-backup
  - Clear data options

### 25. Cloud Sync (Optional Account System)
- **Complexity**: Very High
- **Time**: 8-10 hours
- **Requires**: Backend with authentication
- **Features**:
  - Optional Google auth
  - Cloud backup
  - Cross-device sync

### 26. Performance Optimization
- **Complexity**: Medium
- **Time**: 2-3 hours
- **Features**:
  - Lazy loading
  - Code splitting
  - Asset optimization
  - Caching strategy

### 27. Accessibility
- **Complexity**: Medium
- **Time**: 2-3 hours
- **Features**:
  - ARIA labels
  - Keyboard navigation
  - Screen reader support
  - High contrast mode

### 28. Offline Support Enhancement
- **Complexity**: Medium
- **Time**: 2-3 hours
- **Features**:
  - Offline detection
  - Data caching
  - Sync queue
  - Offline indicators

---

# Implementation Checklist

## MVP (Phase 1)
- [ ] Project setup (Vite, TypeScript, React)
- [ ] Chrome extension manifest
- [ ] Service worker setup
- [ ] State management (Zustand)
- [ ] Local storage (IndexedDB, localStorage)
- [ ] Clock widget
- [ ] Search bar
- [ ] Bookmarks widget
- [ ] Tabs widget
- [ ] Tasks widget
- [ ] Notes widget
- [ ] Basic settings
- [ ] Dashboard layout
- [ ] Responsive design
- [ ] Theme toggle

## Phase 2
- [ ] Focus mode
- [ ] Advanced history
- [ ] Workspaces
- [ ] Developer tools
- [ ] Quick tools
- [ ] Advanced search
- [ ] Bookmark organization
- [ ] Statistics dashboard
- [ ] Keyboard shortcuts
- [ ] Command palette

## Phase 3
- [ ] Calendar widget
- [ ] Weather widget
- [ ] GitHub widget
- [ ] Tab groups
- [ ] Session management
- [ ] Vim mode
- [ ] RSS feed

## Phase 4
- [ ] Advanced theming
- [ ] Data export/import
- [ ] Cloud sync
- [ ] Performance optimization
- [ ] Accessibility
- [ ] Offline support
- [ ] Testing
- [ ] Documentation
- [ ] Marketplace (optional)

---

# Key Implementation Tips

1. **Build providers first** - Each feature needs a provider
2. **Test Chrome APIs early** - Some APIs have permission constraints
3. **Use IndexedDB for large data** - localStorage has size limits
4. **Lazy load widgets** - Don't load all data at startup
5. **Handle errors gracefully** - Show useful error messages
6. **Support keyboard navigation** - Important for accessibility
7. **Cache browser data** - Reduce API calls
8. **Validate all inputs** - Security first
9. **Test offline behavior** - Ensure core features work
10. **Monitor performance** - Keep startup time < 1 second

---

# Testing Strategy

```typescript
// Every service should have tests
import { describe, it, expect } from 'vitest';

describe('TaskService', () => {
  it('should create tasks', async () => {
    const task = await taskService.addTask('Test task');
    expect(task.id).toBeDefined();
  });

  it('should update tasks', async () => {
    const task = await taskService.addTask('Test');
    await taskService.updateTask(task.id, { status: 'done' });
    // Verify update
  });

  it('should delete tasks', async () => {
    const task = await taskService.addTask('Test');
    await taskService.deleteTask(task.id);
    // Verify deletion
  });
});
```

---

# Deployment Checklist

- [ ] Remove all console.logs
- [ ] Optimize images and assets
- [ ] Minify and bundle code
- [ ] Test extension on Chrome
- [ ] Test on multiple resolutions
- [ ] Verify all permissions are necessary
- [ ] Update manifest version
- [ ] Create privacy policy
- [ ] Test offline mode
- [ ] Performance testing
- [ ] Security audit
- [ ] Documentation complete

