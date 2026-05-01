"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CalendarView } from "@/components/CalendarView";

export default function CalendarPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  async function loadTasks() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data.tasks || []);
  }

  useEffect(() => { loadTasks(); }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="page-title">Calendar</h1><p className="page-subtitle">Daily and weekly schedule view.</p></div>
        <CalendarView tasks={tasks} onChanged={loadTasks} />
      </div>
    </AppShell>
  );
}
