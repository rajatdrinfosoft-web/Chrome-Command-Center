import { useState, useEffect } from 'react';
import { AnalyticsProvider, SiteStats } from '../../providers/AnalyticsProvider';

export const AnalyticsWidget = () => {
  const [stats, setStats] = useState<SiteStats[]>([]);

  useEffect(() => {
    AnalyticsProvider.getData().then(setStats);
  }, []);

  const totalVisits = stats.reduce((sum, item) => sum + item.count, 0);
  const topSite = stats[0];

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-400">Most Visited</h2>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-2">
          <div className="text-neutral-500">Total visits</div>
          <div className="mt-1 text-lg font-semibold text-white">{totalVisits}</div>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-2">
          <div className="text-neutral-500">Top domain</div>
          <div className="mt-1 text-sm font-semibold text-white">{topSite?.url ?? '—'}</div>
        </div>
      </div>

      <ul className="space-y-1">
        {stats.map((item) => (
          <li key={item.url} className="flex items-center justify-between gap-2 text-sm text-neutral-300">
            <span className="truncate">{item.url}</span>
            <span className="text-neutral-500">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
