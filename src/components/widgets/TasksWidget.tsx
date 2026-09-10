import { useState, useEffect } from 'react';
import { taskProvider, Task } from '../../services/taskService';

export const TasksWidget = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    setTasks([
      { id: '1', title: 'Complete MVP architecture', completed: false },
      { id: '2', title: 'Refactor UI hierarchy', completed: true },
      { id: '3', title: 'Add Framer Motion animations', completed: false },
      { id: '4', title: 'Implement History Provider', completed: false },
    ]);
  }, []);

  const addTask = () => {
    if (!newTitle) return;
    const newTask = { id: Date.now().toString(), title: newTitle, completed: false };
    const updated = [...tasks, newTask];
    setTasks(updated);
    taskProvider.saveTasks(updated);
    setNewTitle('');
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-400">Tasks</h2>
      <div className="flex gap-2">
        <input 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white"
          placeholder="New task..."
        />
        <button onClick={addTask} className="bg-neutral-800 text-white px-3 py-2 rounded-lg">+</button>
      </div>
      <ul className="space-y-1">
        {tasks.map(t => <li key={t.id} className="text-sm text-neutral-300">{t.title}</li>)}
      </ul>
    </div>
  );
};
