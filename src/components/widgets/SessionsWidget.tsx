import { useEffect, useState } from 'react';
import { SessionProvider, BrowserSession } from '../../providers/SessionProvider';
import { TabProvider, Tab } from '../../providers/TabProvider';
import { Save } from 'lucide-react';

export const SessionsWidget = () => {
  const [sessions, setSessions] = useState<BrowserSession[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [name, setName] = useState('');

  const load = () => SessionProvider.getData().then(setSessions);

  useEffect(() => {
    TabProvider.getData().then(setTabs);
    load();
  }, []);

  const saveCurrentSession = async () => {
    await SessionProvider.save(name, tabs);
    setName('');
    load();
  };

  const restoreSession = (session: BrowserSession) => {
    session.tabs.forEach((tab) => window.open(tab.url, '_blank', 'noopener,noreferrer'));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Save className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">SAVED SESSIONS</span>
        </div>
        <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[var(--widget-accent)] bg-[var(--widget-accent)]/10 border border-[var(--widget-accent)]/20 px-2 py-0.5 rounded-full">
          LOCAL
        </span>
      </div>
      <div className="flex gap-2">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Session name" className="min-w-0 flex-1 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/80 px-3 py-2 text-xs text-[var(--page-ink)] placeholder:text-[var(--page-muted)] focus:outline-none focus:border-[var(--widget-accent)]/50 shadow-inner transition-colors" />
        <button type="button" onClick={saveCurrentSession} className="rounded-xl bg-[var(--widget-accent)] px-3 py-2 text-xs font-bold text-neutral-950 hover:bg-[var(--widget-accent)]/90 transition-colors shadow-[0_0_12px_rgba(var(--widget-accent-rgb),0.3)]">Save Tabs</button>
      </div>
      {sessions.length === 0 ? <p className="text-xs text-[var(--page-muted)] mt-2">Save the current tab snapshot to restore it later.</p> : (
        <ul className="space-y-2 mt-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
          {sessions.map((session) => (
            <li key={session.id} className="group flex items-center justify-between gap-2 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/30 p-2.5 hover:border-[var(--widget-accent)]/30 transition-colors">
              <button type="button" onClick={() => restoreSession(session)} className="min-w-0 flex-1 text-left">
                <span className="block truncate text-xs font-bold text-[var(--page-ink)] group-hover:text-[var(--widget-accent)] transition-colors">{session.name}</span>
                <span className="text-[10px] text-[var(--page-muted)] font-mono">{session.tabs.length} tabs</span>
              </button>
              <button type="button" onClick={async () => { await SessionProvider.remove(session.id); load(); }} className="text-[10px] font-bold uppercase text-[var(--page-muted)] hover:text-rose-400 bg-[var(--surface-strong)] px-2 py-1 rounded transition-colors opacity-0 group-hover:opacity-100">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
