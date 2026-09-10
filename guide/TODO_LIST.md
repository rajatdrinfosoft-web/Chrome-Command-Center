# Chrome Command Center TODO List

This roadmap consolidates the product specifications, technical architecture, and feature implementation guide. Checked items are present in the current repository; unchecked items still need implementation or verification.

## Phase 1: Foundation and MVP

### Project foundation
- [x] Vite, React, and TypeScript project setup
- [x] Manifest V3 extension manifest
- [x] Background service worker entry point
- [x] Centralize extension messaging through an `ExtensionBridge`
- [x] Complete provider lifecycle and graceful error handling
- [x] Add automated test tooling and service tests

### MVP features
- [x] Clock, date, and greeting widget
- [x] Universal search input
- [x] Chrome bookmarks provider and widget
- [x] Chrome tabs provider and widget
- [x] Recently closed tabs widget
- [x] Chrome history provider and widget
- [x] Local tasks widget with create, update, complete, and delete flows
- [x] Local notes widget
### MVP features
- [x] Clock, date, and greeting widget
- [x] Universal search input
- [x] Chrome bookmarks provider and widget
- [x] Chrome tabs provider and widget
- [x] Recently closed tabs widget
- [x] Chrome history provider and widget
- [x] Local tasks widget with create, update, complete, and delete flows
- [x] Local notes widget
- [x] Rich text or Markdown note rendering
- [x] Basic settings UI and persisted preferences
- [x] Dashboard layout and widget registry
- [x] Persist widget visibility, ordering, and layout
- [x] Theme toggle with persisted dark/light/auto mode
- [x] Responsive layout verification across target resolutions

## Phase 2: Core Productivity Features

### Focus and history
- [x] Pomodoro timer widget
- [ ] Focus sessions with start, stop, and break reminders
- [ ] Site blocker with Chrome permissions and blocking rules
- [ ] Focus session statistics
- [ ] Advanced history timeline
- [ ] History filtering by time range and domain
- [x] Most-visited domain analytics
- [x] Session activity heatmap
- [x] Cached history snapshots and loading, empty, and error states

### Work and utility tools
- [ ] Workspaces: create, switch, rename, and delete
- [ ] Workspace-specific tasks, notes, bookmarks, and settings
- [ ] Workspace persistence and optional time-based switching
- [ ] Developer tools widget
- [x] JSON formatter and minifier
- [x] Base64 encoder and decoder
- [x] URL parser
- [ ] JWT decoder
- [ ] UUID generator
- [ ] Hash generator
- [ ] Timestamp converter
- [x] Quick tools widget
- [ ] Calculator
- [ ] Timer and stopwatch
- [ ] Password generator
- [ ] Unit converter
- [ ] Text statistics
- [ ] QR code generator
- [ ] Countdown timer

### Search and browser organization
- [ ] Search across bookmarks, tabs, history, notes, and tasks
- [ ] Grouped search results
- [ ] Search filters by type, date, and domain
- [ ] Regex search with validation
- [ ] Search analytics
- [ ] Bookmark auto-categorization
- [ ] Bookmark duplicate detection
- [ ] Bookmark dead-link checker
- [ ] Bookmark organization score
- [ ] Bookmark export and import
- [ ] Statistics dashboard for domains, activity, tasks, and focus

## Phase 3: Advanced Browser Features

### Command and keyboard control
- [x] Command palette modal
- [x] Command filtering and keyboard selection
- [x] Command actions for search, settings, widgets, and refresh
- [ ] Natural-language command parsing
- [ ] Custom commands and configurable shortcuts
- [ ] Keyboard navigation across widgets
- [ ] Optional Vim mode with `hjkl` navigation

### Integrations
- [ ] Calendar widget with upcoming events
- [ ] Calendar quick add and multiple-calendar support
- [ ] Calendar notifications
- [ ] Weather widget with current conditions and forecast
- [ ] Multiple weather locations and severe-weather alerts
- [ ] Optional GitHub integration using a user-provided token
- [ ] GitHub pull requests, issues, notifications, and repository status

### Tabs and sessions
- [ ] Tab group creation and management
- [ ] Save, name, and restore tab sessions
- [ ] Session history
- [ ] Tab close and switch actions through the extension bridge

## Phase 4: Customization, Reliability, and Scale

### Customization
- [ ] Advanced theming with color, font, spacing, radius, and animation controls
- [ ] Background image or background customization
- [ ] Layout presets: Minimal, Productivity, Developer, Focus, and Custom
- [ ] Theme export and import
- [ ] Widget drag-and-drop ordering and position persistence
- [ ] Complete settings categories: general, display, keyboard, privacy, integrations, and performance

### Data and sync
- [ ] Export all local data to JSON
- [ ] Import and validate backup JSON
- [ ] Manual and automatic backups
- [ ] Clear selected data types and clear cache
- [ ] Storage usage display and limit warnings
- [ ] Optional cloud account and authentication
- [ ] Optional cross-device cloud sync

### Quality and offline support
- [ ] Lazy-load widgets and code-split optional features
- [ ] Cache browser data and reduce unnecessary API calls
- [ ] Offline detection and offline indicator
- [ ] Offline support for local widgets and cached browser data
- [ ] Queue online-only actions for later sync
- [ ] Complete ARIA labels and screen-reader support
- [ ] High-contrast mode
- [ ] Keyboard and responsive accessibility audit
- [ ] Unit, integration, and end-to-end test coverage
- [ ] Provider permission, loading, empty, and error-state coverage
- [ ] Chrome extension testing on multiple resolutions
- [ ] Performance verification for sub-second startup

## Release Checklist

- [ ] Remove debug logging
- [ ] Verify every manifest permission is necessary
- [ ] Validate extension behavior in Chrome
- [ ] Optimize assets and production bundle
- [ ] Update extension version
- [ ] Complete privacy policy
- [ ] Complete security audit and input validation review
- [ ] Test offline mode
- [ ] Complete user and developer documentation
- [ ] Prepare optional marketplace package

## Known Repository Cleanup

- [ ] Resolve duplicate `Provider` import in `src/providers/BookmarkProvider.ts`
- [ ] Add or remove the `zustand` dependency consistently with `src/stores/appStore.ts`
- [ ] Add a `test` package script and testing dependency
