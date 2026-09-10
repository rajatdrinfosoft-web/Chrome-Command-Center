import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BookmarkProvider, Bookmark } from '../../providers/BookmarkProvider';
import { HistoryProvider, HistoryItem } from '../../providers/HistoryProvider';
import { TabProvider, Tab } from '../../providers/TabProvider';
import { useAppStore } from '../../stores/appStore';

type SearchType = 'all' | 'bookmark' | 'history' | 'tab';
type SearchResult = { id: string; title: string; url: string; type: Exclude<SearchType, 'all'>; visitedAt?: number };

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

export const SearchWidget = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<SearchType>('all');
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const recordSearchQuery = useAppStore((state) => state.recordSearchQuery);

  useEffect(() => {
    const focusSearch = () => inputRef.current?.focus();
    window.addEventListener('command-center:focus-search', focusSearch);
    return () => window.removeEventListener('command-center:focus-search', focusSearch);
  }, []);

  useEffect(() => {
    Promise.all([BookmarkProvider.getData(), HistoryProvider.getData(), TabProvider.getData()]).then(([bookmarks, history, tabs]) => {
      const nextResults: SearchResult[] = [
        ...bookmarks.filter((item: Bookmark) => item.url).map((item: Bookmark) => ({ id: `bookmark-${item.id}`, title: item.title, url: item.url ?? '', type: 'bookmark' as const })),
        ...history.map((item: HistoryItem) => ({ id: `history-${item.id}`, title: item.title, url: item.url, type: 'history' as const, visitedAt: item.visitedAt })),
        ...tabs.map((item: Tab) => ({ id: `tab-${item.id}`, title: item.title, url: item.url, type: 'tab' as const })),
      ];
      setResults(nextResults);
    });
  }, []);

  const filteredResults = results.filter((item) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = !normalizedQuery || `${item.title} ${item.url}`.toLowerCase().includes(normalizedQuery);
    const matchesType = type === 'all' || item.type === type;
    const matchesDomain = !domain.trim() || getDomain(item.url).includes(domain.trim().toLowerCase());
    return matchesQuery && matchesType && matchesDomain;
  }).sort((left, right) => {
    const queryLower = query.trim().toLowerCase();
    const leftExact = left.title.toLowerCase().startsWith(queryLower) ? 1 : 0;
    const rightExact = right.title.toLowerCase().startsWith(queryLower) ? 1 : 0;
    return rightExact - leftExact;
  }).slice(0, 8);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (value.trim().length > 2) recordSearchQuery(value);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="command-kicker">Universal search</h2>
        <kbd className="rounded-md border border-[var(--surface-line)] px-2 py-1 text-[10px] text-[var(--page-muted)]">⌘ K</kbd>
      </div>
      <div className="command-search relative rounded-2xl p-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search bookmarks, history, tabs..."
          className="w-full bg-transparent py-4 pl-12 pr-4 text-[var(--page-ink)] placeholder:text-[var(--page-muted)] focus:outline-none"
        />
      </div>
      <div className="flex gap-2">
        <select value={type} onChange={(event) => setType(event.target.value as SearchType)} className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-300">
          <option value="all">All sources</option>
          <option value="bookmark">Bookmarks</option>
          <option value="history">History</option>
          <option value="tab">Open tabs</option>
        </select>
        <input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="Domain filter" className="min-w-0 flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-300 placeholder:text-neutral-600" />
      </div>
      {query.trim() && (
        <div className="space-y-1">
          {filteredResults.length ? filteredResults.map((item) => (
            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800">
              <span className="truncate">{item.title || item.url}</span>
              <span className="shrink-0 text-[10px] uppercase text-neutral-600">{item.type}</span>
            </a>
          )) : <p className="px-2 text-xs text-neutral-600">No matching browser data.</p>}
        </div>
      )}
    </div>
  );
};
