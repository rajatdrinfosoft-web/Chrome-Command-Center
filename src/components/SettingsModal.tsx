import React from 'react';
import { useAppStore } from '../stores/appStore';
import { useWidgetContext } from '../context/WidgetContext';

export const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { theme, setTheme } = useAppStore();
  const { enabledWidgets, setEnabledWidgets } = useWidgetContext();

  if (!isOpen) return null;

  const toggleWidget = (id: string) => {
    if (enabledWidgets.includes(id)) {
      setEnabledWidgets(enabledWidgets.filter(w => w !== id));
    } else {
      setEnabledWidgets([...enabledWidgets, id]);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl p-6 text-neutral-100">
        <h2 className="text-xl font-semibold mb-6">Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value as any)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Widgets</label>
            <div className="space-y-2">
              {['tasks', 'notes', 'bookmarks', 'tabs', 'history'].map(id => (
                <div key={id} className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={enabledWidgets.includes(id)} 
                    onChange={() => toggleWidget(id)}
                  />
                  <span className="capitalize">{id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button onClick={onClose} className="mt-8 text-xs text-neutral-500 hover:text-white">Close</button>
      </div>
    </div>
  );
};
