import { useEffect, useState } from 'react';
import { TabProvider, Tab } from '../../providers/TabProvider';
import { Folders } from 'lucide-react';

interface TabGroup {
  id: string;
  name: string;
  tabIds: string[];
}

const STORAGE_KEY = 'command-center:tab-groups';

export const TabGroupsWidget = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [groups, setGroups] = useState<TabGroup[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    TabProvider.getData().then(setTabs);
    try {
      setGroups(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as TabGroup[]);
    } catch {
      setGroups([]);
    }
  }, []);

  const persistGroups = (nextGroups: TabGroup[]) => {
    setGroups(nextGroups);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextGroups));
  };

  const createGroup = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    persistGroups([...groups, { id: `group-${Date.now()}`, name: trimmedName, tabIds: [] }]);
    setName('');
  };

  const addTabToGroup = (groupId: string, tabId: string) => {
    persistGroups(groups.map((group) => group.id === groupId && !group.tabIds.includes(tabId)
      ? { ...group, tabIds: [...group.tabIds, tabId] }
      : group));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Folders className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">TAB GROUPS</span>
        </div>
      </div>
      <div className="flex gap-2">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="New group" className="min-w-0 flex-1 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/80 px-3 py-2 text-xs text-[var(--page-ink)] placeholder:text-[var(--page-muted)] focus:outline-none focus:border-[var(--widget-accent)]/50 shadow-inner transition-colors" />
        <button type="button" onClick={createGroup} className="rounded-xl bg-[var(--widget-accent)] px-3 py-2 text-xs font-bold text-neutral-950 hover:bg-[var(--widget-accent)]/90 transition-colors shadow-[0_0_12px_rgba(var(--widget-accent-rgb),0.3)]">Create</button>
      </div>
      {groups.length === 0 ? <p className="text-xs text-[var(--page-muted)] mt-2">Create a local group to organize the current tab set.</p> : (
        <div className="space-y-2 mt-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
          {groups.map((group) => (
            <div key={group.id} className="rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/30 p-3 hover:border-[var(--widget-accent)]/30 transition-colors group/card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--page-ink)]">{group.name}</span>
                <button type="button" onClick={() => persistGroups(groups.filter((item) => item.id !== group.id))} className="text-[10px] font-bold uppercase text-[var(--page-muted)] hover:text-rose-400 bg-[var(--surface-strong)] px-2 py-1 rounded transition-colors opacity-0 group-hover/card:opacity-100">Remove</button>
              </div>
              <div className="space-y-1.5">
                {group.tabIds.map((tabId) => <div key={tabId} className="truncate text-[10px] text-[var(--page-muted)] flex items-center gap-1.5 before:content-[''] before:w-1 before:h-1 before:bg-[var(--widget-accent)]/50 before:rounded-full">{tabs.find((tab) => tab.id === tabId)?.title ?? tabId}</div>)}
                <select value="" onChange={(event) => event.target.value && addTabToGroup(group.id, event.target.value)} className="w-full rounded border border-[var(--surface-line)] bg-[var(--surface-strong)] px-2 py-1 text-[10px] text-[var(--page-ink)] mt-1 focus:outline-none focus:border-[var(--widget-accent)]/50">
                  <option value="">Add open tab...</option>
                  {tabs.filter((tab) => !group.tabIds.includes(tab.id)).map((tab) => <option key={tab.id} value={tab.id}>{tab.title}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
