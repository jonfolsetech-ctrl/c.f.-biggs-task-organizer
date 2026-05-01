"use client";

import { useState } from "react";

export function TaskForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    scheduledTime: "",
    priority: "MEDIUM",
    status: "TODO"
  });

  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const dueDateTime = form.scheduledTime ? `${form.dueDate}T${form.scheduledTime}` : `${form.dueDate}T09:00`;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, dueDate: dueDateTime })
    });

    if (!res.ok) {
      setError("Please enter a title and due date.");
      return;
    }

    setForm({ title: "", description: "", dueDate: "", scheduledTime: "", priority: "MEDIUM", status: "TODO" });
    onCreated();
  }

  return (
    <form onSubmit={submit} className="card space-y-4">
      <h2 className="text-lg font-semibold">Add Task</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <input className="input" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea className="input min-h-24" placeholder="Optional description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <div className="grid gap-3 md:grid-cols-3">
        <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        <input className="input" type="time" value={form.scheduledTime} onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })} />
        <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <button className="btn-primary w-full md:w-auto">Create Task</button>
    </form>
  );
}
