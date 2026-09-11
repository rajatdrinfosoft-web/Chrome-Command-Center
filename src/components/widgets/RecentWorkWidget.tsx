import { Compass, Clock, Bookmark, Layers } from 'lucide-react';
import { useState } from 'react';

export const RecentWorkWidget = () => {
  const [items] = useState([
    { id: '1', title: 'Resume Research', desc: 'From Tabs', icon: Layers, url: '#' },
    { id: '2', title: 'React Docs', desc: 'From History', icon: Clock, url: '#' },
    { id: '3', title: 'Project Board', desc: 'From Bookmarks', icon: Bookmark, url: '#' }
  ]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">CONTINUE WORK</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {items.map(item => (
          <a key={item.id} href={item.url} className="flex items-center gap-3 p-2 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/40 hover:bg-[var(--surface-strong)] hover:border-[var(--widget-accent)]/50 transition-colors group">
            <div className="p-2 rounded-lg bg-[var(--surface-strong)] border border-[var(--surface-line)] group-hover:text-[var(--widget-accent)] transition-colors">
              <item.icon className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[var(--page-ink)]">{item.title}</span>
              <span className="text-[10px] text-[var(--page-muted)]">{item.desc}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
