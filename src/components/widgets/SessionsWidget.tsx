import { useEffect, useState } from 'react';
import { SessionProvider, BrowserSession } from '../../providers/SessionProvider';
import { TabProvider, Tab } from '../../providers/TabProvider';

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
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-400">Saved Sessions</h2>
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">Local</span>
      </div>
      <div className="flex gap-2">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Session name" className="min-w-0 flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-white placeholder:text-neutral-600" />
        <button type="button" onClick={saveCurrentSession} className="rounded bg-cyan-500 px-2 py-1 text-xs font-medium text-black">Save tabs</button>
      </div>
      {sessions.length === 0 ? <p className="text-xs text-neutral-600">Save the current tab snapshot to restore it later.</p> : (
        <ul className="space-y-2">
          {sessions.map((session) => (
            <li key={session.id} className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950/50 p-2">
              <button type="button" onClick={() => restoreSession(session)} className="min-w-0 flex-1 text-left">
                <span className="block truncate text-xs text-neutral-200">{session.name}</span>
                <span className="text-[10px] text-neutral-600">{session.tabs.length} tabs</span>
              </button>
              <button type="button" onClick={async () => { await SessionProvider.remove(session.id); load(); }} className="text-[10px] text-red-400">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
