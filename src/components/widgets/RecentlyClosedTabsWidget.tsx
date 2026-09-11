import { useState, useEffect } from 'react';
import { RecentlyClosedTabsProvider, ClosedTab } from '../../providers/RecentlyClosedTabsProvider';
import { ArchiveRestore } from 'lucide-react';

export const RecentlyClosedTabsWidget = () => {
  const [tabs, setTabs] = useState<ClosedTab[]>([]);

  useEffect(() => {
    RecentlyClosedTabsProvider.getData().then(setTabs);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <ArchiveRestore className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">RECENTLY CLOSED</span>
        </div>
        <span className="rounded-full bg-[var(--widget-accent)]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--widget-accent)] border border-[var(--widget-accent)]/20">
          {tabs.length} RECENT
        </span>
      </div>
      <ul className="space-y-1">
        {tabs.map(t => (
          <li key={t.id} className="text-xs text-[var(--page-ink)] truncate px-2 py-1.5 rounded bg-[var(--surface-strong)]/30 border border-[var(--surface-line)] hover:border-[var(--widget-accent)]/30 hover:bg-[var(--surface-strong)] transition-colors cursor-pointer">
            {t.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
