import { useState, useEffect } from 'react';
import { BookmarkProvider, Bookmark } from '../../providers/BookmarkProvider';

export const BookmarksWidget = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    BookmarkProvider.getData().then(setBookmarks);
  }, []);

  const filteredBookmarks = bookmarks.filter((bookmark) => `${bookmark.title} ${bookmark.url ?? ''}`.toLowerCase().includes(query.toLowerCase()));
  const duplicateCount = filteredBookmarks.length - new Set(filteredBookmarks.map((bookmark) => bookmark.url).filter(Boolean)).size;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-400">Bookmarks</h2>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter bookmarks" className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder:text-neutral-600" />
      {duplicateCount > 0 && <p className="text-[11px] text-amber-300">{duplicateCount} duplicate URL{duplicateCount === 1 ? '' : 's'} found in this view.</p>}
      <ul className="space-y-1">
        {filteredBookmarks.map(b => (
          <li key={b.id} className="text-sm text-neutral-300">
            <a href={b.url} target="_blank" rel="noopener noreferrer">{b.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
