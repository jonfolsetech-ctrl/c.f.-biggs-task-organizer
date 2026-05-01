export function StatusBadge({ status }: { status: string }) {
  const label = status === "TODO" ? "To Do" : status === "IN_PROGRESS" ? "In Progress" : "Completed";
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">{label}</span>;
}
