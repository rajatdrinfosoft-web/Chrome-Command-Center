export interface Note {
  id: string;
  text: string;
  folderId?: string;
  tags?: string[];
  isPinned?: boolean;
  linkedNoteIds?: string[];
  updatedAt: number;
}

export const noteProvider = {
  getNotes: (): Note[] => {
    try {
      const data = localStorage.getItem('notes-complex');
      if (data) return JSON.parse(data);
      // Migrate old string notes if needed
      const oldNotes = JSON.parse(localStorage.getItem('notes') || '[]');
      if (oldNotes.length && typeof oldNotes[0] === 'string') {
        const migrated = oldNotes.map((text: string, i: number) => ({
          id: `migrated-${i}`,
          text,
          updatedAt: Date.now()
        }));
        localStorage.setItem('notes-complex', JSON.stringify(migrated));
        return migrated;
      }
      return [];
    } catch {
      return [];
    }
  },
  saveNotes: (notes: Note[]) => localStorage.setItem('notes-complex', JSON.stringify(notes)),
};
