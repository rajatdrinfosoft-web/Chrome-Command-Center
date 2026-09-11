import { useState, useEffect } from 'react';
import { BookmarkProvider, Bookmark } from '../../providers/BookmarkProvider';
import { Bookmark as BookmarkIcon, ExternalLink, Copy, Check, Globe } from 'lucide-react';

const getDomain = (url?: string) => {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const getFaviconGradient = (title: string) => {
  const charCode = title.charCodeAt(0) || 0;
  const gradients = [
    'from-rose-500 to-orange-500',
    'from-cyan-500 to-blue-500',
    'from-amber-500 to-emerald-500',
    'from-purple-500 to-pink-500',
    'from-teal-500 to-cyan-500',
  ];
  return gradients[charCode % gradients.length];
};

export const BookmarksWidget = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    BookmarkProvider.getData().then(setBookmarks);
  }, []);

  const filteredBookmarks = bookmarks.filter((bookmark) => 
    `${bookmark.title} ${bookmark.url ?? ''}`.toLowerCase().includes(query.toLowerCase())
  );

  const duplicateCount = filteredBookmarks.length - new Set(filteredBookmarks.map((bookmark) => bookmark.url).filter(Boolean)).size;

  const handleCopy = (id: string, url?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <BookmarkIcon className="h-3.5 w-3.5" />
          </span>
          <h2 className="text-sm font-semibold tracking-wide text-[var(--page-ink)]">Quick Bookmarks</h2>
        </div>
        <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-400 border border-rose-500/20">
          {filteredBookmarks.length} Saved
        </span>
      </div>

      {/* Filter search */}
      <div className="relative">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter bookmarks..."
          className="w-full rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/80 px-3 py-1.5 text-xs text-[var(--page-ink)] placeholder:text-[var(--page-muted)] focus:outline-none focus:border-rose-500/50 transition-colors shadow-inner"
        />
      </div>

      {duplicateCount > 0 && (
        <p className="rounded-lg bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-300 border border-amber-500/20">
          {duplicateCount} duplicate URL{duplicateCount === 1 ? '' : 's'} detected in view.
        </p>
      )}

      {/* Bookmarks List */}
      <ul className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
        {filteredBookmarks.length === 0 ? (
          <li className="py-4 text-center text-xs text-[var(--page-muted)]">No bookmarks matching query</li>
        ) : (
          filteredBookmarks.map((b) => (
            <li
              key={b.id}
              className="group flex items-center justify-between gap-2.5 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/50 p-2 text-xs transition-all hover:border-rose-500/30 hover:bg-[var(--surface-strong)]"
            >
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${getFaviconGradient(b.title)} text-[11px] font-bold text-white shadow-sm`}>
                  {b.title.charAt(0).toUpperCase()}
                </div>
                <div className="truncate min-w-0">
                  <span className="block truncate font-medium text-[var(--page-ink)] group-hover:text-rose-300">
                    {b.title}
                  </span>
                  <span className="block truncate text-[10px] text-[var(--page-muted)]">
                    {getDomain(b.url)}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(b.id, b.url)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                  title="Copy Link"
                >
                  {copiedId === b.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
                  title="Open Link"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
