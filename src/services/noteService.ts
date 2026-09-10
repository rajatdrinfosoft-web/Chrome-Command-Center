export const noteProvider = {
  getNotes: (): string[] => JSON.parse(localStorage.getItem('notes') || '[]'),
  saveNotes: (notes: string[]) => localStorage.setItem('notes', JSON.stringify(notes)),
};
