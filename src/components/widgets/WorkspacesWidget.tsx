import { useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { Briefcase, Plus, Trash2, Edit2, Check, X, RefreshCw, Layers } from 'lucide-react';

export const WorkspacesWidget = () => {
  const {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    createWorkspace,
    renameWorkspace,
    deleteWorkspace,
  } = useAppStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = () => {
    if (newWorkspaceName.trim()) {
      createWorkspace(newWorkspaceName.trim());
      setNewWorkspaceName('');
      setIsCreating(false);
    }
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      renameWorkspace(id, editName.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">WORKSPACES</span>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setNewWorkspaceName('');
          }}
          className="rounded-full bg-[var(--widget-accent)]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--widget-accent)] border border-[var(--widget-accent)]/20 hover:bg-[var(--widget-accent)]/20 transition-colors flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          NEW
        </button>
      </div>

      {/* Creation Form */}
      {isCreating && (
        <div className="flex flex-col gap-2 animate-fadeIn mb-2 border border-[var(--surface-line)] bg-[var(--surface-strong)]/40 p-3 rounded-xl">
          <div className="flex gap-2">
            <input
              autoFocus
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
                if (e.key === 'Escape') setIsCreating(false);
              }}
              placeholder="Workspace name..."
              className="flex-1 rounded-lg border border-[var(--surface-line)] bg-[var(--surface-strong)] px-3 py-1.5 text-xs text-[var(--page-ink)] placeholder:text-[var(--page-muted)] focus:outline-none focus:border-[var(--widget-accent)]/50"
            />
          </div>
          <div className="flex justify-between items-center mt-1">
             <span className="text-[10px] text-[var(--page-muted)] uppercase tracking-wider font-bold">Template: Default</span>
             <div className="flex gap-2">
                <button onClick={handleCreate} className="px-3 py-1 text-xs font-bold bg-[var(--widget-accent)] text-neutral-950 rounded hover:bg-[var(--widget-accent)]/80">Add</button>
                <button onClick={() => setIsCreating(false)} className="px-3 py-1 text-xs font-bold text-[var(--page-muted)] hover:text-[var(--page-ink)]">Cancel</button>
             </div>
          </div>
        </div>
      )}

      {/* Workspace List */}
      <div className="space-y-2 mt-1 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
        {workspaces.map((ws) => (
          <div
            key={ws.id}
            onClick={() => {
              if (editingId !== ws.id && currentWorkspace !== ws.id) {
                setCurrentWorkspace(ws.id);
              }
            }}
            className={`group/ws flex flex-col gap-2 rounded-xl border transition-all cursor-pointer p-3 ${
              currentWorkspace === ws.id
                ? 'border-[var(--widget-accent)] bg-[var(--widget-accent)]/5'
                : 'border-[var(--surface-line)] bg-[var(--surface-strong)]/30 hover:border-[var(--widget-accent)]/30'
            }`}
          >
            <div className="flex items-center justify-between">
              {editingId === ws.id ? (
                <div className="flex gap-2 w-full items-center">
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(ws.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="flex-1 rounded border border-[var(--surface-line)] bg-[var(--surface-strong)] px-2 py-1 text-xs text-[var(--page-ink)] focus:outline-none focus:border-[var(--widget-accent)]/50"
                  />
                  <button onClick={() => handleRename(ws.id)} className="text-[var(--widget-accent)] hover:text-cyan-300">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-[var(--page-muted)] hover:text-rose-400">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="h-3 w-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: ws.color }}
                    />
                    <span className={`truncate text-xs font-bold transition-colors ${
                      currentWorkspace === ws.id ? 'text-[var(--widget-accent)]' : 'text-[var(--page-ink)] group-hover/ws:text-[var(--widget-accent)]'
                    }`}>
                      {ws.name}
                    </span>
                    {currentWorkspace === ws.id && (
                      <span className="text-[8px] uppercase tracking-wider font-bold text-[var(--widget-accent)] bg-[var(--widget-accent)]/10 px-1.5 py-0.5 rounded-full border border-[var(--widget-accent)]/20">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover/ws:opacity-100 transition-opacity">
                    {currentWorkspace === ws.id && (
                      <>
                        <button
                          className="p-1 rounded text-[var(--page-muted)] hover:bg-[var(--surface-strong)] hover:text-cyan-400"
                          title="Restore Tabs"
                        >
                          <Layers className="h-3 w-3" />
                        </button>
                        <button
                          className="p-1 rounded text-[var(--page-muted)] hover:bg-[var(--surface-strong)] hover:text-amber-400"
                          title="Auto Switch"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditName(ws.name);
                        setEditingId(ws.id);
                      }}
                      className="p-1 rounded text-[var(--page-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--page-ink)]"
                      title="Rename Workspace"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    {workspaces.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete workspace "${ws.name}"?`)) {
                            deleteWorkspace(ws.id);
                          }
                        }}
                        className="p-1 rounded text-[var(--page-muted)] hover:bg-rose-500/20 hover:text-rose-400"
                        title="Delete Workspace"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
