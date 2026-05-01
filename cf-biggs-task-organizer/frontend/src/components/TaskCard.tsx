import { Task } from '../types';

function priorityClass(priority: string) {
  if (priority === 'URGENT') return 'bg-red-100 text-red-700';
  if (priority === 'HIGH') return 'bg-orange-100 text-orange-700';
  if (priority === 'MEDIUM') return 'bg-yellow-100 text-yellow-700';
  return 'bg-slate-100 text-slate-700';
}

export default function TaskCard({
  task,
  onComplete,
  onEdit,
  onDelete
}: {
  task: Task;
  onComplete: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}) {
  const overdue = task.due_at && new Date(task.due_at) < new Date() && task.status !== 'COMPLETED';

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <h3 className="text-lg font-bold text-cfnavy">{task.title}</h3>
          {task.description && <p className="mt-1 text-sm text-slate-600">{task.description}</p>}
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            <span className={`rounded-full px-3 py-1 ${priorityClass(task.priority)}`}>{task.priority}</span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">{task.status}</span>
            {overdue && <span className="rounded-full bg-red-600 px-3 py-1 text-white">OVERDUE</span>}
          </div>
        </div>

        <div className="text-sm text-slate-500 md:text-right">
          <p>Assigned: <strong>{task.assigned_to_name || 'Unassigned'}</strong></p>
          <p>Due: <strong>{task.due_at ? new Date(task.due_at).toLocaleString() : 'No due date'}</strong></p>
          <p>Reminder: <strong>{task.reminder_at ? new Date(task.reminder_at).toLocaleString() : 'None'}</strong></p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {task.status !== 'COMPLETED' && (
          <button onClick={() => onComplete(task)} className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
            Complete
          </button>
        )}
        {onEdit && (
          <button onClick={() => onEdit(task)} className="rounded-xl bg-cfnavy px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(task)} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
