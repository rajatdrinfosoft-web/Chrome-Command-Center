import { useState, useEffect } from 'react';
import { TabProvider, Tab } from '../../providers/TabProvider';
import { LayoutGrid, Volume2, X, Globe, Pin, ExternalLink } from 'lucide-react';

const getDomain = (url?: string) => {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export const TabsWidget = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);

  useEffect(() => {
    TabProvider.getData().then(setTabs);
  }, []);

  const closeTab = (id: string) => {
    setTabs((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <LayoutGrid className="h-3.5 w-3.5" />
          </span>
          <h2 className="text-sm font-semibold tracking-wide text-[var(--page-ink)]">Active Browser Tabs</h2>
        </div>
        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-400 border border-amber-500/20">
          {tabs.length} Open
        </span>
      </div>

      {/* Tabs list */}
      <ul className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
        {tabs.length === 0 ? (
          <li className="py-4 text-center text-xs text-[var(--page-muted)]">No active browser tabs</li>
        ) : (
          tabs.map((t, idx) => (
            <li
              key={t.id}
              className="group flex items-center justify-between gap-2.5 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/50 p-2 text-xs transition-all hover:border-amber-500/30 hover:bg-[var(--surface-strong)]"
            >
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold">
                  {idx + 1}
                </div>
                <div className="truncate min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-medium text-[var(--page-ink)] group-hover:text-amber-300">
                      {t.title}
                    </span>
                    {idx === 0 && (
                      <span className="flex items-center gap-1 rounded bg-amber-500/20 px-1 py-0.2 text-[8px] font-bold text-amber-300">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span className="block truncate text-[10px] text-[var(--page-muted)]">
                    {getDomain(t.url)}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  title="Switch to tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => closeTab(t.id)}
                  className="opacity-0 group-hover:opacity-100 rounded-lg p-1 text-neutral-500 hover:bg-rose-500/20 hover:text-rose-400 transition-opacity"
                  title="Close tab"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
