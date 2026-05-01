import { FormEvent, useEffect, useState } from 'react';
import { Priority, Status, Task, User } from '../types';

function toLocalInputValue(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function toIso(value: string) {
  return value ? new Date(value).toISOString() : null;
}

export default function TaskForm({
  users,
  editingTask,
  onSubmit,
  onCancel
}: {
  users: User[];
  editingTask?: Task | null;
  onSubmit: (payload: any) => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [reminderAt, setReminderAt] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [status, setStatus] = useState<Status>('TODO');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setAssignedTo(editingTask.assigned_to || '');
      setDueAt(toLocalInputValue(editingTask.due_at));
      setReminderAt(toLocalInputValue(editingTask.reminder_at));
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
    } else {
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setDueAt('');
      setReminderAt('');
      setPriority('MEDIUM');
      setStatus('TODO');
    }
  }, [editingTask]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      title,
      description,
      assignedTo: assignedTo || null,
      dueAt: toIso(dueAt),
      reminderAt: toIso(reminderAt),
      priority,
      status
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-cfnavy">{editingTask ? 'Edit Task' : 'Create Task'}</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-xl border px-3 py-2 md:col-span-2" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="rounded-xl border px-3 py-2 md:col-span-2" placeholder="Notes or details" value={description} onChange={(e) => setDescription(e.target.value)} />

        <select className="rounded-xl border px-3 py-2" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          <option value="">Unassigned</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>

        <select className="rounded-xl border px-3 py-2" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>

        <select className="rounded-xl border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="BLOCKED">BLOCKED</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <label className="text-sm text-slate-600">
          Due date
          <input className="mt-1 w-full rounded-xl border px-3 py-2" type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
        </label>

        <label className="text-sm text-slate-600 md:col-span-2">
          Reminder time
          <input className="mt-1 w-full rounded-xl border px-3 py-2" type="datetime-local" value={reminderAt} onChange={(e) => setReminderAt(e.target.value)} />
        </label>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="rounded-xl bg-cfnavy px-5 py-2 font-semibold text-white hover:bg-slate-800" type="submit">
          {editingTask ? 'Save Changes' : 'Create Task'}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded-xl bg-slate-200 px-5 py-2 font-semibold">Cancel</button>}
      </div>
    </form>
  );
}
