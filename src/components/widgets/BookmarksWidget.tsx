import { useState, useEffect } from 'react';
import { BookmarkProvider, Bookmark } from '../../providers/BookmarkProvider';
import { Bookmark as BookmarkIcon, ExternalLink, Copy, Check, Globe, Folder, Settings2, Trash2, Link2Off, Tags, Download, Upload } from 'lucide-react';

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
  const [showTools, setShowTools] = useState(false);

  useEffect(() => {
    BookmarkProvider.getData().then(setBookmarks);
  }, []);

  const handleAction = (action: string) => {
    alert(`Mock Action: ${action} executed.`);
    setShowTools(false);
  };

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
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <BookmarkIcon className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">SAVED LINKS</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTools(!showTools)}
            className={`p-1 rounded-lg transition-colors ${showTools ? 'bg-[var(--widget-accent)] text-neutral-950' : 'text-[var(--page-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--page-ink)]'}`}
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
          <span className="rounded-full bg-[var(--widget-accent)]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--widget-accent)] border border-[var(--widget-accent)]/20">
            {filteredBookmarks.length} SAVED
          </span>
        </div>
      </div>

      {showTools && (
        <div className="grid grid-cols-2 gap-2 p-2 rounded-xl border border-[var(--widget-accent)]/30 bg-[var(--widget-accent)]/5 animate-fadeIn mb-1">
          <button onClick={() => handleAction('Auto-categorize')} className="flex items-center gap-1.5 rounded bg-[var(--surface-strong)] border border-[var(--surface-line)] px-2 py-1.5 text-[10px] uppercase font-bold text-[var(--page-ink)] hover:border-[var(--widget-accent)]/50 transition-colors">
            <Tags className="h-3 w-3 text-[var(--widget-accent)]" /> Categorize
          </button>
          <button onClick={() => handleAction('Clean Duplicates')} className="flex items-center gap-1.5 rounded bg-[var(--surface-strong)] border border-[var(--surface-line)] px-2 py-1.5 text-[10px] uppercase font-bold text-[var(--page-ink)] hover:border-amber-500/50 transition-colors">
            <Trash2 className="h-3 w-3 text-amber-400" /> Duplicates
          </button>
          <button onClick={() => handleAction('Check Dead Links')} className="flex items-center gap-1.5 rounded bg-[var(--surface-strong)] border border-[var(--surface-line)] px-2 py-1.5 text-[10px] uppercase font-bold text-[var(--page-ink)] hover:border-rose-500/50 transition-colors">
            <Link2Off className="h-3 w-3 text-rose-400" /> Dead Links
          </button>
          <div className="flex gap-1">
            <button onClick={() => handleAction('Export')} className="flex-1 flex items-center justify-center gap-1 rounded bg-[var(--surface-strong)] border border-[var(--surface-line)] px-2 py-1.5 text-[10px] uppercase font-bold text-[var(--page-ink)] hover:border-[var(--widget-accent)]/50 transition-colors" title="Export">
              <Download className="h-3 w-3" />
            </button>
            <button onClick={() => handleAction('Import')} className="flex-1 flex items-center justify-center gap-1 rounded bg-[var(--surface-strong)] border border-[var(--surface-line)] px-2 py-1.5 text-[10px] uppercase font-bold text-[var(--page-ink)] hover:border-[var(--widget-accent)]/50 transition-colors" title="Import">
              <Upload className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

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
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${b.isFolder ? 'bg-[var(--surface-strong)] border border-[var(--surface-line)]' : `bg-gradient-to-br ${getFaviconGradient(b.title)}`} text-[11px] font-bold text-white shadow-sm`}>
                  {b.isFolder ? <Folder className="h-3.5 w-3.5 text-[var(--page-muted)]" /> : b.title.charAt(0).toUpperCase()}
                </div>
                <div className="truncate min-w-0">
                  <span className={`block truncate font-medium group-hover:text-rose-300 ${b.status === 'dead' ? 'text-rose-400 line-through' : 'text-[var(--page-ink)]'}`}>
                    {b.title}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {!b.isFolder && (
                      <span className="block truncate text-[10px] text-[var(--page-muted)]">
                        {getDomain(b.url)}
                      </span>
                    )}
                    {b.category && (
                      <span className="text-[8px] uppercase tracking-wider font-bold text-[var(--widget-accent)] bg-[var(--widget-accent)]/10 px-1 rounded-sm">
                        {b.category}
                      </span>
                    )}
                    {b.usageCount !== undefined && b.usageCount > 0 && (
                      <span className="text-[8px] uppercase tracking-wider font-mono text-[var(--page-muted)]">
                        {b.usageCount} uses
                      </span>
                    )}
                  </div>
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
