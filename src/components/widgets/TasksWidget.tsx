import { useState, useEffect } from 'react';
import { CheckSquare, Square, Plus, Trash2, CheckCircle2, ListTodo, AlertCircle, Calendar, Repeat } from 'lucide-react';
import { taskProvider, Task } from '../../services/taskService';

export const TasksWidget = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('normal');
  const [dueDate, setDueDate] = useState('');
  const [recurring, setRecurring] = useState<Task['recurring']>('none');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const saved = taskProvider.getTasks();
    if (saved.length > 0) {
      setTasks(saved);
    } else {
      setTasks([
        { id: '1', title: 'Complete Command Center architecture', completed: true, priority: 'urgent', dueDate: '2026-09-10' },
        { id: '2', title: 'Refactor UI with glowing Cybernetic theme', completed: true, priority: 'high' },
        { id: '3', title: 'Implement full keyboard shortcuts (Ctrl+K)', completed: false, priority: 'urgent', recurring: 'daily' },
        { id: '4', title: 'Optimize widget motion and telemetry HUD', completed: false, priority: 'normal', dueDate: '2026-09-12' },
      ]);
    }
  }, []);

  useEffect(() => {
    const handleAddTask = (e: Event) => {
      const title = (e as CustomEvent<string>).detail;
      setTasks(prev => {
        const newTask: Task = {
          id: Date.now().toString(),
          title,
          completed: false,
          priority: 'normal',
        };
        const updated = [newTask, ...prev];
        taskProvider.saveTasks(updated);
        return updated;
      });
    };

    window.addEventListener('command-center:add-task', handleAddTask);
    return () => window.removeEventListener('command-center:add-task', handleAddTask);
  }, []);

  const addTask = () => {
    if (!newTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      completed: false,
      priority,
      dueDate: dueDate || undefined,
      recurring: recurring !== 'none' ? recurring : undefined,
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    taskProvider.saveTasks(updated);
    setNewTitle('');
    setDueDate('');
    setRecurring('none');
    setShowOptions(false);
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
    taskProvider.saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    taskProvider.saveTasks(updated);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'done') return t.completed;
    return true;
  });

  const getPriorityBadge = (p?: Task['priority']) => {
    switch (p) {
      case 'urgent':
        return <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-rose-400 bg-rose-500/10 border border-rose-500/30">Urgent</span>;
      case 'high':
        return <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-400 bg-amber-500/10 border border-amber-500/30">High</span>;
      default:
        return <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">Normal</span>;
    }
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodo className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">TACTICAL TASKS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-[var(--widget-accent)]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--widget-accent)] border border-[var(--widget-accent)]/20">
            {completedCount}/{tasks.length} DONE
          </span>
        </div>
      </div>

      {/* Task Input and Priority Selector */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            className="flex-1 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/80 px-3 py-2 text-xs text-[var(--page-ink)] placeholder:text-[var(--page-muted)] focus:outline-none focus:border-emerald-500/50 transition-colors shadow-inner"
            placeholder="Add quick task or checklist item..."
          />
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className={`flex items-center justify-center w-8 rounded-xl border border-[var(--surface-line)] transition-colors ${showOptions ? 'bg-[var(--widget-accent)]/20 text-[var(--widget-accent)] border-[var(--widget-accent)]/50' : 'bg-[var(--surface-strong)] text-[var(--page-muted)] hover:text-[var(--page-ink)]'}`}
          >
            <Calendar className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={addTask}
            className="flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-neutral-950 hover:bg-emerald-400 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {showOptions && (
          <div className="flex flex-col gap-2 p-2 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/40 animate-fadeIn text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[var(--page-muted)] w-16">Priority</span>
              <div className="flex gap-1 flex-1">
                {(['urgent', 'high', 'normal'] as Task['priority'][]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`rounded px-1.5 py-0.5 font-semibold uppercase transition-all ${
                      priority === p
                        ? p === 'urgent' ? 'bg-rose-500 text-neutral-950' : p === 'high' ? 'bg-amber-500 text-neutral-950' : 'bg-emerald-500 text-neutral-950'
                        : 'bg-[var(--surface-strong)] text-[var(--page-muted)] border border-[var(--surface-line)] hover:text-[var(--page-ink)]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[var(--page-muted)] w-16">Due</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex-1 bg-[var(--surface-strong)] border border-[var(--surface-line)] rounded px-2 py-0.5 text-[var(--page-ink)] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[var(--page-muted)] w-16">Repeat</span>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value as Task['recurring'])}
                className="flex-1 bg-[var(--surface-strong)] border border-[var(--surface-line)] rounded px-2 py-0.5 text-[var(--page-ink)] focus:outline-none"
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end text-[11px] mt-1">
          <div className="flex items-center gap-1">
            {(['all', 'active', 'done'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium capitalize transition-all ${
                  filter === f
                    ? 'bg-neutral-800 text-[var(--page-ink)] border border-[var(--surface-line)]'
                    : 'text-[var(--page-muted)] hover:text-[var(--page-ink)]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {filteredTasks.length === 0 ? (
          <li className="py-4 text-center text-xs text-[var(--page-muted)]">No tasks in this view</li>
        ) : (
          filteredTasks.map((t) => (
            <li
              key={t.id}
              className={`group flex items-center justify-between gap-2.5 rounded-xl border p-2 text-xs transition-all ${
                t.completed
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-[var(--page-muted)] line-through'
                  : 'border-[var(--surface-line)] bg-[var(--surface-strong)]/60 text-[var(--page-ink)] hover:border-emerald-500/30'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleTask(t.id)}
                className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
              >
                {t.completed ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <Square className="h-4 w-4 shrink-0 text-[var(--page-muted)] group-hover:text-emerald-400" />
                )}
                <div className="flex flex-col text-left min-w-0">
                  <span className="truncate font-medium">{t.title}</span>
                  {(t.dueDate || t.recurring) && (
                    <div className="flex gap-2 text-[9px] text-[var(--page-muted)] font-mono">
                      {t.dueDate && <span className="flex items-center gap-0.5"><Calendar className="h-2.5 w-2.5" /> {t.dueDate}</span>}
                      {t.recurring && <span className="flex items-center gap-0.5"><Repeat className="h-2.5 w-2.5" /> {t.recurring}</span>}
                    </div>
                  )}
                </div>
              </button>

              <div className="flex items-center gap-1.5 shrink-0">
                {getPriorityBadge(t.priority)}
                <button
                  type="button"
                  onClick={() => deleteTask(t.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-rose-400 transition-opacity"
                  title="Delete task"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
