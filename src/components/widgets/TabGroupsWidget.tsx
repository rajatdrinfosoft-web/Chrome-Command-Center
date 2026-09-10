import { useEffect, useState } from 'react';
import { TabProvider, Tab } from '../../providers/TabProvider';

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
      <h2 className="text-sm font-medium text-neutral-400">Tab Groups</h2>
      <div className="flex gap-2">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="New group" className="min-w-0 flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-white placeholder:text-neutral-600" />
        <button type="button" onClick={createGroup} className="rounded bg-cyan-500 px-2 py-1 text-xs font-medium text-black">Create</button>
      </div>
      {groups.length === 0 ? <p className="text-xs text-neutral-600">Create a local group to organize the current tab set.</p> : groups.map((group) => (
        <div key={group.id} className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-200">{group.name}</span>
            <button type="button" onClick={() => persistGroups(groups.filter((item) => item.id !== group.id))} className="text-[10px] text-red-400">Remove</button>
          </div>
          <div className="mt-2 space-y-1">
            {group.tabIds.map((tabId) => <div key={tabId} className="truncate text-[11px] text-neutral-500">{tabs.find((tab) => tab.id === tabId)?.title ?? tabId}</div>)}
            <select value="" onChange={(event) => event.target.value && addTabToGroup(group.id, event.target.value)} className="w-full rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] text-neutral-400">
              <option value="">Add open tab...</option>
              {tabs.filter((tab) => !group.tabIds.includes(tab.id)).map((tab) => <option key={tab.id} value={tab.id}>{tab.title}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};
