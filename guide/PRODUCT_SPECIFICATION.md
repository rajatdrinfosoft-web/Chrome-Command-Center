# Chrome Browser Command Center

## Product Specification & Technical Product Requirements

**Document Version:** 1.0  
**Product Type:** Chrome New Tab / Browser Productivity Dashboard  
**Primary Framework:** React + TypeScript  
**Target Environment:** Google Chrome / Chromium-based browsers  
**Development Environment:** Google AI Studio  
**Architecture:** React frontend + Chrome Extension APIs + modular data-provider architecture  
**Primary Principle:** Dynamic, local-first, privacy-conscious, extensible

---

# 1. Product Overview

Chrome Browser Command Center is an advanced replacement for the default Chrome New Tab page.

The product transforms every new browser tab into a personalized browser command center that dynamically brings together:

- Current time and date
- Calendar
- Weather
- Chrome bookmarks
- Open tabs
- Recently closed tabs
- Browsing history
- Installed/enabled extensions where technically available
- Tasks
- Notes
- Quick tools
- Search
- Recently used websites
- Frequently used websites
- Workspaces
- Focus mode
- Custom widgets
- Optional third-party integrations

The product should feel like a lightweight personal operating environment inside the browser.

It should not feel like a conventional SaaS dashboard.

---

# 2. Product Vision

Transform the Chrome New Tab page from a passive starting point into an intelligent browser workspace.

The user should be able to:

1. Search anything.
2. Open anything.
3. Continue previous work.
4. Access important bookmarks.
5. See upcoming events.
6. Capture tasks and notes.
7. Manage browser resources.
8. Launch useful tools.
9. Enter a distraction-free focus mode.
10. Customize the entire experience.

The product should minimize the number of times a user needs to leave the current tab to perform common browser-related actions.

---

# 3. Core Product Philosophy

## 3.1 Dynamic First

Do not hardcode browser information.

Never hardcode:

- Bookmark names
- Bookmark URLs
- History entries
- Open tabs
- Recently closed tabs
- Extension names
- Calendar events
- Weather location
- Frequently visited websites

All such information must originate from:

- Chrome APIs
- External APIs
- User configuration
- Local application data
- Connected integrations

---

# 3.2 Local First

The application should work without requiring an account.

The default architecture should prioritize local storage.

Use browser/local storage for:

- Preferences
- Widget configuration
- Dashboard layout
- Theme
- Tasks
- Notes
- User settings
- Cached information
- Local activity summaries

Cloud services should be optional.

---

# 3.3 Privacy First

The product may access sensitive browser information such as:

- Bookmarks
- History
- Tabs
- Sessions
- Clipboard
- Extension metadata

Therefore:

- Request only necessary permissions.
- Clearly explain permissions.
- Do not transmit browser data externally by default.
- Do not send browsing history to third-party servers by default.
- Keep local data local whenever possible.
- Provide clear privacy controls.
- Never hide data collection behavior.

---

# 3.4 Modular Architecture

Every major feature should be implemented as an independent module or widget.

Examples:

- Clock Widget
- Calendar Widget
- Bookmark Widget
- Tab Widget
- History Widget
- Weather Widget
- Task Widget
- Notes Widget
- Quick Tools Widget
- Continue Widget
- Workspace Widget

Widgets should not be tightly coupled.

One widget failing must not break the rest of the dashboard.

---

# 4. Important Chrome Architecture Constraint

A React application running as a normal website cannot automatically access privileged Chrome APIs such as:

- `chrome.bookmarks`
- `chrome.tabs`
- `chrome.history`
- `chrome.sessions`
- `chrome.management`

Therefore the final product should be designed as a Chrome Extension architecture.

Recommended structure:

```text
Chrome Extension
│
├── New Tab UI
│   └── React Application
│
├── Background Service Worker
│   ├── Chrome API access
│   ├── Event listeners
│   ├── Data synchronization
│   └── Extension messaging
│
├── Content Scripts
│   └── Only when specifically required
│
├── Shared Data Layer
│
└── External Services
    ├── Weather
    ├── Calendar
    ├── GitHub
    └── Other integrations
```

The React UI should communicate with the extension layer through a well-defined messaging/provider interface.

---

# 5. Technology Stack

Use:

- React
- TypeScript
- Vite where appropriate
- Modern CSS or Tailwind CSS
- Chrome Extension Manifest V3
- Chrome Storage API
- IndexedDB where required
- Chrome Bookmarks API
- Chrome Tabs API
- Chrome History API
- Chrome Sessions API
- Chrome Commands API
- Chrome Alarms API
- Chrome Management API only where permissions and browser capabilities permit

Avoid unnecessary dependencies.

Prefer browser-native APIs when practical.

---

# 6. Application Architecture

Use a layered architecture.

```text
UI Layer
    ↓
Widget Layer
    ↓
Application Services
    ↓
Data Providers
    ↓
Chrome APIs / External APIs / Local Storage
```

Example:

```text
BookmarkWidget
      ↓
BookmarkService
      ↓
BookmarkProvider
      ↓
chrome.bookmarks
```

Another example:

```text
WeatherWidget
      ↓
WeatherService
      ↓
WeatherProvider
      ↓
Weather API
```

The UI must not directly depend on raw API responses.

Normalize external data before passing it to widgets.

---

# 7. Data Provider Architecture

Create a standard provider interface.

Conceptually:

```text
Provider
├── id
├── name
├── status
├── permissions
├── initialize()
├── getData()
├── refresh()
├── subscribe()
└── cleanup()
```

Providers should include:

```text
ChromeBookmarkProvider
ChromeTabProvider
ChromeHistoryProvider
ChromeSessionProvider
ChromeExtensionProvider
LocalTaskProvider
LocalNoteProvider
WeatherProvider
CalendarProvider
GitHubProvider
```

Future providers should be easy to add.

---

# 8. Dashboard

The dashboard is the main New Tab experience.

It should contain:

### Primary area

- Time
- Date
- Greeting
- Universal Search

### Secondary area

- Bookmarks
- Continue
- Calendar
- Tasks
- Open Tabs
- Quick Tools
- Weather

### Optional area

- News/RSS
- GitHub
- Productivity metrics
- World clocks
- Notes
- Workspace information

Users must be able to control which widgets appear.

---

# 9. Visual Design Direction

Create a premium, modern Chrome New Tab experience.

The design should feel like a personal browser command center rather than a traditional dashboard.

Use:

- Dark-first design
- Deep charcoal backgrounds
- Subtle surfaces
- Fine borders
- Soft shadows
- Controlled blur
- Subtle glass effects
- Refined typography
- Generous spacing
- Minimal accent colors

Avoid excessive cards.

Avoid generic SaaS dashboard styling.

Avoid excessive gradients.

Avoid excessive animations.

The UI should feel calm, fast, intelligent, and premium.

Visual inspiration may include the general design philosophy of products such as Arc, Raycast, Vercel, and modern operating systems, but the final interface must have an original visual identity.

---

# 10. Homepage Visual Hierarchy

The default experience should follow this hierarchy:

```text
                 TIME

          DATE + GREETING

       UNIVERSAL SEARCH

       DYNAMIC WORKSPACE

  BOOKMARKS     CONTINUE     CALENDAR

  OPEN TABS     TASKS        QUICK TOOLS

          OPTIONAL WIDGETS
```

The user should understand the most important information within a few seconds.

---

# 11. Dynamic Clock

Display:

- Current time
- Date
- Day
- Greeting

Example:

```text
18:17

Wednesday, September 9

Good evening
```

Clock must use the user's actual local browser time.

Optional features:

- 12/24 hour format
- Seconds
- Analog mode
- World clocks
- Time-zone conversion
- Stopwatch
- Countdown
- Pomodoro

---

# 12. Universal Search

The search bar is one of the most important components.

Search should support:

```text
Web
Bookmarks
History
Open Tabs
Commands
Applications where available
```

The system should intelligently identify user intent.

Examples:

```text
github.com
→ Open URL

12 * 45
→ Calculator

portfolio
→ Search bookmarks/history/tabs

weather Delhi
→ Weather/search

new note
→ Execute command
```

Search should provide grouped results.

Example:

```text
BOOKMARKS
Portfolio
Portfolio Documentation

OPEN TABS
Portfolio dashboard

HISTORY
Portfolio project

WEB
Search the web for "portfolio"
```

---

# 13. Command Palette

Keyboard shortcut:

```text
Ctrl + K
```

or a configurable shortcut.

The command palette should allow:

- Search
- Open bookmark
- Switch tab
- Search history
- Create note
- Create task
- Open calendar
- Start timer
- Start focus mode
- Change theme
- Open settings
- Manage widgets
- Open extension management

Commands should be registered dynamically through a command registry.

---

# 14. Bookmark System

The bookmark system should read real Chrome bookmarks.

Use:

```text
chrome.bookmarks
```

where available.

Display:

- Bookmark title
- URL
- Favicon
- Folder
- Nested folders
- Bookmark count

Support:

- Search
- Folder navigation
- Drag and drop
- Pin
- Favorite
- Hide
- Reorder
- Open in current tab
- Open in new tab
- Open multiple bookmarks
- Edit
- Delete
- Import/export where appropriate

---

# 15. Smart Bookmark Organization

Create an optional intelligent organization system.

Analyze:

- URL
- Domain
- Page title
- Existing folder
- User-defined tags
- Usage frequency

Suggested categories:

- Development
- Design
- SEO
- Work
- Education
- Finance
- Social
- Shopping
- News
- Entertainment
- Custom

Do not automatically move or modify bookmarks without explicit user confirmation.

---

# 16. Dynamic Open Tabs

Use the Chrome Tabs API.

Display:

- Website title
- Favicon
- URL/domain
- Window information where appropriate

Features:

- Switch to tab
- Close tab
- Search tabs
- Group tabs where supported
- Open new tab
- Show tab count

Example:

```text
OPEN TABS

GitHub
Portfolio
Figma
Google Docs
YouTube

12 tabs
```

---

# 17. Recently Closed Tabs

Use Chrome Sessions APIs where available.

Display:

```text
RECENTLY CLOSED

Portfolio
GitHub
Documentation
Figma
```

Allow the user to reopen sessions/tabs where browser permissions permit.

---

# 18. Browser History

Use Chrome History API where available.

Show useful summaries rather than overwhelming raw history.

Examples:

```text
RECENT ACTIVITY

GitHub             5 visits
Google Docs        3 visits
Figma              2 visits
```

Possible views:

- Recent
- Frequent
- Today
- This week
- Domains

History analysis must remain local by default.

---

# 19. Extension Information

Where Chrome permissions and APIs allow, provide a browser extension overview.

Display:

- Extension name
- Icon
- Enabled state
- Description where available
- Version where available

Provide an action to open Chrome's extension management interface when appropriate.

Do not assume that every installed extension exposes or permits detailed information.

Gracefully handle unavailable data.

---

# 20. Continue Feature

Create a dynamic "Continue" system using:

- Recently opened tabs
- Recently visited pages
- Recently closed tabs
- Frequently used bookmarks
- Recent sessions
- User workspaces

Example:

```text
CONTINUE

Portfolio
Last used recently

Development
7 related resources

Documentation
Recently visited
```

Initially use deterministic signals such as:

- Recency
- Frequency
- Folder relationship
- Domain relationship

AI-powered recommendations can be added later.

---

# 21. Calendar

Support calendar integrations through a provider architecture.

Initial architecture:

```text
CalendarProvider
├── Google Calendar
├── Microsoft Outlook
└── Local Calendar
```

Display:

- Today's events
- Upcoming events
- Event title
- Start time
- End time
- Calendar name

Do not display fake events in production.

If no calendar is connected:

```text
Calendar not connected

Connect calendar
```

---

# 22. Tasks

Create a lightweight task manager.

Features:

- Add task
- Complete task
- Delete task
- Priority
- Due date
- Categories
- Search
- Filter
- Local persistence

Default provider:

```text
LocalTaskProvider
```

Future providers:

```text
GoogleTasksProvider
TodoistProvider
```

---

# 23. Notes

Create an instant notes system.

Features:

- Quick note
- Autosave
- Markdown support
- Multiple notes
- Pin
- Search
- Delete
- Copy
- Local persistence

Notes should not require an account.

---

# 24. Weather

Weather should be dynamic.

Do not hardcode a location.

Use:

```text
LocationProvider
       ↓
WeatherProvider
       ↓
WeatherWidget
```

Support:

- Automatic location
- Manual location
- Saved locations

Display:

- Current temperature
- Condition
- Feels like
- High/low
- Humidity
- Basic forecast

Cache weather responses to reduce unnecessary API calls.

---

# 25. Quick Tools

Provide a configurable toolbox.

Initial tools:

- Calculator
- Timer
- Stopwatch
- Pomodoro
- URL encoder/decoder
- JSON formatter
- Base64 encoder/decoder
- UUID generator
- Regex tester
- Color picker
- Timestamp converter
- Markdown helper
- Password generator
- Text utilities

Tools should be modular.

Users can enable or disable tools.

---

# 26. Focus Mode

Focus mode should simplify the interface.

Display:

```text
TIME

Current task

25:00

START FOCUS
```

Optional:

- Pomodoro
- Minimal background
- Hide widgets
- Full-screen mode
- Ambient sound
- Task selection

Focus mode should be completely optional.

---

# 27. Workspace System

Allow users to organize browser work into workspaces.

Examples:

```text
WORKSPACES

Work
Development
SEO
Learning
Personal
Projects
```

A workspace can contain:

- Bookmarks
- Tabs
- Notes
- Tasks
- Quick links
- Custom widgets

Where Chrome capabilities permit, provide tab restoration.

---

# 28. Widget Engine

Widgets must be modular.

Every widget should define:

```text
id
name
description
icon
provider
permissions
defaultSize
minimumSize
settings
refreshStrategy
```

Example:

```text
BookmarkWidget

id: bookmarks
provider: ChromeBookmarkProvider
permissions: bookmarks
defaultSize: medium
refreshStrategy: event-driven
```

---

# 29. Widget Registry

Create a central registry.

Conceptually:

```text
WidgetRegistry

register(widget)

unregister(widget)

get(widgetId)

getAll()

getAvailable()

getEnabled()
```

This makes future widgets easy to add.

---

# 30. Layout Engine

The dashboard layout must be configurable.

Users should be able to:

- Drag widgets
- Resize widgets
- Reorder widgets
- Hide widgets
- Pin widgets
- Reset layout

Store layout configuration locally.

Example:

```text
{
  widget: "calendar",
  enabled: true,
  position: 3,
  width: 2,
  height: 1
}
```

Do not hardcode widget positions into the UI.

---

# 31. Themes

Support:

- Dark
- Light
- System

Optional:

- AMOLED
- High contrast
- Custom accent
- Custom background

Theme preferences should persist locally.

---

# 32. Dynamic Background

Allow:

- Solid background
- Gradient
- Custom image
- Wallpaper
- Optional remote image source

Optional contextual background changes based on:

- Time of day
- Weather
- Focus mode

Animations must remain subtle.

---

# 33. Settings Architecture

Create a dedicated settings interface.

Sections:

```text
Appearance
Dashboard
Widgets
Browser
Integrations
Privacy
Keyboard Shortcuts
Data
About
```

---

# 34. Permission Center

Create a clear permission interface.

Example:

```text
PERMISSIONS

Bookmarks
Connected

Tabs
Connected

History
Not connected

Location
Not connected

Calendar
Not connected
```

Each permission should explain:

1. What is accessed.
2. Why it is needed.
3. Whether the data leaves the browser.

---

# 35. Error Handling

Every provider must have:

```text
Loading
Success
Empty
Error
Permission Required
Unavailable
```

One failed provider must never crash the entire dashboard.

Example:

```text
Weather unavailable

Retry
```

Another example:

```text
Bookmarks permission required

Enable permission
```

---

# 36. Loading States

Use skeleton loading states.

Do not show empty white boxes while data loads.

Widgets should transition smoothly:

```text
Loading
   ↓
Data
```

or:

```text
Loading
   ↓
Error / Empty
```

---

# 37. Refresh Strategy

Do not repeatedly poll APIs unnecessarily.

Prefer event-driven updates.

Examples:

```text
Bookmarks
→ Chrome bookmark events

Tabs
→ Chrome tab events

Clock
→ Local timer

Weather
→ Cached periodic refresh

Calendar
→ Cached periodic refresh

GitHub
→ Cached API refresh
```

Every provider should define an appropriate refresh strategy.

---

# 38. State Management

Separate state into:

### UI state

- Active widget
- Modal state
- Search state
- Command palette
- Temporary filters

### Persistent state

- Theme
- Layout
- Widget configuration
- Tasks
- Notes
- Preferences

### Remote state

- Weather
- Calendar
- GitHub
- RSS

### Browser state

- Tabs
- Bookmarks
- History
- Sessions

Do not mix these unnecessarily.

---

# 39. Performance Requirements

The New Tab page must load quickly.

Prioritize:

1. Local UI
2. Clock
3. Cached/local data
4. Browser data
5. External API data

External APIs should never block initial rendering.

Lazy-load nonessential widgets.

Avoid unnecessary API requests.

Avoid excessive re-rendering.

---

# 40. Responsive Design

The dashboard must work across:

- Laptop
- Desktop
- Large monitor
- Small browser window

Use responsive layouts.

Widgets should adapt to available space.

Do not simply shrink desktop layouts.

---

# 41. Accessibility

Support:

- Keyboard navigation
- Visible focus states
- Screen readers where practical
- Proper semantic HTML
- ARIA labels
- Sufficient contrast
- Reduced-motion preference
- Keyboard shortcuts

All important functionality must remain usable without a mouse.

---

# 42. Keyboard Shortcuts

Initial shortcuts:

```text
Ctrl/Cmd + K
→ Universal Search / Command Palette

Ctrl/Cmd + Shift + N
→ New Note

Ctrl/Cmd + Shift + T
→ Recently Closed / Tab tools

Ctrl/Cmd + Shift + F
→ Focus Mode

Esc
→ Close active overlay
```

Shortcuts should be configurable where Chrome permits.

---

# 43. Data Security

Never expose sensitive browser data unnecessarily.

Do not send:

- Full browsing history
- Bookmark collections
- Clipboard content
- Private notes
- Tasks

to external APIs unless the user explicitly enables a feature requiring it.

External APIs should receive only the minimum required information.

---

# 44. Analytics

If analytics are eventually added:

- Make them opt-in or privacy-preserving.
- Do not collect URLs by default.
- Do not collect page contents.
- Do not collect browsing history.
- Do not collect clipboard contents.
- Clearly explain analytics behavior.

---

# 45. Offline Behavior

The core dashboard should remain usable offline.

Offline features should include:

- Clock
- Date
- Bookmarks
- Tabs
- History
- Tasks
- Notes
- Quick tools
- Local settings

External features should gracefully degrade.

---

# 46. Empty States

Every dynamic widget needs a useful empty state.

Examples:

```text
No bookmarks found.

Add a bookmark in Chrome and it will appear here.
```

```text
No upcoming events.

Connect your calendar to see events here.
```

```text
No recent activity.

Browse normally and your local activity will appear here.
```

Never use fake data to make an empty state look populated.

---

# 47. Extension Communication

Use a clear messaging protocol between React and the Chrome extension layer.

Conceptually:

```text
React UI
   ↓
ExtensionBridge
   ↓
Message
   ↓
Background Service Worker
   ↓
Chrome API
   ↓
Response
   ↓
Provider
   ↓
Widget
```

Messages should have predictable structures.

Example:

```text
GET_BOOKMARKS
GET_TABS
GET_HISTORY
GET_RECENT_SESSIONS
GET_EXTENSIONS
```

Do not scatter raw `chrome.*` API calls throughout React components.

---

# 48. Mock Data Policy

During development, mock providers are permitted.

However:

```text
Mock Provider
```

must remain separate from:

```text
Production Provider
```

Never allow mock data to silently appear in production.

The application should clearly identify development/demo mode.

---

# 49. Integration Architecture

Future integrations should use adapters.

Example:

```text
IntegrationManager

GoogleCalendarAdapter
MicrosoftCalendarAdapter
GitHubAdapter
WeatherAdapter
RSSAdapter
```

Each integration should define:

- Authentication
- Permissions
- Data fetching
- Data normalization
- Refresh
- Disconnect
- Error handling

---

# 50. Future AI Layer

AI should not be required for the core application.

Possible future AI features:

- Smart bookmark categorization
- Intelligent search
- Suggested workspaces
- Summarize browsing sessions
- Smart task creation
- Natural-language command palette
- Contextual recommendations

AI must remain optional.

Never send private browser information to an AI service without explicit user permission.

---

# 51. Developer Dashboard

Provide an optional developer-focused widget collection.

Possible widgets:

```text
GitHub
Repositories
Pull Requests
Issues
Notifications

Deployment
Vercel
Cloudflare
Other supported providers

Developer Tools
JSON
JWT
Regex
Base64
URL
Timestamp
UUID
```

These should use real integrations when connected.

---

# 52. Product Navigation

Primary navigation should remain minimal.

Recommended:

```text
Dashboard
Search
Workspaces
Tools
Settings
```

Do not create unnecessary navigation.

Most actions should happen directly from the New Tab.

---

# 53. UI Interaction Philosophy

Use progressive disclosure.

The default page should remain clean.

Advanced functionality should appear through:

- Hover
- Click
- Context menu
- Command palette
- Expand controls
- Widget menus

Avoid showing every available option simultaneously.

---

# 54. Product Modes

Support predefined layouts.

### Minimal

```text
Clock
Search
Bookmarks
```

### Productivity

```text
Clock
Search
Calendar
Tasks
Bookmarks
Continue
```

### Developer

```text
Clock
Search
GitHub
Tabs
Bookmarks
Developer Tools
Workspaces
```

### Focus

```text
Clock
Task
Timer
```

### Custom

User-controlled widget arrangement.

---

# 55. Product Principles

The following rules should guide all implementation decisions:

1. Dynamic data over hardcoded data.
2. Local data over unnecessary cloud storage.
3. Browser APIs over duplicate browser functionality.
4. Modular providers over tightly coupled components.
5. Graceful failure over broken dashboards.
6. Fast startup over heavy initial loading.
7. Privacy over unnecessary analytics.
8. User control over automation.
9. Progressive disclosure over visual clutter.
10. Accessibility over purely visual interactions.
11. Extensibility over one-off implementations.
12. Real integrations over fake demonstrations.

---

# 56. MVP Scope

The first working version should focus on:

```text
Chrome Extension
        ↓
React New Tab
        ↓
Clock
        ↓
Universal Search
        ↓
Dynamic Bookmarks
        ↓
Open Tabs
        ↓
Recently Closed Tabs
        ↓
Basic History
        ↓
Tasks
        ↓
Notes
        ↓
Theme
        ↓
Widget Configuration
        ↓
Settings
```

Do not attempt the entire ecosystem in the first build.

---

# 57. Phase 2

Add:

- Calendar
- Weather
- Workspaces
- Focus mode
- Quick tools
- Command palette
- Advanced bookmark organization
- Recent activity
- Better tab management

---

# 58. Phase 3

Add:

- GitHub
- RSS
- Developer dashboard
- Additional integrations
- Smart search
- Usage insights
- Smart continuation

---

# 59. Phase 4

Add:

- Optional account system
- Cloud sync
- Backup
- Cross-device preferences
- AI features
- Widget marketplace
- Third-party widget SDK

---

# 60. Acceptance Criteria

The implementation should satisfy the following:

### Dashboard

- The New Tab loads successfully.
- The interface is responsive.
- Widgets are modular.
- Widgets can be enabled/disabled.
- Layout configuration persists.

### Bookmarks

- Real Chrome bookmarks are retrieved.
- Bookmark folders are represented correctly.
- Bookmark changes are reflected dynamically.
- No hardcoded bookmarks appear in production.

### Tabs

- Open tabs can be retrieved.
- Users can switch to a tab.
- Recently closed tabs can be displayed where supported.

### Search

- Search interface is fast.
- Bookmark results appear dynamically.
- History results appear dynamically.
- Tab results appear dynamically.
- Web search fallback works.

### Privacy

- Browser permissions are clearly explained.
- Local data remains local by default.
- External APIs receive minimum necessary data.

### Reliability

- Provider failures do not crash the dashboard.
- Permission failures have useful UI.
- Loading states exist.
- Empty states exist.
- Error states exist.

---

# 61. Critical Implementation Rule

Before implementing any feature, determine:

```text
Where does this data come from?
```

If the answer is:

```text
Hardcoded value
```

do not implement it that way if the information can be obtained dynamically.

Instead determine:

```text
Chrome API?
External API?
Local storage?
User configuration?
Integration?
```

Then create or use the appropriate provider.

---

# 62. Final Product Definition

The finished product should feel like:

> A premium, intelligent, privacy-conscious browser command center that replaces the default Chrome New Tab page and dynamically connects the user's browser environment, productivity tools, bookmarks, tabs, history, calendar, tasks, and other services into one customizable workspace.

The product should not feel like:

> A static dashboard containing fake bookmarks, fake events, decorative cards, and disconnected widgets.

The browser itself is the primary data source.

The dashboard is the interface layer over that browser data.

The architecture must preserve this principle throughout development.