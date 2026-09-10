import { useState, useEffect } from 'react';
import { noteProvider } from '../../services/noteService';

export const NotesWidget = () => {
  const [note, setNote] = useState('');

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
      <h2 className="text-sm font-medium text-neutral-400">Notes</h2>
      <textarea 
        value={note}
        onChange={(e) => save(e.target.value)}
        className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-300"
        placeholder="Quick note..."
      />
    </div>
  );
};
