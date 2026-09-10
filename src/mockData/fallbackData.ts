export interface FallbackBookmark {
  id: string;
  title: string;
  url: string;
  parentId?: string;
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
}

export interface FallbackClosedTab {
  id: string;
  title: string;
  url: string;
}

export interface FallbackAnalyticsItem {
  url: string;
  count: number;
}

export const fallbackBookmarks: FallbackBookmark[] = [
  { id: '1', title: 'GitHub', url: 'https://github.com' },
  { id: '2', title: 'React Documentation', url: 'https://react.dev' },
  { id: '3', title: 'Tailwind CSS', url: 'https://tailwindcss.com' },
  { id: '4', title: 'Figma', url: 'https://figma.com' },
  { id: '5', title: 'Google Calendar', url: 'https://calendar.google.com' },
  { id: '6', title: 'Notion', url: 'https://www.notion.so' },
  { id: '7', title: 'Linear', url: 'https://linear.app' },
  { id: '8', title: 'Vercel', url: 'https://vercel.com' },
];

export const fallbackTabs: FallbackTab[] = [
  { id: '1', title: 'Product Specification', url: 'https://ais-dev.run.app/guide/spec' },
  { id: '2', title: 'Technical Architecture', url: 'https://ais-dev.run.app/guide/tech' },
  { id: '3', title: 'GitHub Issue #42', url: 'https://github.com/issues/42' },
  { id: '4', title: 'Figma Design', url: 'https://figma.com/design' },
  { id: '5', title: 'Calendar Meeting', url: 'https://meet.google.com' },
  { id: '6', title: 'Email Inbox', url: 'https://mail.google.com' },
];

export const fallbackHistory: FallbackHistoryItem[] = [
  { id: '1', title: 'GitHub Dashboard', url: 'https://github.com/dashboard' },
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
  { url: 'github.com', count: 42 },
  { url: 'react.dev', count: 28 },
  { url: 'tailwindcss.com', count: 19 },
  { url: 'figma.com', count: 17 },
  { url: 'calendar.google.com', count: 11 },
];

export const fallbackBlockedSites = ['youtube.com', 'reddit.com', 'x.com'];
