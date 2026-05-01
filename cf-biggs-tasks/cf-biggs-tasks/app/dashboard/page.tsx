"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { SummaryCards } from "@/components/SummaryCards";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  async function loadTasks() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data.tasks || []);
  }

  useEffect(() => { loadTasks(); }, []);

  const today = new Date().toDateString();
  const todayTasks = tasks.filter((t) => new Date(t.dueDate).toDateString() === today);
  const overdueTasks = tasks.filter((t) => t.status !== "COMPLETED" && new Date(t.dueDate) < new Date());
  const upcomingTasks = tasks.filter((t) => t.status !== "COMPLETED" && new Date(t.dueDate) > new Date());

  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="page-title">Dashboard</h1><p className="page-subtitle">See what needs attention next.</p></div>
        <SummaryCards tasks={tasks} />
        <TaskForm onCreated={loadTasks} />

        <section><h2 className="section-title">Today</h2><div className="task-grid">{todayTasks.map((task) => <TaskCard key={task.id} task={task} onChanged={loadTasks} />)}</div></section>
        <section><h2 className="section-title">Overdue</h2><div className="task-grid">{overdueTasks.map((task) => <TaskCard key={task.id} task={task} onChanged={loadTasks} />)}</div></section>
        <section><h2 className="section-title">Upcoming</h2><div className="task-grid">{upcomingTasks.slice(0, 6).map((task) => <TaskCard key={task.id} task={task} onChanged={loadTasks} />)}</div></section>
      </div>
    </AppShell>
  );
}
