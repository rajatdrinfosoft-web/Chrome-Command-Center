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
};

export const getEnabledWidgets = (): string[] => Object.keys(WIDGET_MAP);
