export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority?: 'normal' | 'high' | 'urgent';
  dueDate?: string;
  recurring?: 'daily' | 'weekly' | 'monthly' | 'none';
}

export const taskProvider = {
  getTasks: (): Task[] => JSON.parse(localStorage.getItem('tasks') || '[]'),
  saveTasks: (tasks: Task[]) => localStorage.setItem('tasks', JSON.stringify(tasks)),
};
