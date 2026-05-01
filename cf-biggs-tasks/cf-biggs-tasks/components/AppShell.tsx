"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed hidden h-full w-64 border-r bg-white p-6 md:block">
        <h1 className="text-xl font-bold text-slate-900">C.F. Biggs</h1>
        <p className="mt-1 text-sm text-slate-500">Task Organizer</p>

        <nav className="mt-8 space-y-2">
          <Link className="nav-link" href="/dashboard">Dashboard</Link>
          <Link className="nav-link" href="/tasks">Tasks</Link>
          <Link className="nav-link" href="/calendar">Calendar</Link>
          <Link className="nav-link" href="/settings">Settings</Link>
        </nav>

        <button onClick={logout} className="mt-8 text-sm text-slate-500 hover:text-slate-900">
          Log out
        </button>
      </aside>

      <main className="md:ml-64">
        <div className="border-b bg-white p-4 md:hidden">
          <h1 className="font-bold">C.F. Biggs Tasks</h1>
          <div className="mt-3 flex gap-3 text-sm">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/tasks">Tasks</Link>
            <Link href="/calendar">Calendar</Link>
          </div>
        </div>

        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
