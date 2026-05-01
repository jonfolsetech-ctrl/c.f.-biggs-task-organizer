"use client";

import { StatusBadge } from "./StatusBadge";

type Task = {
  id: string;
  title: string;
  description?: string | null;
  dueDate: string;
  priority: string;
  status: string;
  completedAt?: string | null;
};

export function TaskCard({ task, onChanged }: { task: Task; onChanged: () => void }) {
  async function updateStatus(status: string) {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    onChanged();
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">{task.title}</h3>
          {task.description && <p className="mt-1 text-sm text-slate-500">{task.description}</p>}
          <p className="mt-2 text-sm text-slate-600">Due {new Date(task.dueDate).toLocaleString()}</p>
          {task.completedAt && <p className="mt-1 text-xs text-emerald-700">Completed {new Date(task.completedAt).toLocaleString()}</p>}
        </div>

        <div className="text-right">
          <StatusBadge status={task.status} />
          <p className="mt-2 text-xs font-semibold text-slate-500">{task.priority}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn-secondary" onClick={() => updateStatus("TODO")}>To Do</button>
        <button className="btn-secondary" onClick={() => updateStatus("IN_PROGRESS")}>Start</button>
        <button className="btn-primary" onClick={() => updateStatus("COMPLETED")}>Complete</button>
      </div>
    </div>
  );
}
