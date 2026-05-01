"use client";

export function CalendarView({ tasks, onChanged }: { tasks: any[]; onChanged: () => void }) {
  async function reschedule(id: string, value: string) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dueDate: value })
    });

    onChanged();
  }

  const grouped = tasks.reduce<Record<string, any[]>>((acc, task) => {
    const key = new Date(task.dueDate).toLocaleDateString();
    acc[key] = acc[key] || [];
    acc[key].push(task);
    return acc;
  }, {});

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Object.entries(grouped).map(([date, items]) => (
        <section key={date} className="card">
          <h2 className="font-semibold">{date}</h2>
          <div className="mt-4 space-y-3">
            {items.map((task) => (
              <div key={task.id} className="rounded-xl border p-3">
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-slate-500">{new Date(task.dueDate).toLocaleTimeString()}</p>
                <input type="datetime-local" className="input mt-3" onChange={(e) => reschedule(task.id, e.target.value)} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
