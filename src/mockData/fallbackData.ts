export interface FallbackBookmark {
  id: string;
  title: string;
  url?: string;
  parentId?: string;
  category?: string;
  usageCount?: number;
  lastUsed?: number;
  status?: 'active' | 'dead';
  isFolder?: boolean;
}

export interface FallbackTab {
  id: string;
  title: string;
  url: string;
}

export interface FallbackHistoryItem {
  id: string;
  title: string;
  url: string;
  visitedAt?: number;
  timeSpentMs?: number;
}

export interface FallbackClosedTab {
  id: string;
  title: string;
  url: string;
}

export interface FallbackAnalyticsItem {
  url: string;
  count: number;
  timeSpentMs?: number;
  busiestHour?: number;
}

export const fallbackBookmarks: FallbackBookmark[] = [
  { id: 'dev-folder', title: 'Development', isFolder: true },
  { id: '2', title: 'React Documentation', url: 'https://react.dev', parentId: 'dev-folder', usageCount: 22, category: 'dev', status: 'active' },
  { id: '3', title: 'Tailwind CSS', url: 'https://tailwindcss.com', parentId: 'dev-folder', usageCount: 56, category: 'dev', status: 'active' },
  { id: '4', title: 'Figma', url: 'https://figma.com', usageCount: 15, category: 'design', status: 'active' },
  { id: '5', title: 'Google Calendar', url: 'https://calendar.google.com', usageCount: 100, category: 'productivity', status: 'active' },
  { id: '6', title: 'Notion', url: 'https://www.notion.so', usageCount: 30, category: 'productivity', status: 'active' },
  { id: '7', title: 'Linear', url: 'https://linear.app', usageCount: 25, category: 'productivity', status: 'active' },
  { id: '8', title: 'Vercel', url: 'https://vercel.com', parentId: 'dev-folder', usageCount: 10, category: 'dev', status: 'active' },
  { id: 'dead-link', title: 'Old Project (Dead)', url: 'https://this-site-does-not-exist.com/404', usageCount: 1, status: 'dead' },
  { id: 'dup-1', title: 'Figma Duplicate', url: 'https://figma.com', usageCount: 0, status: 'active' },
];

export const fallbackTabs: FallbackTab[] = [
  { id: '1', title: 'Product Specification', url: 'https://ais-dev.run.app/guide/spec' },
  { id: '2', title: 'Technical Architecture', url: 'https://ais-dev.run.app/guide/tech' },
  { id: '4', title: 'Figma Design', url: 'https://figma.com/design' },
  { id: '5', title: 'Calendar Meeting', url: 'https://meet.google.com' },
  { id: '6', title: 'Email Inbox', url: 'https://mail.google.com' },
];

export const fallbackHistory: FallbackHistoryItem[] = [
  { id: '2', title: 'React Hook Docs', url: 'https://react.dev/reference/react' },
  { id: '3', title: 'Tailwind Components', url: 'https://tailwindcss.com/docs' },
  { id: '4', title: 'Chrome DevTools', url: 'https://developer.chrome.com/docs/devtools/' },
  { id: '5', title: 'Notion Workspace', url: 'https://www.notion.so' },
  { id: '6', title: 'Figma Prototype', url: 'https://www.figma.com/file/' },
];

export const fallbackRecentlyClosedTabs: FallbackClosedTab[] = [
  { id: '1', title: 'Product Specification', url: 'https://ais-dev.run.app/guide/spec' },
  { id: '2', title: 'Dashboard Planning', url: 'https://example.com/planning' },
  { id: '3', title: 'Session Notes', url: 'https://example.com/notes' },
];

export const fallbackAnalytics: FallbackAnalyticsItem[] = [
  { url: 'react.dev', count: 28, timeSpentMs: 5000000, busiestHour: 14 },
  { url: 'tailwindcss.com', count: 19, timeSpentMs: 2000000, busiestHour: 15 },
  { url: 'figma.com', count: 17, timeSpentMs: 8000000, busiestHour: 11 },
  { url: 'calendar.google.com', count: 11, timeSpentMs: 600000, busiestHour: 9 },
];

export const fallbackBlockedSites = ['youtube.com', 'reddit.com', 'x.com'];
