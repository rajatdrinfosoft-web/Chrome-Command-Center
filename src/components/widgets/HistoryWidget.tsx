import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryProvider, HistoryItem } from '../../providers/HistoryProvider';
import { History, Download, Trash2, Settings2, ExternalLink } from 'lucide-react';

const TIME_FILTERS = [
  { label: 'All time', value: 'all' },
  { label: 'Last 24h', value: '24h' },
  { label: 'Last 7d', value: '7d' },
  { label: 'Last 30d', value: '30d' },
] as const;

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
};

const formatTime = (timestamp?: number) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000 && now.getDate() === date.getDate()) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  if (diff < 172800000) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const HistoryWidget = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [query, setQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<(typeof TIME_FILTERS)[number]['value']>('all');
  const [domainFilter, setDomainFilter] = useState('');
  const [showControls, setShowControls] = useState(false);
  const [retentionDays, setRetentionDays] = useState('90');

  useEffect(() => {
    HistoryProvider.getData().then(setHistory);
  }, []);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear the local history cache?')) {
      setHistory([]);
      // In a real app, this would call HistoryProvider.clear()
    }
  };

  const handleExportHistory = () => {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `history-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredHistory = history.filter((item) => {
    const matchesQuery = !query || `${item.title} ${item.url}`.toLowerCase().includes(query.toLowerCase());
    const matchesDomain = !domainFilter || getDomain(item.url).includes(domainFilter.toLowerCase());

    if (!matchesQuery || !matchesDomain) return false;

    if (timeFilter === 'all') return true;

    const visitedAt = item.visitedAt ?? Date.now();
    const ms = Date.now() - visitedAt;
    const limitMs = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    }[timeFilter];

    return ms <= limitMs;
  });

  const groupedHistory = filteredHistory.reduce<Record<string, HistoryItem[]>>((groups, item) => {
    const domain = getDomain(item.url);
    groups[domain] = groups[domain] ?? [];
    groups[domain].push(item);
    return groups;
  }, {});

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">BROWSING HISTORY</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-1 rounded-lg transition-colors ${showControls ? 'bg-[var(--widget-accent)] text-neutral-950' : 'text-[var(--page-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--page-ink)]'}`}
            title="Settings"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
          <span className="rounded-full bg-[var(--widget-accent)]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--widget-accent)] border border-[var(--widget-accent)]/20">
            {filteredHistory.length} ENTRIES
          </span>
        </div>
      </div>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 p-2 rounded-xl border border-[var(--widget-accent)]/30 bg-[var(--widget-accent)]/5 mb-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-[var(--page-muted)]">Local Data Retention</span>
                <select
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(e.target.value)}
                  className="bg-[var(--surface-strong)] border border-[var(--surface-line)] rounded px-2 py-1 text-xs text-[var(--page-ink)] focus:outline-none"
                >
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                  <option value="365">1 Year</option>
                  <option value="forever">Forever</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExportHistory}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded bg-[var(--surface-strong)] border border-[var(--surface-line)] px-2 py-1.5 text-xs text-[var(--page-ink)] hover:border-[var(--widget-accent)]/50 transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Export
                </button>
                <button
                  onClick={handleClearHistory}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded bg-[var(--surface-strong)] border border-[var(--surface-line)] px-2 py-1.5 text-xs text-rose-400 hover:border-rose-500/50 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search history"
          className="w-full rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/80 px-3 py-2 text-xs text-[var(--page-ink)] placeholder:text-[var(--page-muted)] focus:outline-none focus:border-[var(--widget-accent)]/50 transition-colors shadow-inner"
        />

        <div className="flex gap-2">
          <select
            value={timeFilter}
            onChange={(event) => setTimeFilter(event.target.value as (typeof TIME_FILTERS)[number]['value'])}
            className="flex-1 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/80 px-2 py-2 text-xs text-[var(--page-ink)] focus:outline-none focus:border-[var(--widget-accent)]/50"
          >
            {TIME_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <input
            value={domainFilter}
            onChange={(event) => setDomainFilter(event.target.value)}
            placeholder="Domain filter"
            className="w-28 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/80 px-3 py-2 text-xs text-[var(--page-ink)] placeholder:text-[var(--page-muted)] focus:outline-none focus:border-[var(--widget-accent)]/50 shadow-inner"
          />
        </div>
      </div>

      <div className="flex-1 space-y-3 mt-2 overflow-y-auto pr-1 custom-scrollbar">
        {Object.entries(groupedHistory).length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4 text-center text-xs text-[var(--page-muted)]">
            No matching history entries.
          </motion.p>
        ) : (
          <AnimatePresence>
            {Object.entries(groupedHistory).map(([domain, items], index) => (
              <motion.div
                key={domain}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/30 p-3 hover:border-[var(--widget-accent)]/30 transition-all hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`} 
                      alt="" 
                      className="h-3 w-3 opacity-80"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--widget-accent)] truncate">
                      {domain}
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-medium text-[var(--page-muted)] bg-[var(--surface-line)]/50 px-1.5 py-0.5 rounded">
                    {items.length} {items.length === 1 ? 'VISIT' : 'VISITS'}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item.id} className="group/item flex items-center justify-between gap-2 text-xs text-[var(--page-ink)] truncate hover:text-[var(--widget-accent)] transition-colors cursor-pointer">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate pr-2" title={item.title}>
                        {item.title}
                      </a>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-[var(--page-muted)] font-mono">{formatTime(item.visitedAt)}</span>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <ExternalLink className="h-3 w-3 text-[var(--page-muted)] hover:text-[var(--widget-accent)]" />
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
