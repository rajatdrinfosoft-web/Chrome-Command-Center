import { Github, GitPullRequest, CircleDot } from 'lucide-react';
import { useState } from 'react';

export const GitHubWidget = () => {
  const [items] = useState([
    { id: '1', title: 'Update dependencies', type: 'pr', repo: 'user/project' },
    { id: '2', title: 'Fix navigation bug', type: 'issue', repo: 'user/project' }
  ]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <Github className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">GITHUB ACTIVITY</span>
        </div>
      </div>
      
      <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2.5 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/40 p-2 text-left hover:border-[var(--widget-accent)]/30 hover:bg-[var(--surface-strong)]/60 transition-all cursor-pointer">
             <div className="text-[var(--page-muted)]">
               {item.type === 'pr' ? <GitPullRequest className="h-4 w-4 text-emerald-400" /> : <CircleDot className="h-4 w-4 text-amber-400" />}
             </div>
             <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-medium text-[var(--page-ink)] truncate">{item.title}</span>
                <span className="text-[10px] text-[var(--page-muted)]">{item.repo}</span>
             </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
