import { useState, useEffect } from 'react';
import { TabProvider, Tab } from '../../providers/TabProvider';

export const TabsWidget = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);

  useEffect(() => {
    TabProvider.getData().then(setTabs);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-400">Open Tabs</h2>
      <ul className="space-y-1">
        {tabs.map(t => (
          <li key={t.id} className="text-sm text-neutral-300">
            {t.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
