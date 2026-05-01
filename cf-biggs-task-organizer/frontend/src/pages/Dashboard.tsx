import { useEffect, useState } from 'react';
import { api } from '../api';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import { Task } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<any>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        api.get('/tasks/stats'),
        api.get('/tasks', { params: { status: 'TODO' } })
      ]);
      setStats(statsRes.data.stats);
      setTasks(tasksRes.data.tasks.slice(0, 5));
    } catch {
      setError('Unable to load dashboard data.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function complete(task: Task) {
    await api.patch(`/tasks/${task.id}/complete`);
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-cfnavy">Dashboard</h2>
        <p className="text-slate-500">Quick overview of assigned work, deadlines, and overdue tasks.</p>
      </div>

      {error && <div className="rounded-xl bg-red-100 px-4 py-3 text-red-700">{error}</div>}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Assigned Tasks" value={stats.assigned_count || 0} />
        <StatCard label="Created Tasks" value={stats.created_count || 0} />
        <StatCard label="Overdue" value={stats.overdue_count || 0} />
        <StatCard label="Upcoming This Week" value={stats.upcoming_count || 0} />
      </div>

      <section className="space-y-3">
        <h3 className="text-xl font-bold text-cfnavy">Current Tasks</h3>
        {tasks.length === 0 ? <p className="rounded-2xl bg-white p-5 text-slate-500">No open tasks found.</p> : tasks.map((task) => (
          <TaskCard key={task.id} task={task} onComplete={complete} />
        ))}
      </section>
    </div>
  );
}
