import { useEffect, useState } from 'react';
import { api } from '../api';
import TaskCard from '../components/TaskCard';
import TaskFilters, { Filters } from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import { Task, User } from '../types';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<Filters>({ search: '', status: '', priority: '', assignee: '' });
  const [error, setError] = useState('');

  async function loadUsers() {
    const res = await api.get('/users');
    setUsers(res.data.users);
  }

  async function loadTasks() {
    const res = await api.get('/tasks', { params: filters });
    setTasks(res.data.tasks);
  }

  useEffect(() => {
    loadUsers().catch(() => setError('Unable to load users.'));
  }, []);

  useEffect(() => {
    loadTasks().catch(() => setError('Unable to load tasks.'));
  }, [filters]);

  async function submit(payload: any) {
    if (editingTask) {
      await api.put(`/tasks/${editingTask.id}`, payload);
    } else {
      await api.post('/tasks', payload);
    }
    setEditingTask(null);
    await loadTasks();
  }

  async function complete(task: Task) {
    await api.patch(`/tasks/${task.id}/complete`);
    await loadTasks();
  }

  async function remove(task: Task) {
    if (!confirm(`Delete task: ${task.title}?`)) return;
    await api.delete(`/tasks/${task.id}`);
    await loadTasks();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-cfnavy">Tasks</h2>
        <p className="text-slate-500">Create, assign, filter, and complete office tasks.</p>
      </div>

      {error && <div className="rounded-xl bg-red-100 px-4 py-3 text-red-700">{error}</div>}

      <TaskForm users={users} editingTask={editingTask} onSubmit={submit} onCancel={() => setEditingTask(null)} />
      <TaskFilters filters={filters} setFilters={setFilters} users={users} />

      <div className="space-y-3">
        {tasks.length === 0 ? <p className="rounded-2xl bg-white p-5 text-slate-500">No tasks match your filters.</p> : tasks.map((task) => (
          <TaskCard key={task.id} task={task} onComplete={complete} onEdit={setEditingTask} onDelete={remove} />
        ))}
      </div>
    </div>
  );
}
