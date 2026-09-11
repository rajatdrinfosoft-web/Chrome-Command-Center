import { ClockWidget } from '../components/widgets/ClockWidget';
import { SearchWidget } from '../components/widgets/SearchWidget';
import { TasksWidget } from '../components/widgets/TasksWidget';
import { NotesWidget } from '../components/widgets/NotesWidget';
import { BookmarksWidget } from '../components/widgets/BookmarksWidget';
import { TabsWidget } from '../components/widgets/TabsWidget';
import { HistoryWidget } from '../components/widgets/HistoryWidget';
import { RecentlyClosedTabsWidget } from '../components/widgets/RecentlyClosedTabsWidget';
import { PomodoroWidget } from '../components/widgets/PomodoroWidget';
import { AnalyticsWidget } from '../components/widgets/AnalyticsWidget';
import { SessionHeatmapWidget } from '../components/widgets/SessionHeatmapWidget';
import { QuickToolsWidget } from '../components/widgets/QuickToolsWidget';
import { StatisticsWidget } from '../components/widgets/StatisticsWidget';
import { SessionsWidget } from '../components/widgets/SessionsWidget';
import { TabGroupsWidget } from '../components/widgets/TabGroupsWidget';
import { WorkspacesWidget } from '../components/widgets/WorkspacesWidget';
import { CalendarWidget } from '../components/widgets/CalendarWidget';
import { WeatherWidget } from '../components/widgets/WeatherWidget';
import { GitHubWidget } from '../components/widgets/GitHubWidget';
import { ExtensionInfoWidget } from '../components/widgets/ExtensionInfoWidget';
import { RecentWorkWidget } from '../components/widgets/RecentWorkWidget';
import React from 'react';

export const WIDGET_REGISTRY: Record<string, any> = {
  clock: { id: 'clock', name: 'Clock' },
  search: { id: 'search', name: 'Search' },
  tasks: { id: 'tasks', name: 'Tasks' },
  notes: { id: 'notes', name: 'Notes' },
  bookmarks: { id: 'bookmarks', name: 'Bookmarks' },
  tabs: { id: 'tabs', name: 'Tabs' },
  history: { id: 'history', name: 'History' },
  recentlyClosed: { id: 'recentlyClosed', name: 'Recently Closed' },
  pomodoro: { id: 'pomodoro', name: 'Pomodoro' },
  analytics: { id: 'analytics', name: 'Analytics' },
  sessionHeatmap: { id: 'sessionHeatmap', name: 'Session Heatmap' },
  quickTools: { id: 'quickTools', name: 'Developer Tools' },
  statistics: { id: 'statistics', name: 'Statistics' },
  sessions: { id: 'sessions', name: 'Saved Sessions' },
  tabGroups: { id: 'tabGroups', name: 'Tab Groups' },
  workspaces: { id: 'workspaces', name: 'Workspaces' },
  calendar: { id: 'calendar', name: 'Calendar' },
  weather: { id: 'weather', name: 'Weather' },
  github: { id: 'github', name: 'GitHub' },
  extensionInfo: { id: 'extensionInfo', name: 'Extension Info' },
  recentWork: { id: 'recentWork', name: 'Recent Work' },
};

export const WIDGET_MAP: Record<string, React.FC> = {
  clock: ClockWidget,
  search: SearchWidget,
  tasks: TasksWidget,
  notes: NotesWidget,
  bookmarks: BookmarksWidget,
  tabs: TabsWidget,
  history: HistoryWidget,
  recentlyClosed: RecentlyClosedTabsWidget,
  pomodoro: PomodoroWidget,
  analytics: AnalyticsWidget,
  sessionHeatmap: SessionHeatmapWidget,
  quickTools: QuickToolsWidget,
  statistics: StatisticsWidget,
  sessions: SessionsWidget,
  tabGroups: TabGroupsWidget,
  workspaces: WorkspacesWidget,
  calendar: CalendarWidget,
  weather: WeatherWidget,
  github: GitHubWidget,
  extensionInfo: ExtensionInfoWidget,
  recentWork: RecentWorkWidget,
};

export const getEnabledWidgets = (): string[] => Object.keys(WIDGET_MAP);
