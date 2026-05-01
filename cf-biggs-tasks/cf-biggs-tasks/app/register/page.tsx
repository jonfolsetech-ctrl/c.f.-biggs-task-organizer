"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      setError("Unable to create account.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="auth-page">
      <form onSubmit={submit} className="auth-card">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-sm text-slate-500">Start organizing work for C.F. Biggs.</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input className="input" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary w-full">Register</button>
        <p className="text-sm">Already registered? <Link className="link" href="/login">Log in</Link></p>
      </form>
    </main>
  );
}
