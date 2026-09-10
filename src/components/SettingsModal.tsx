import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { useWidgetContext } from '../context/WidgetContext';

export const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const {
    theme,
    setTheme,
    currentWorkspace,
    setCurrentWorkspace,
    workspaces,
    createWorkspace,
    renameWorkspace,
    deleteWorkspace,
    vimMode,
    setVimMode,
    keyboardShortcuts,
    setKeyboardShortcut,
    customCommands,
    addCustomCommand,
    removeCustomCommand,
    accentColor,
    setAccentColor,
    backgroundMode,
    setBackgroundMode,
    customBackground,
    setCustomBackground,
    reducedMotion,
    setReducedMotion,
    layoutPresets,
    saveLayoutPreset,
    applyLayoutPreset,
    removeLayoutPreset,
  } = useAppStore();
  const { enabledWidgets, setEnabledWidgets } = useWidgetContext();
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [customCommandLabel, setCustomCommandLabel] = useState('');
  const [customCommandShortcut, setCustomCommandShortcut] = useState('');
  const [customCommandAction, setCustomCommandAction] = useState<'focus-search' | 'settings' | 'toggle-widgets' | 'reload'>('focus-search');
  const [layoutName, setLayoutName] = useState('');

  if (!isOpen) return null;

  const toggleWidget = (id: string) => {
    if (enabledWidgets.includes(id)) {
      setEnabledWidgets(enabledWidgets.filter((w) => w !== id));
    } else {
      setEnabledWidgets([...enabledWidgets, id]);
    }
  };

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) return;
    createWorkspace(newWorkspaceName);
    setNewWorkspaceName('');
  };

  const handleAddCustomCommand = () => {
    if (!customCommandLabel.trim() || !customCommandShortcut.trim()) return;
    addCustomCommand({ label: customCommandLabel, shortcut: customCommandShortcut, action: customCommandAction });
    setCustomCommandLabel('');
    setCustomCommandShortcut('');
  };

  const exportData = () => {
    const data = {
      appStore: localStorage.getItem('app-store'),
      tabGroups: localStorage.getItem('command-center:tab-groups'),
      sessions: localStorage.getItem('command-center:sessions'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `command-center-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as { appStore?: string | null; tabGroups?: string; sessions?: string };
        if (data.appStore) localStorage.setItem('app-store', data.appStore);
        if (data.tabGroups) localStorage.setItem('command-center:tab-groups', data.tabGroups);
        if (data.sessions) localStorage.setItem('command-center:sessions', data.sessions);
        window.location.reload();
      } catch {
        window.alert('This backup file is not valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  const clearLocalData = () => {
    if (!window.confirm('Clear Command Center local data?')) return;
    ['app-store', 'command-center:tab-groups', 'command-center:sessions', 'history_cache'].forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50" role="presentation">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-neutral-100" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="mb-6 flex items-center justify-between">
          <h2 id="settings-title" className="text-xl font-semibold">Settings</h2>
          <button type="button" onClick={onClose} aria-label="Close settings" className="text-xs text-neutral-500 hover:text-white">Close</button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Workspace</label>
            <div className="space-y-3">
              <select
                value={currentWorkspace}
                onChange={(event) => setCurrentWorkspace(event.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-sm"
              >
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <input
                  value={newWorkspaceName}
                  onChange={(event) => setNewWorkspaceName(event.target.value)}
                  placeholder="New workspace name"
                  className="flex-1 rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-sm placeholder:text-neutral-500"
                />
                <button
                  type="button"
                  onClick={handleCreateWorkspace}
                  className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-black"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {workspaces.map((workspace) => (
                  <div key={workspace.id} className="flex items-center justify-between gap-2 rounded-lg border border-neutral-800 bg-neutral-950/60 p-2">
                    <button
                      type="button"
                      onClick={() => setCurrentWorkspace(workspace.id)}
                      className={`flex items-center gap-2 text-sm ${currentWorkspace === workspace.id ? 'text-cyan-300' : 'text-neutral-300'}`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: workspace.color }} />
                      {workspace.name}
                    </button>
                    {workspace.id !== 'default' && (
                      <button
                        type="button"
                        onClick={() => {
                          const nextName = window.prompt('Rename workspace', workspace.name);
                          if (nextName) renameWorkspace(workspace.id, nextName);
                        }}
                        className="text-[11px] text-neutral-500 hover:text-white"
                      >
                        Rename
                      </button>
                    )}
                    {workspace.id !== 'default' && (
                      <button
                        type="button"
                        onClick={() => deleteWorkspace(workspace.id)}
                        className="text-[11px] text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Keyboard control</label>
            <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
              <label className="flex items-center justify-between gap-3 text-sm text-neutral-300">
                <span>Vim navigation</span>
                <input type="checkbox" checked={vimMode} onChange={(event) => setVimMode(event.target.checked)} className="h-4 w-4 accent-cyan-500" />
              </label>
              <label className="block text-xs text-neutral-500">
                Palette shortcut
                <input value={keyboardShortcuts.openPalette} onChange={(event) => setKeyboardShortcut('openPalette', event.target.value)} className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-sm text-neutral-200" />
              </label>
              <label className="block text-xs text-neutral-500">
                Search shortcut
                <input value={keyboardShortcuts.focusSearch} onChange={(event) => setKeyboardShortcut('focusSearch', event.target.value)} className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-sm text-neutral-200" />
              </label>
              <div className="border-t border-neutral-800 pt-3">
                <div className="mb-2 text-xs text-neutral-500">Custom search commands</div>
                <div className="flex gap-2">
                  <input value={customCommandLabel} onChange={(event) => setCustomCommandLabel(event.target.value)} placeholder="Command name" className="min-w-0 flex-1 rounded border border-neutral-800 bg-neutral-950 p-2 text-xs" />
                  <input value={customCommandShortcut} onChange={(event) => setCustomCommandShortcut(event.target.value)} placeholder="Shortcut" className="w-24 rounded border border-neutral-800 bg-neutral-950 p-2 text-xs" />
                  <select value={customCommandAction} onChange={(event) => setCustomCommandAction(event.target.value as typeof customCommandAction)} className="w-28 rounded border border-neutral-800 bg-neutral-950 p-2 text-xs">
                    <option value="focus-search">Search</option>
                    <option value="settings">Settings</option>
                    <option value="toggle-widgets">Widgets</option>
                    <option value="reload">Reload</option>
                  </select>
                  <button type="button" onClick={handleAddCustomCommand} className="rounded bg-cyan-500 px-2 text-xs font-medium text-black">Add</button>
                </div>
                {customCommands.map((command) => (
                  <div key={command.id} className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                    <span>{command.label} · {command.shortcut}</span>
                    <button type="button" onClick={() => removeCustomCommand(command.id)} className="text-red-400">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Data</label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={exportData} className="rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300">Export backup</button>
              <label className="cursor-pointer rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300">
                Import backup
                <input type="file" accept="application/json" onChange={importData} className="hidden" />
              </label>
              <button type="button" onClick={clearLocalData} className="rounded-lg border border-red-900/60 px-3 py-2 text-xs text-red-300">Clear local data</button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Appearance</label>
            <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-neutral-500">Accent color<input type="color" value={accentColor} onChange={(event) => setAccentColor(event.target.value)} className="mt-1 h-8 w-full rounded border border-neutral-800 bg-neutral-950" /></label>
                <label className="text-xs text-neutral-500">Background<select value={backgroundMode} onChange={(event) => setBackgroundMode(event.target.value as typeof backgroundMode)} className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-neutral-300"><option value="charcoal">Charcoal</option><option value="midnight">Midnight</option><option value="custom">Custom image</option></select></label>
              </div>
              {backgroundMode === 'custom' && <input value={customBackground} onChange={(event) => setCustomBackground(event.target.value)} placeholder="Image URL" className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-neutral-300" />}
              <label className="flex items-center justify-between text-xs text-neutral-400">Reduce motion<input type="checkbox" checked={reducedMotion} onChange={(event) => setReducedMotion(event.target.checked)} className="h-4 w-4 accent-cyan-500" /></label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Layout presets</label>
            <div className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
              <div className="flex gap-2"><input value={layoutName} onChange={(event) => setLayoutName(event.target.value)} placeholder="Preset name" className="min-w-0 flex-1 rounded border border-neutral-800 bg-neutral-950 p-2 text-xs" /><button type="button" onClick={() => { saveLayoutPreset(layoutName); setLayoutName(''); }} className="rounded bg-cyan-500 px-2 text-xs text-black">Save</button></div>
              {layoutPresets.map((preset) => <div key={preset.id} className="flex items-center justify-between text-xs text-neutral-400"><button type="button" onClick={() => applyLayoutPreset(preset.id)} className="text-cyan-300">{preset.name}</button><button type="button" onClick={() => removeLayoutPreset(preset.id)} className="text-red-400">Remove</button></div>)}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Theme</label>
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value as 'dark' | 'light' | 'auto')}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-2"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Widgets</label>
            <div className="space-y-2">
              {['tasks', 'notes', 'bookmarks', 'tabs', 'history', 'pomodoro', 'analytics', 'sessionHeatmap', 'quickTools', 'statistics', 'sessions', 'tabGroups'].map((id) => (
                <label key={id} className="flex items-center gap-2 text-sm text-neutral-300">
                  <input
                    type="checkbox"
                    checked={enabledWidgets.includes(id)}
                    onChange={() => toggleWidget(id)}
                    className="h-4 w-4 accent-cyan-500"
                  />
                  <span className="capitalize">{id}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};