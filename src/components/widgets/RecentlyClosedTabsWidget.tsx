import { useState, useEffect } from 'react';
import { RecentlyClosedTabsProvider, ClosedTab } from '../../providers/RecentlyClosedTabsProvider';

export const RecentlyClosedTabsWidget = () => {
  const [tabs, setTabs] = useState<ClosedTab[]>([]);

  useEffect(() => {
    RecentlyClosedTabsProvider.getData().then(setTabs);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-400">Recently Closed</h2>
      <ul className="space-y-1">
        {tabs.map(t => (
          <li key={t.id} className="text-sm text-neutral-300 truncate">
            {t.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
