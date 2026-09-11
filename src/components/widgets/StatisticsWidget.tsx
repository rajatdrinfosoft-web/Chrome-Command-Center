import { useEffect, useState } from 'react';
import { AnalyticsProvider, SiteStats } from '../../providers/AnalyticsProvider';
import { HistoryProvider, HistoryItem } from '../../providers/HistoryProvider';
import { useAppStore } from '../../stores/appStore';
import { PieChart } from 'lucide-react';

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
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">SYSTEM TELEMETRY</span>
        </div>
        <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[var(--widget-accent)] bg-[var(--widget-accent)]/10 border border-[var(--widget-accent)]/20 px-2 py-0.5 rounded-full">
          LOCAL
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 mt-1">
        {[
          ['Visits', totalVisits],
          ['Domains', domains],
          ['Focus Min', totalFocusMinutes],
          ['Searches', searchCount],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col items-center justify-center rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/30 p-3 hover:bg-[var(--surface-strong)] hover:border-[var(--widget-accent)]/40 transition-colors">
            <div className="text-[10px] uppercase font-bold text-[var(--page-muted)]">{label}</div>
            <div className="mt-1 text-xl font-bold text-[var(--page-ink)]">{value}</div>
          </div>
        ))}
      </div>
      <p className="text-[10px] font-medium text-[var(--page-muted)] text-center mt-2">
        Activity spans <span className="text-[var(--page-ink)] font-bold">{activeDays}</span> local day{activeDays === 1 ? '' : 's'}.
      </p>
    </div>
  );
};