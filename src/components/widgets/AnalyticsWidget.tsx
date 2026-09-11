import { useState, useEffect } from 'react';
import { AnalyticsProvider, SiteStats } from '../../providers/AnalyticsProvider';
import { BarChart3, Clock } from 'lucide-react';

const formatTime = (ms?: number) => {
  if (!ms) return '0m';
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const formatHour = (hour?: number) => {
  if (hour === undefined) return '—';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}${ampm}`;
};

export const AnalyticsWidget = () => {
  const [stats, setStats] = useState<SiteStats[]>([]);

  useEffect(() => {
    AnalyticsProvider.getData().then(setStats);
  }, []);

  const totalVisits = stats.reduce((sum, item) => sum + item.count, 0);
  const topSite = stats[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">TOP DOMAINS</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/30 p-3">
          <div className="text-[10px] uppercase font-bold text-[var(--page-muted)]">Total Visits</div>
          <div className="mt-1 text-lg font-bold text-[var(--page-ink)]">{totalVisits}</div>
        </div>
        <div className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/30 p-3">
          <div className="text-[10px] uppercase font-bold text-[var(--page-muted)]">Top Domain</div>
          <div className="mt-1 text-sm font-bold text-[var(--page-ink)] truncate">{topSite?.url ?? '—'}</div>
        </div>
      </div>

      <ul className="space-y-1.5 mt-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {stats.map((item) => (
          <li key={item.url} className="flex flex-col gap-1.5 p-2 rounded-lg border border-[var(--surface-line)] bg-[var(--surface-strong)]/20 hover:bg-[var(--surface-strong)]/50 transition-colors">
            <div className="flex items-center justify-between text-xs text-[var(--page-ink)]">
              <span className="truncate flex-1 font-medium">{item.url}</span>
              <span className="text-[10px] font-mono text-[var(--widget-accent)] bg-[var(--widget-accent)]/10 px-1.5 py-0.5 rounded border border-[var(--widget-accent)]/20">
                {item.count} hits
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[var(--page-muted)]">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatTime(item.timeSpentMs)}</span>
              </div>
              <div className="flex items-center gap-1 border-l border-[var(--surface-line)] pl-3">
                <BarChart3 className="h-3 w-3" />
                <span>Peak: {formatHour(item.busiestHour)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
