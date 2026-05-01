"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((res) => res.json()).then((data) => setUser(data.user));
  }, []);

  return (
    <AppShell>
      <div className="max-w-2xl space-y-6">
        <div><h1 className="page-title">Settings</h1><p className="page-subtitle">Account and workspace details.</p></div>
        <div className="card">
          <p className="text-sm text-slate-500">Name</p>
          <p className="font-medium">{user?.name}</p>
          <p className="mt-4 text-sm text-slate-500">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>
      </div>
    </AppShell>
  );
}
