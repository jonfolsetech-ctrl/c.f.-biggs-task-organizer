"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");

  async function loadTasks() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data.tasks || []);
  }

  useEffect(() => { loadTasks(); }, []);

  const visible = filter === "ALL" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="page-title">Task List</h1><p className="page-subtitle">Create, update, and complete tasks.</p></div>
        <TaskForm onCreated={loadTasks} />
        <div className="flex flex-wrap gap-2">
          {["ALL", "TODO", "IN_PROGRESS", "COMPLETED"].map((item) => (
            <button key={item} onClick={() => setFilter(item)} className={filter === item ? "btn-primary" : "btn-secondary"}>
              {item.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="task-grid">{visible.map((task) => <TaskCard key={task.id} task={task} onChanged={loadTasks} />)}</div>
      </div>
    </AppShell>
  );
}
