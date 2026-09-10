import { useState, useEffect } from 'react';
import { BookmarkProvider, Bookmark } from '../../providers/BookmarkProvider';

export const BookmarksWidget = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    BookmarkProvider.getData().then(setBookmarks);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-400">Bookmarks</h2>
      <ul className="space-y-1">
        {bookmarks.map(b => (
          <li key={b.id} className="text-sm text-neutral-300">
            <a href={b.url} target="_blank" rel="noopener noreferrer">{b.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
