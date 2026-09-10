import { useState, useEffect } from 'react';
import { HistoryProvider, HistoryItem } from '../../providers/HistoryProvider';

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

export const HistoryWidget = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [query, setQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<(typeof TIME_FILTERS)[number]['value']>('all');
  const [domainFilter, setDomainFilter] = useState('');

  useEffect(() => {
    HistoryProvider.getData().then(setHistory);
  }, []);

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
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-400">History</h2>

      <div className="space-y-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search history"
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-500"
        />

        <div className="flex gap-2">
          <select
            value={timeFilter}
            onChange={(event) => setTimeFilter(event.target.value as (typeof TIME_FILTERS)[number]['value'])}
            className="flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-2 text-sm text-neutral-300"
          >
            {TIME_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <input
            value={domainFilter}
            onChange={(event) => setDomainFilter(event.target.value)}
            placeholder="Domain"
            className="w-28 rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-2 text-sm text-white placeholder:text-neutral-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(groupedHistory).length === 0 ? (
          <p className="text-sm text-neutral-500">No matching history entries.</p>
        ) : (
          Object.entries(groupedHistory).map(([domain, items]) => (
            <div key={domain} className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-2">
              <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500">{domain}</div>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.id} className="text-sm text-neutral-300">
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
