import { useEffect, useState } from 'react';
import { AnalyticsProvider, SiteStats } from '../../providers/AnalyticsProvider';
import { HistoryProvider, HistoryItem } from '../../providers/HistoryProvider';
import { useAppStore } from '../../stores/appStore';

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export const StatisticsWidget = () => {
  const [analytics, setAnalytics] = useState<SiteStats[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const focusSessions = useAppStore((state) => state.focusSessions);
  const searchCount = useAppStore((state) => state.searchQueries.length);

  useEffect(() => {
    Promise.all([AnalyticsProvider.getData(), HistoryProvider.getData()]).then(([nextAnalytics, nextHistory]) => {
      setAnalytics(nextAnalytics);
      setHistory(nextHistory);
    });
  }, []);

  const totalVisits = analytics.reduce((sum, item) => sum + item.count, 0);
  const totalFocusMinutes = focusSessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  const activeDays = new Set(history.map((item) => new Date(item.visitedAt ?? Date.now()).toDateString())).size;
  const domains = new Set(history.map((item) => getDomain(item.url))).size;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-400">Productivity Statistics</h2>
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">Local</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        {[
          ['Visits', totalVisits],
          ['Domains', domains],
          ['Focus min', totalFocusMinutes],
          ['Searches', searchCount],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-2">
            <div className="text-neutral-500">{label}</div>
            <div className="mt-1 text-lg font-semibold text-white">{value}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-neutral-500">Activity spans {activeDays} local day{activeDays === 1 ? '' : 's'}.</p>
    </div>
  );
};