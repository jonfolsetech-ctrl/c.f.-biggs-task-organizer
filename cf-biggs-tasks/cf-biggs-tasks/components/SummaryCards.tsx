export function SummaryCards({ tasks }: { tasks: any[] }) {
  const now = new Date();
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const overdue = tasks.filter((t) => t.status !== "COMPLETED" && new Date(t.dueDate) < now).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="summary-card"><p>Total Tasks</p><strong>{tasks.length}</strong></div>
      <div className="summary-card"><p>Completed</p><strong>{completed}</strong></div>
      <div className="summary-card"><p>Overdue</p><strong>{overdue}</strong></div>
    </div>
  );
}
