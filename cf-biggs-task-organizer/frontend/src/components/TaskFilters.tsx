import { Priority, Status, User } from '../types';

export type Filters = {
  search: string;
  status: string;
  priority: string;
  assignee: string;
};

export default function TaskFilters({ filters, setFilters, users }: { filters: Filters; setFilters: (f: Filters) => void; users: User[] }) {
  return (
    <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-4">
      <input
        className="rounded-xl border px-3 py-2"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />

      <select className="rounded-xl border px-3 py-2" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
        <option value="">All statuses</option>
        {(['TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED'] as Status[]).map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <select className="rounded-xl border px-3 py-2" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
        <option value="">All priorities</option>
        {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as Priority[]).map((p) => <option key={p} value={p}>{p}</option>)}
      </select>

      <select className="rounded-xl border px-3 py-2" value={filters.assignee} onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}>
        <option value="">All assignees</option>
        {users.map((u) => <option value={u.id} key={u.id}>{u.name}</option>)}
      </select>
    </div>
  );
}
