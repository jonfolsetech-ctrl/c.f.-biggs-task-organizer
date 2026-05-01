"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="auth-page">
      <form onSubmit={submit} className="auth-card">
        <h1 className="text-2xl font-bold">C.F. Biggs</h1>
        <p className="text-sm text-slate-500">Log in to manage your tasks.</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input className="input" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary w-full">Log in</button>
        <p className="text-sm">No account? <Link className="link" href="/register">Register</Link></p>
      </form>
    </main>
  );
}
