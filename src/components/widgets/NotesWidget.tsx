import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { noteProvider } from '../../services/noteService';

export const NotesWidget = () => {
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const notes = noteProvider.getNotes();
    if (notes.length > 0) setNote(notes[0]);
  }, []);

  const save = (text: string) => {
    setNote(text);
    noteProvider.saveNotes([text]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-medium text-neutral-400">Notes</h2>
        <button onClick={() => setIsEditing(!isEditing)} className="text-xs text-cyan-400">
          {isEditing ? 'Preview' : 'Edit'}
        </button>
      </div>
      {isEditing ? (
        <textarea 
          value={note}
          onChange={(e) => save(e.target.value)}
          className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-300"
          placeholder="Quick note (supports Markdown)..."
        />
      ) : (
        <div className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-300 overflow-y-auto prose prose-sm prose-invert">
          <ReactMarkdown>{note}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};
