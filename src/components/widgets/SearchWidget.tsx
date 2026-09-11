import { Search, Globe, Bookmark, History, LayoutGrid, ArrowRight, ExternalLink } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BookmarkProvider, Bookmark as BookmarkType } from '../../providers/BookmarkProvider';
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

const getSiteUrl = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue || /\s/.test(trimmedValue)) return null;

  const withProtocol = /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
  try {
    const parsedUrl = new URL(withProtocol);
    if (!parsedUrl.hostname.includes('.')) return null;

    // Correct the common keyboard typo in the example domain before opening it.
    if (!/^https?:\/\//i.test(trimmedValue) && parsedUrl.hostname.endsWith('.cpm')) {
      parsedUrl.hostname = `${parsedUrl.hostname.slice(0, -4)}.com`;
    }

    return parsedUrl.href;
  } catch {
    return null;
  }
};

export const SearchWidget = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { recordSearchQuery, keyboardShortcuts } = useAppStore();

  const parseQuery = (q: string) => {
    let rawQuery = q.toLowerCase();
    const typeMatch = rawQuery.match(/type:(bookmark|history|tab)/);
    const domainMatch = rawQuery.match(/domain:([a-z0-9.-]+)/);
    const tagMatch = rawQuery.match(/tag:([a-z0-9]+)/);
    
    let typeFilter = 'all';
    let domainFilter = '';
    let tagFilter = '';

    if (typeMatch) {
      typeFilter = typeMatch[1];
      rawQuery = rawQuery.replace(typeMatch[0], '');
    }
    if (domainMatch) {
      domainFilter = domainMatch[1];
      rawQuery = rawQuery.replace(domainMatch[0], '');
    }
    if (tagMatch) {
      tagFilter = tagMatch[1];
      rawQuery = rawQuery.replace(tagMatch[0], '');
    }

    return { rawQuery: rawQuery.trim(), typeFilter, domainFilter, tagFilter };
  };

  useEffect(() => {
    const focusSearch = () => inputRef.current?.focus();
    window.addEventListener('command-center:focus-search', focusSearch);
    return () => window.removeEventListener('command-center:focus-search', focusSearch);
  }, []);

  useEffect(() => {
    Promise.all([BookmarkProvider.getData(), HistoryProvider.getData(), TabProvider.getData()]).then(([bookmarks, history, tabs]) => {
      const nextResults: SearchResult[] = [
        ...bookmarks.filter((item: BookmarkType) => item.url).map((item: BookmarkType) => ({ id: `bookmark-${item.id}`, title: item.title, url: item.url ?? '', type: 'bookmark' as const })),
        ...history.map((item: HistoryItem) => ({ id: `history-${item.id}`, title: item.title, url: item.url, type: 'history' as const, visitedAt: item.visitedAt })),
        ...tabs.map((item: Tab) => ({ id: `tab-${item.id}`, title: item.title, url: item.url, type: 'tab' as const })),
      ];
      setResults(nextResults);
    });
  }, []);

  const { rawQuery, typeFilter, domainFilter, tagFilter } = parseQuery(query);

  const filteredResults = results.filter((item) => {
    const matchesQuery = !rawQuery || `${item.title} ${item.url}`.toLowerCase().includes(rawQuery);
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesDomain = !domainFilter || getDomain(item.url).includes(domainFilter);
    // For bookmarks we might have tags but mock data doesn't right now, just support parsing it
    return matchesQuery && matchesType && matchesDomain;
  }).sort((left, right) => {
    const leftExact = left.title.toLowerCase().startsWith(rawQuery) ? 1 : 0;
    const rightExact = right.title.toLowerCase().startsWith(rawQuery) ? 1 : 0;
    return rightExact - leftExact;
  }).slice(0, 6);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (value.trim().length > 2) recordSearchQuery(value);
  };

  const openSiteOrSearch = () => {
    const siteUrl = getSiteUrl(query);
    const destination = siteUrl ?? `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`;
    window.open(destination, '_blank', 'noopener,noreferrer');
    setQuery('');
  };

  const getTypeBadge = (itemType: 'bookmark' | 'history' | 'tab') => {
    switch (itemType) {
      case 'bookmark':
        return <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-rose-400 bg-rose-500/10 border border-rose-500/30">Bookmark</span>;
      case 'history':
        return <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-purple-400 bg-purple-500/10 border border-purple-500/30">History</span>;
      case 'tab':
        return <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-400 bg-amber-500/10 border border-amber-500/30">Open Tab</span>;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header and Shortcut Indicator */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">WEB & HISTORY SEARCH</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="flex items-center gap-1 rounded-full border border-[var(--widget-accent)]/30 bg-[var(--widget-accent)]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--widget-accent)] shadow-[0_0_8px_rgba(var(--widget-accent-rgb),0.2)] uppercase">
            {keyboardShortcuts.focusSearch === '/' ? 'Slash ( / )' : keyboardShortcuts.focusSearch}
          </kbd>
        </div>
      </div>

      {/* Cyber Search Input Box */}
      <div className="command-search relative rounded-2xl p-1 shadow-lg backdrop-blur-xl transition-all">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim() && (Boolean(getSiteUrl(query)) || !filteredResults.length)) {
              openSiteOrSearch();
            }
          }}
          placeholder="Search web, bookmarks, history, open tabs..."
          className="w-full bg-transparent py-3.5 pl-11 pr-24 text-sm font-medium text-[var(--page-ink)] placeholder:text-[var(--page-muted)] focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-neutral-800/80 px-2 py-1 text-[11px] text-neutral-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Source Category Pills & Domain Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-xl bg-[var(--surface-strong)]/80 p-1 border border-[var(--surface-line)]">
          <button
            type="button"
            onClick={() => setQuery(query.replace(/type:(bookmark|history|tab)\s?/, ''))}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
              typeFilter === 'all'
                ? 'bg-cyan-500 text-neutral-950 shadow-sm'
                : 'text-[var(--page-muted)] hover:text-[var(--page-ink)]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setQuery(query.includes('type:bookmark') ? query.replace(/type:bookmark\s?/, '') : query + ' type:bookmark')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
              typeFilter === 'bookmark'
                ? 'bg-rose-500 text-neutral-950 shadow-sm'
                : 'text-[var(--page-muted)] hover:text-[var(--page-ink)]'
            }`}
          >
            Bookmarks
          </button>
          <button
            type="button"
            onClick={() => setQuery(query.includes('type:history') ? query.replace(/type:history\s?/, '') : query + ' type:history')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
              typeFilter === 'history'
                ? 'bg-purple-500 text-neutral-950 shadow-sm'
                : 'text-[var(--page-muted)] hover:text-[var(--page-ink)]'
            }`}
          >
            History
          </button>
          <button
            type="button"
            onClick={() => setQuery(query.includes('type:tab') ? query.replace(/type:tab\s?/, '') : query + ' type:tab')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
              typeFilter === 'tab'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-[var(--page-muted)] hover:text-[var(--page-ink)]'
            }`}
          >
            Tabs
          </button>
        </div>

        <input
          value={domainFilter}
          onChange={(event) => {
             const val = event.target.value;
             const q = query.replace(/domain:[a-z0-9.-]+\s?/, '');
             setQuery(val ? `${q} domain:${val}` : q);
          }}
          placeholder="Filter domain (e.g. example.com)..."
          className="min-w-0 flex-1 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/60 px-3 py-1.5 text-xs text-[var(--page-ink)] placeholder:text-[var(--page-muted)] focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      {/* Quick Instant Search Match Dropdown */}
      {query.trim() && (
        <div className="space-y-1.5 rounded-2xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/90 p-2 shadow-2xl backdrop-blur-xl animate-fadeIn">
          {filteredResults.length ? (
            filteredResults.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-xl p-2 text-xs transition-all hover:bg-cyan-500/10 hover:border-cyan-500/20 border border-transparent"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300 group-hover:bg-cyan-500/20 group-hover:text-cyan-300">
                    <Globe className="h-3.5 w-3.5" />
                  </div>
                  <div className="truncate">
                    <span className="font-medium text-[var(--page-ink)] group-hover:text-cyan-200">
                      {item.title || item.url}
                    </span>
                    <span className="block truncate text-[10px] text-[var(--page-muted)]">
                      {item.url}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {getTypeBadge(item.type)}
                  <ExternalLink className="h-3.5 w-3.5 text-neutral-500 group-hover:text-cyan-400" />
                </div>
              </a>
            ))
          ) : (
            <div className="px-3 py-4 text-center">
              {getSiteUrl(query) ? (
                <button type="button" onClick={openSiteOrSearch} className="mx-auto flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-400/20">
                  <ExternalLink className="h-4 w-4" />
                  Open {getSiteUrl(query)}
                </button>
              ) : (
                <p className="text-sm font-medium text-[var(--page-ink)]">
                  Press <kbd className="mx-1 rounded bg-[var(--surface-line)] px-1.5 py-0.5 text-xs text-cyan-400">Enter</kbd> to search the web for "{query}"
                </p>
              )}
              <p className="mt-1 text-[11px] text-[var(--page-muted)]">
                No matching bookmarks, history, or open tabs found.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
