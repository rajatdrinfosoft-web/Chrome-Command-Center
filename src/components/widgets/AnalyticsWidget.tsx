import { useState, useEffect } from 'react';
import { AnalyticsProvider, SiteStats } from '../../providers/AnalyticsProvider';

export const AnalyticsWidget = () => {
  const [stats, setStats] = useState<SiteStats[]>([]);

  useEffect(() => {
    AnalyticsProvider.getData().then(setStats);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-400">Most Visited</h2>
      <ul className="space-y-1">
        {stats.map(s => (
          <li key={s.url} className="text-sm text-neutral-300 flex justify-between">
            <span>{s.url}</span>
            <span className="text-neutral-500">{s.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
