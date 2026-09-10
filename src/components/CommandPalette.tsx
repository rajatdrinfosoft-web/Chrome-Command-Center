import { useEffect, useMemo, useState } from 'react';
import { Command, LayoutGrid, RefreshCw, Search, Settings } from 'lucide-react';
import { useWidgetContext } from '../context/WidgetContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

interface PaletteCommand {
  id: string;
  label: string;
  keywords: string;
  shortcut?: string;
  icon: typeof Command;
  run: () => void;
}

export const CommandPalette = ({ isOpen, onClose, onOpenSettings }: CommandPaletteProps) => {
  const { enabledWidgets, setEnabledWidgets } = useWidgetContext();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = useMemo<PaletteCommand[]>(() => [
    {
      id: 'focus-search',
      label: 'Focus universal search',
      keywords: 'search find bookmarks history tabs',
      shortcut: 'Cmd K',
      icon: Search,
      run: () => window.dispatchEvent(new Event('command-center:focus-search')),
    },
    {
      id: 'settings',
      label: 'Open settings',
      keywords: 'preferences configuration options',
      icon: Settings,
      run: onOpenSettings,
    },
    {
      id: 'toggle-widgets',
      label: enabledWidgets.length > 2 ? 'Hide optional widgets' : 'Show optional widgets',
      keywords: 'widgets dashboard layout',
      icon: LayoutGrid,
      run: () => setEnabledWidgets(enabledWidgets.length > 2 ? ['clock', 'search'] : [
        'clock', 'search', 'tasks', 'notes', 'bookmarks', 'tabs', 'history',
        'recentlyClosed', 'pomodoro', 'analytics', 'sessionHeatmap',
      ]),
    },
    {
      id: 'reload',
      label: 'Refresh dashboard',
      keywords: 'reload refresh restart',
      icon: RefreshCw,
      run: () => window.location.reload(),
    },
  ], [enabledWidgets, onOpenSettings, setEnabledWidgets]);

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return commands;
    return commands.filter(({ label, keywords }) =>
      `${label} ${keywords}`.toLowerCase().includes(normalizedQuery)
    );
  }, [commands, query]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setSelectedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex((currentIndex) => Math.min(currentIndex, Math.max(filteredCommands.length - 1, 0)));
  }, [filteredCommands.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((currentIndex) => (currentIndex + 1) % Math.max(filteredCommands.length, 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((currentIndex) => (currentIndex - 1 + filteredCommands.length) % Math.max(filteredCommands.length, 1));
      } else if (event.key === 'Enter' && filteredCommands[selectedIndex]) {
        event.preventDefault();
        filteredCommands[selectedIndex].run();
        onClose();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, isOpen, onClose, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex items-start justify-center p-4 pt-[18vh] z-50"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-neutral-800">
          <Command className="w-5 h-5 text-cyan-400" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command..."
            aria-label="Command search"
            className="w-full bg-transparent py-4 text-white text-lg focus:outline-none placeholder:text-neutral-600"
          />
          <kbd className="hidden sm:inline-flex rounded border border-neutral-700 px-2 py-1 text-xs text-neutral-500">Esc</kbd>
        </div>

        <div className="p-2" role="listbox" aria-label="Commands">
          {filteredCommands.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-neutral-500">No matching commands</p>
          ) : filteredCommands.map(({ id, label, shortcut, icon: Icon, run }, index) => (
            <button
              key={id}
              type="button"
              role="option"
              aria-selected={index === selectedIndex}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => {
                run();
                onClose();
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                index === selectedIndex ? 'bg-cyan-400/10 text-white' : 'text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              <Icon className={`h-4 w-4 ${index === selectedIndex ? 'text-cyan-400' : 'text-neutral-500'}`} aria-hidden="true" />
              <span className="flex-1 text-sm">{label}</span>
              {shortcut && <kbd className="text-xs text-neutral-600">{shortcut}</kbd>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
