import { useEffect, useMemo, useState } from 'react';
import { Command, LayoutGrid, RefreshCw, Search, Settings, Timer, ListTodo, Wrench } from 'lucide-react';
import { useWidgetContext } from '../context/WidgetContext';
import { CommandAction, useAppStore } from '../stores/appStore';

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

const actionKeywords: Record<CommandAction, string> = {
  'focus-search': 'focus search find bookmarks history tabs',
  settings: 'settings preferences configuration options',
  'toggle-widgets': 'widgets dashboard layout show hide',
  reload: 'reload refresh restart dashboard',
};

const actionIcons: Record<CommandAction, typeof Command> = {
  'focus-search': Search,
  settings: Settings,
  'toggle-widgets': LayoutGrid,
  reload: RefreshCw,
};

export const CommandPalette = ({ isOpen, onClose, onOpenSettings }: CommandPaletteProps) => {
  const { enabledWidgets, setEnabledWidgets } = useWidgetContext();
  const { customCommands } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const runAction = (action: CommandAction) => {
    if (action === 'focus-search') window.dispatchEvent(new Event('command-center:focus-search'));
    if (action === 'settings') onOpenSettings();
    if (action === 'toggle-widgets') setEnabledWidgets(enabledWidgets.length > 2 ? ['clock', 'search'] : [
      'clock', 'search', 'workspaces', 'calendar', 'weather', 'recentWork', 'tasks', 'notes', 'bookmarks', 'tabs', 'history',
      'recentlyClosed', 'pomodoro', 'analytics', 'sessionHeatmap', 'statistics', 'sessions', 'tabGroups', 'extensionInfo'
    ]);
    if (action === 'reload') window.location.reload();
  };

  const commands = useMemo<PaletteCommand[]>(() => [
    {
      id: 'focus-search',
      label: 'Focus universal search',
      keywords: 'search find bookmarks history tabs',
      shortcut: 'Ctrl + K',
      icon: Search,
      run: () => runAction('focus-search'),
    },
    {
      id: 'settings',
      label: 'Open settings',
      keywords: 'preferences configuration options',
      icon: Settings,
      run: () => runAction('settings'),
    },
    {
      id: 'toggle-widgets',
      label: enabledWidgets.length > 2 ? 'Hide optional widgets' : 'Show optional widgets',
      keywords: 'widgets dashboard layout',
      icon: LayoutGrid,
      run: () => runAction('toggle-widgets'),
    },
    {
      id: 'reload',
      label: 'Refresh dashboard',
      keywords: 'reload refresh restart',
      icon: RefreshCw,
      run: () => runAction('reload'),
    },
    {
      id: 'open-focus',
      label: 'Open Zen Focus Mode',
      keywords: 'focus pomodoro timer zen fullscreen break',
      shortcut: 'Ctrl Shift F',
      icon: Timer,
      run: () => window.dispatchEvent(new Event('command-center:open-focus')),
    },
    {
      id: 'open-developer-tools',
      label: 'Open Developer Utilities',
      keywords: 'developer tools utilities json regex base64 calculator',
      icon: Wrench,
      run: () => window.dispatchEvent(new Event('command-center:open-toolbox')),
    },
    ...['json', 'regex', 'base64', 'url', 'jwt', 'uuid', 'hash', 'calc', 'pass', 'unit', 'text', 'qr', 'cdown', 'color', 'cron'].map((toolId) => ({
      id: `open-tool-${toolId}`,
      label: `Open ${toolId === 'cdown' ? 'countdown timer' : toolId}`,
      keywords: `developer utility tool ${toolId}`,
      icon: Wrench,
      run: () => window.dispatchEvent(new CustomEvent('command-center:open-tool', { detail: toolId })),
    })),
    ...customCommands.map((customCommand) => ({
      id: customCommand.id,
      label: customCommand.label,
      keywords: actionKeywords[customCommand.action],
      shortcut: customCommand.shortcut,
      icon: actionIcons[customCommand.action],
      run: () => runAction(customCommand.action),
    })),
  ], [customCommands, enabledWidgets, onOpenSettings, setEnabledWidgets]);

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    
    const paramCommands: PaletteCommand[] = [];
    
    const timerMatch = normalizedQuery.match(/^(?:timer|start timer)\s+(\d+)$/);
    if (timerMatch) {
      paramCommands.push({
        id: 'param-timer',
        label: `Start a timer for ${timerMatch[1]} minutes`,
        keywords: 'timer',
        shortcut: 'Enter',
        icon: Timer,
        run: () => window.dispatchEvent(new CustomEvent('command-center:start-timer', { detail: parseInt(timerMatch[1]) * 60 }))
      });
    }

    const taskMatch = normalizedQuery.match(/^(?:new task|task|add task)\s+(.+)$/);
    if (taskMatch) {
      paramCommands.push({
        id: 'param-task',
        label: `Create task: "${taskMatch[1]}"`,
        keywords: 'task new add',
        shortcut: 'Enter',
        icon: ListTodo,
        run: () => window.dispatchEvent(new CustomEvent('command-center:add-task', { detail: taskMatch[1] }))
      });
    }

    if (!normalizedQuery) return commands;
    
    const scoredCommands = commands.map(cmd => {
      const target = `${cmd.label} ${cmd.keywords}`.toLowerCase();
      let score = 0;
      
      if (target.includes(normalizedQuery)) {
        score = 100;
        if (target.startsWith(normalizedQuery)) score += 50;
      } else {
        let qIdx = 0;
        for (let i = 0; i < target.length && qIdx < normalizedQuery.length; i++) {
          if (target[i] === normalizedQuery[qIdx]) {
            qIdx++;
          }
        }
        if (qIdx === normalizedQuery.length) {
          score = 50 - target.length; 
        }
      }
      return { cmd, score };
    }).filter(c => c.score > -1000 && c.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(c => c.cmd);

    return [...paramCommands, ...scoredCommands];
  }, [commands, query]);

  const inlineSuggestion = useMemo(() => {
    const qLower = query.toLowerCase();
    if (!qLower) return '';
    
    const templates = ['timer ', 'start timer ', 'new task ', 'add task '];
    for (const temp of templates) {
      if (temp.startsWith(qLower) && temp !== qLower) {
        return query + temp.slice(qLower.length);
      }
    }
    
    if (filteredCommands.length > 0) {
      const firstLabel = filteredCommands[0].label.toLowerCase();
      if (firstLabel.startsWith(qLower) && firstLabel !== qLower) {
        return query + filteredCommands[0].label.slice(qLower.length);
      }
    }
    return '';
  }, [query, filteredCommands]);

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

  useEffect(() => {
    if (!isOpen || query.trim()) return;
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery === 'focus search' || normalizedQuery === 'search') {
      setSelectedIndex(commands.findIndex(({ id }) => id === 'focus-search'));
    }
  }, [commands, isOpen, query]);

  useEffect(() => {
    const handleAction = (event: Event) => {
      const action = (event as CustomEvent<CommandAction>).detail;
      runAction(action);
      onClose();
    };

    window.addEventListener('command-center:run-action', handleAction);
    return () => window.removeEventListener('command-center:run-action', handleAction);
  }, [onClose, enabledWidgets, setEnabledWidgets, onOpenSettings]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex items-start justify-center p-4 pt-[18vh] z-50"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-neutral-800 relative">
          <Command className="w-5 h-5 text-cyan-400 z-10" aria-hidden="true" />
          <div className="relative flex-1 flex items-center overflow-hidden">
            {inlineSuggestion && (
              <div className="absolute inset-0 py-4 text-lg text-neutral-600 pointer-events-none flex items-center whitespace-pre overflow-hidden">
                <span className="opacity-0">{query}</span>
                <span>{inlineSuggestion.slice(query.length)}</span>
              </div>
            )}
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Tab' && inlineSuggestion) {
                  e.preventDefault();
                  setQuery(inlineSuggestion);
                } else if (e.key === 'ArrowRight' && inlineSuggestion && (e.target as HTMLInputElement).selectionStart === query.length) {
                  e.preventDefault();
                  setQuery(inlineSuggestion);
                }
              }}
              placeholder="Type a command..."
              aria-label="Command search"
              className="w-full bg-transparent py-4 text-white text-lg focus:outline-none placeholder:text-neutral-600 z-10 relative"
            />
          </div>
          <kbd className="hidden sm:inline-flex rounded border border-neutral-700 px-2 py-1 text-xs text-neutral-500 z-10">Esc</kbd>
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
