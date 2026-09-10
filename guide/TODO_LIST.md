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

### Workspaces and advanced utility tools
- [x] Workspaces and workspace-specific data management
- [x] Developer tools widget status beyond the existing quick tool set
- [x] Advanced search filters by type, date, and domain
- [x] Search analytics and grouped result ranking
- [x] Bookmark and history organization utilities
- [x] Statistics dashboard expansions for deeper productivity reporting

## Phase 3: Advanced Browser Features

### Command and keyboard control
- [x] Action-oriented command palette
- [x] Search-focus command behavior from the palette
- [x] Natural-language command parsing
- [x] Custom commands and shortcut configuration
- [x] Multi-widget keyboard navigation improvements
- [x] Optional Vim mode

### Integrations and sessions
- [ ] Calendar widget and event management
- [ ] Weather widget
- [ ] GitHub integration
- [x] Tab group management
- [x] Sessions save/restore flow
- [x] Session history views and restore controls

## Phase 4: Customization, Reliability, and Scale

### Customization
- [x] Advanced theming controls
- [x] Layout presets and saved dashboard states
- [x] Background customization and export/import of theme settings
- [x] Widget drag-and-drop ordering and persistence
- [ ] Full settings categories for privacy, integrations, and performance

### Data integrity and sync
- [x] Backup and restore flows for local data
- [x] Import/export of note, task, bookmark, and settings data
- [x] Clear-data and storage management utilities
- [ ] Optional cloud sync and account-based backup

### Quality and accessibility
- [x] Offline detection and offline-mode behavior
- [ ] Accessibility audit for ARIA labels, contrast, and keyboard flow
- [ ] Unit and integration tests for providers and services
- [ ] Provider loading, empty, and error-state testing
- [ ] Performance audit for startup and widget rendering

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

## Repository cleanup

- [x] Fix duplicate `Provider` imports in the bookmark provider path
- [x] Install and align the `zustand` dependency with the current store implementation
- [x] Add a formal test script and test dependency setup
- [ ] Review remaining TypeScript warnings and strict typing cleanup
