import { Search } from 'lucide-react';
import { useState } from 'react';

export const SearchWidget = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-neutral-400">Universal Search</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bookmarks, history, tabs..."
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
        />
      </div>
    </div>
  );
};
