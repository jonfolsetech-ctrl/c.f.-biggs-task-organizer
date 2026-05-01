import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Bell, CheckSquare, LayoutDashboard, LogOut } from 'lucide-react';
import { getUser, logout } from '../auth';

export default function Layout() {
  const user = getUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-cfnavy text-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold">CF Biggs Task Organizer</h1>
            <p className="text-sm text-slate-300">Office task tracking, assignments, and reminders</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <div className="font-semibold">{user?.name}</div>
              <div className="text-slate-300">{user?.role}</div>
            </div>
            <button onClick={handleLogout} className="rounded-lg bg-white/10 px-3 py-2 hover:bg-white/20" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl bg-white p-4 shadow-sm">
          <nav className="space-y-2 text-sm font-medium">
            <Link className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-100" to="/">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-100" to="/tasks">
              <CheckSquare size={18} /> Tasks
            </Link>
            <Link className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-100" to="/notifications">
              <Bell size={18} /> Notifications
            </Link>
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
