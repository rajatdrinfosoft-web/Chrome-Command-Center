# Chrome Command Center TODO List

This roadmap reflects the current repository state. Items are checked only when the actual app code and build support them. Future work remains explicitly marked for the next milestone.

## Phase 1: Foundation and MVP

### Project foundation
- [x] Vite, React, and TypeScript project setup
- [x] Manifest V3 extension manifest
- [x] Basic app shell and dashboard entry point
- [x] Global keyboard shortcuts for command palette and escape behavior
- [x] Provider/data pattern scaffold for bookmarks, tabs, history, and analytics
- [x] Zustand state store with persisted theme and widget visibility

### MVP features
- [x] Clock and greeting widget
- [x] Universal search input and focus behavior
- [x] Bookmarks widget
- [x] Tabs widget
- [x] Recently closed tabs widget
- [x] History widget
- [x] Tasks widget
- [x] Notes widget
- [x] Pomodoro widget
- [x] Analytics and session heatmap widgets
- [x] Settings modal with theme and widget toggles
- [x] Dashboard layout and widget registry
- [x] Quick tools widget including JSON, Base64, URL, JWT, UUID, hash, timestamp, calculator, password, unit, text stats, QR, and countdown tools
- [x] Command palette modal with command filtering, selection, and execution

## Phase 2: Core Productivity Features

### Focus and browser productivity
- [x] Focus/pomodoro timer surface in the dashboard
- [x] Complete focus-mode session tracking and blocking rules
- [x] Persist focus sessions and blocked-site settings
- [x] Add focus statistics and summaries
- [x] Expand history timeline filtering around time and domain
- [x] Add richer history search and analytics groupings
- [x] Add focus break reminders and completion notifications
- [x] Add optional full-screen and minimal focus mode
- [x] Add distraction resistance and productive-hours summaries

### Workspaces and advanced utility tools
- [x] Workspaces and workspace-specific data management
- [x] Add a dedicated Workspaces widget separate from the settings modal
- [x] Developer tools widget status beyond the existing quick tool set
- [x] Advanced search filters by type, date, and domain
- [x] Search analytics and grouped result ranking
- [x] Bookmark and history organization utilities
- [x] Statistics dashboard expansions for deeper productivity reporting
- [x] Add bookmark categories, folder organization, and confirmation-based auto-categorization
- [x] Add bookmark dead-link checking and duplicate cleanup workflow
- [x] Add bookmark import/export and usage-frequency analytics
- [x] Add history clearing, export, and local retention controls
- [x] Add time-spent-per-domain and busiest-hours analytics
- [x] Add advanced task priorities, due dates, recurring tasks, and filters
- [x] Add note folders, tags, pinning, search, and linked-note support
- [x] Add regex, color-converter, and cron-expression developer tools

## Phase 3: Advanced Browser Features

### Command and keyboard control
- [x] Action-oriented command palette
- [x] Search-focus command behavior from the palette
- [x] Natural-language command parsing
- [x] Custom commands and shortcut configuration
- [x] Multi-widget keyboard navigation improvements
- [x] Optional Vim mode
- [x] Add fuzzy command matching and ranked suggestions
- [x] Add inline command autocomplete while typing
- [x] Add parameterized natural-language commands such as `timer 25` and `new task review docs`

### Integrations and sessions
- [x] Calendar widget and event management
- [x] Weather widget
- [ ] Add real CalendarProvider-backed data instead of placeholder states
- [ ] Add real WeatherProvider-backed data instead of placeholder states
- [ ] Add calendar event creation, multiple calendars, and connection states
- [ ] Add weather location management, forecasts, and cached responses
- [x] Tab group management
- [x] Sessions save/restore flow
- [x] Session history views and restore controls
- [x] Add Continue/recent-work recommendations from tabs, history, bookmarks, and sessions
- [x] Add browser extension information widget where Chrome permissions allow
- [x] Add web-search fallback from universal search
- [x] Add search operators for type, domain, date, priority, and tag
- [x] Add workspace templates, automatic switching, and tab restoration

## Phase 4: Customization, Reliability, and Scale

### Customization
- [x] Advanced theming controls
- [x] Layout presets and saved dashboard states
- [x] Background customization and export/import of theme settings
- [x] Widget drag-and-drop ordering and persistence
- [x] Full settings categories for privacy, integrations, and performance
- [x] Add permission center with explanations and connection status
- [x] Add layout preset templates for minimal, productivity, developer, and focus modes
- [x] Add widget size and minimum-size configuration
- [x] Add custom font, spacing, border-radius, and animation controls

### Data integrity and sync
- [x] Backup and restore flows for local data
- [x] Import/export of note, task, bookmark, and settings data
- [x] Clear-data and storage management utilities
- [ ] Optional cloud sync and account-based backup
- [ ] Add IndexedDB storage for large browser datasets and history snapshots
- [ ] Add selective backup and restore by data type

### Quality and accessibility
- [x] Offline detection and offline-mode behavior
- [ ] Accessibility audit for ARIA labels, contrast, and keyboard flow
- [ ] Unit and integration tests for providers and services
- [ ] Provider loading, empty, and error-state testing
- [x] Isolate widget rendering failures with per-widget error boundaries
- [ ] Performance audit for startup and widget rendering
- [ ] Add provider loading, permission, empty, unavailable, and error states
- [ ] Add reduced-motion, focus-order, screen-reader, and contrast audit
- [ ] Add responsive testing across desktop and narrow browser windows
- [ ] Add production Chrome API provider wiring for bookmarks, tabs, history, sessions, and focus blocking
- [ ] Add service-worker message handlers for browser actions and normalized provider responses
- [ ] Replace development fallback data with live Chrome data in extension builds

## Release Checklist

- [ ] Remove unused debug logging and stale placeholders
- [ ] Verify Chrome permissions are minimal and justified
- [ ] Test extension behavior in Chrome and Chromium-based browsers
- [ ] Optimize assets and bundle output for release
- [ ] Update manifest version and package metadata
- [ ] Complete privacy and data-handling documentation
- [ ] Review security and input-validation hardening
- [ ] Test offline behavior and fallback states
- [ ] Finalize user documentation and setup steps
- [ ] Prepare optional marketplace packaging
- [ ] Add privacy policy and explicit data-handling documentation
- [ ] Remove development-only mock data from production builds
- [ ] Verify no browser data is sent to external services by default
- [ ] Test Chrome service-worker messaging and API permissions
- [ ] Test Chromium-based browser compatibility
- [ ] Add release icons and validate manifest assets

## Repository cleanup

- [x] Fix duplicate `Provider` imports in the bookmark provider path
- [x] Install and align the `zustand` dependency with the current store implementation
- [x] Add a formal test script and test dependency setup
- [ ] Review remaining TypeScript warnings and strict typing cleanup
- [ ] Synchronize stale checklists in the other guide files with this roadmap
- [ ] Remove stale placeholders and unused debug logging
- [ ] Add provider contract tests and service integration tests
- [ ] Add search, focus, session, workspace, and data-management regression tests
