'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Credenciales inválidas.');
      }

      // Redirect to Admin Dashboard on successful DB authentication
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 font-sans text-zinc-100">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-amber-500">PecadosVIP</h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            CMS B2B — Acceso Centralizado de Agencia
          </p>
        </div>

        {/* Error message alert */}
        {errorMsg && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-center text-xs font-semibold text-rose-400">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Real Login Form */}
        <form onSubmit={handleLogin} className="space-y-5 text-xs">
          <div>
            <label className="block font-medium text-zinc-300">Correo Electrónico de Agencia</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-300">Contraseña de Producción</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 font-bold text-zinc-950 shadow-lg hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50"
          >
            {loading ? 'Autenticando en Base de Datos...' : 'Iniciar Sesión en CMS B2B'}
          </button>
        </form>
      </div>
    </div>
  );
}
