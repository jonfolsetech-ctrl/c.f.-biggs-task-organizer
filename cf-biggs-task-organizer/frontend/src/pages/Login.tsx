import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { saveAuth } from '../auth';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login' ? { email, password } : { name, email, password };
      const { data } = await api.post(endpoint, payload);
      saveAuth(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cfnavy px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-cfnavy">CF Biggs</h1>
          <p className="mt-1 text-slate-500">Task Organizer</p>
        </div>

        {error && <div className="mb-4 rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}

        {mode === 'register' && (
          <input className="mb-3 w-full rounded-xl border px-4 py-3" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        )}

        <input className="mb-3 w-full rounded-xl border px-4 py-3" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="mb-4 w-full rounded-xl border px-4 py-3" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button className="w-full rounded-xl bg-cfnavy px-4 py-3 font-bold text-white hover:bg-slate-800">
          {mode === 'login' ? 'Login' : 'Create Account'}
        </button>

        <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="mt-4 w-full text-sm font-semibold text-cfnavy">
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>

        <p className="mt-4 text-center text-xs text-slate-400">First registered user becomes ADMIN automatically.</p>
      </form>
    </div>
  );
}
