import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { noteProvider, Note } from '../../services/noteService';
import { FileText, Plus, ChevronLeft, Pin, Hash, Trash2 } from 'lucide-react';

export const NotesWidget = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = noteProvider.getNotes();
    if (saved.length > 0) {
      setNotes(saved);
    } else {
      const defaultNote: Note = {
        id: Date.now().toString(),
        text: '# Welcome to Notes\n\n- Supports markdown\n- Pin notes\n- Add tags',
        updatedAt: Date.now(),
        isPinned: true,
        tags: ['welcome']
      };
      setNotes([defaultNote]);
      noteProvider.saveNotes([defaultNote]);
    }
  }, []);

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    noteProvider.saveNotes(updated);
  };

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      text: '',
      updatedAt: Date.now(),
      tags: [],
    };
    saveNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setIsEditing(true);
  };

  const updateActiveNote = (updates: Partial<Note>) => {
    if (!activeNoteId) return;
    const updated = notes.map(n => 
      n.id === activeNoteId ? { ...n, ...updates, updatedAt: Date.now() } : n
    );
    saveNotes(updated);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated);
    if (activeNoteId === id) setActiveNoteId(null);
  };

  const activeNote = notes.find(n => n.id === activeNoteId);

  const filteredNotes = notes.filter(n => 
    n.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  if (activeNoteId && activeNote) {
    return (
      <div className="flex flex-col gap-2 h-64">
        <div className="flex justify-between items-center shrink-0">
          <button 
            onClick={() => { setActiveNoteId(null); setIsEditing(false); }} 
            className="flex items-center gap-1 text-[10px] font-bold text-[var(--page-muted)] hover:text-[var(--page-ink)]"
          >
            <ChevronLeft className="h-4 w-4" /> BACK
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => updateActiveNote({ isPinned: !activeNote.isPinned })}
              className={`p-1.5 rounded-lg transition-colors ${activeNote.isPinned ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-500 hover:text-white'}`}
            >
              <Pin className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => deleteNote(activeNote.id)}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="rounded-full bg-[var(--widget-accent)]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--widget-accent)] border border-[var(--widget-accent)]/20 hover:bg-[var(--widget-accent)]/20 transition-colors"
            >
              {isEditing ? 'PREVIEW' : 'EDIT'}
            </button>
          </div>
        </div>
        
        <div className="flex gap-1 items-center shrink-0 mb-1 px-1">
          <Hash className="h-3 w-3 text-[var(--page-muted)]" />
          <input
            value={activeNote.tags?.join(', ') || ''}
            onChange={(e) => updateActiveNote({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
            placeholder="Tags (comma separated)..."
            className="flex-1 bg-transparent border-none text-[10px] text-[var(--page-muted)] focus:outline-none"
          />
        </div>

        {isEditing ? (
          <textarea 
            value={activeNote.text}
            onChange={(e) => updateActiveNote({ text: e.target.value })}
            className="flex-1 w-full bg-[var(--surface-strong)]/50 border border-[var(--surface-line)] rounded-lg p-3 text-sm text-[var(--page-ink)] focus:outline-none focus:border-[var(--widget-accent)]/50 transition-colors resize-none custom-scrollbar"
            placeholder="Quick note (supports Markdown)..."
            autoFocus
          />
        ) : (
          <div className="flex-1 w-full bg-[var(--surface-strong)]/20 border border-[var(--surface-line)] rounded-lg p-3 text-sm text-[var(--page-ink)] overflow-y-auto prose prose-sm prose-invert custom-scrollbar">
            <ReactMarkdown>{activeNote.text || '*Empty note*'}</ReactMarkdown>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">QUICK NOTES</span>
        </div>
        <button 
          onClick={createNote} 
          className="rounded-full bg-[var(--widget-accent)]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--widget-accent)] border border-[var(--widget-accent)]/20 hover:bg-[var(--widget-accent)]/20 transition-colors flex items-center gap-1"
        >
          <Plus className="h-3 w-3" /> NEW
        </button>
      </div>

      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search notes or tags..."
        className="w-full rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/80 px-3 py-1.5 text-xs text-[var(--page-ink)] placeholder:text-[var(--page-muted)] focus:outline-none focus:border-[var(--widget-accent)]/50 transition-colors shadow-inner"
      />

      <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar mt-1">
        {filteredNotes.length === 0 ? (
          <li className="py-4 text-center text-xs text-[var(--page-muted)]">No notes found</li>
        ) : (
          filteredNotes.map(n => (
            <li 
              key={n.id}
              onClick={() => setActiveNoteId(n.id)}
              className="group flex flex-col gap-1 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/40 p-2.5 text-left cursor-pointer hover:border-[var(--widget-accent)]/30 hover:bg-[var(--surface-strong)]/60 transition-all"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs font-medium text-[var(--page-ink)] line-clamp-1 group-hover:text-[var(--widget-accent)] transition-colors">
                  {n.text.split('\n')[0].replace(/^[#*-]\s/, '') || 'Untitled Note'}
                </span>
                {n.isPinned && <Pin className="h-3 w-3 text-amber-400 shrink-0" />}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[var(--page-muted)] truncate">
                  {new Date(n.updatedAt).toLocaleDateString()}
                </span>
                {n.tags && n.tags.length > 0 && (
                  <div className="flex gap-1 truncate">
                    {n.tags.map(t => (
                      <span key={t} className="text-[9px] text-[var(--widget-accent)] bg-[var(--widget-accent)]/10 px-1 rounded-full">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
