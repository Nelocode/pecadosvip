'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { CmsRole } from '@/lib/content/types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<CmsRole>('super_admin');

  const roleLabels: Record<CmsRole, string> = {
    super_admin: 'Super Administrador',
    booking_agent: 'Agente de Cuentas (Booking)',
    seo_specialist: 'Especialista SEO / Redactor',
    kyc_officer: 'Oficial de Cumplimiento (KYC)',
    admin: 'Admin Legacy',
    editor: 'Editor Legacy',
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-xl font-extrabold tracking-wider text-amber-500 hover:text-amber-400">
            PecadosVIP <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">CMS Admin</span>
          </Link>
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
            B2B Centralizado
          </span>
        </div>

        {/* Role Switcher for Testing/Demonstration */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Rol Activo:</span>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as CmsRole)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-amber-400 focus:border-amber-500 focus:outline-none"
            >
              <option value="super_admin">Super Administrador</option>
              <option value="booking_agent">Booking Agent (Agente Cuentas)</option>
              <option value="seo_specialist">Especialista SEO / Redactor</option>
              <option value="kyc_officer">Oficial de Cumplimiento (KYC)</option>
            </select>
          </div>

          <div className="h-4 w-px bg-zinc-800" />

          <button
            onClick={() => alert('Sesión cerrada correctamente.')}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Admin Sidebar & Content Layout */}
      <div className="flex min-h-[calc(100vh-65px)]">
        {/* Navigation Sidebar */}
        <aside className="w-64 shrink-0 border-r border-zinc-800 bg-zinc-900/50 p-4">
          <nav className="flex flex-col gap-1 text-sm">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 font-medium text-zinc-300 hover:bg-zinc-800 hover:text-amber-400 transition"
            >
              <span>📊</span> Panel Principal (Dashboard)
            </Link>

            {(activeRole === 'super_admin' || activeRole === 'booking_agent') && (
              <Link
                href="/admin/models/new"
                className="flex items-center gap-2.5 rounded-xl bg-amber-500/10 px-3.5 py-2.5 font-semibold text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition"
              >
                <span>✨</span> Alta Rápida de Modelo (&lt; 3 min)
              </Link>
            )}

            {(activeRole === 'super_admin' || activeRole === 'seo_specialist') && (
              <Link
                href="/admin/seo"
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 font-medium text-zinc-300 hover:bg-zinc-800 hover:text-amber-400 transition"
              >
                <span>🚦</span> Semáforo SEO en Tiempo Real
              </Link>
            )}

            {(activeRole === 'super_admin' || activeRole === 'kyc_officer') && (
              <Link
                href="/admin/kyc"
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 font-medium text-zinc-300 hover:bg-zinc-800 hover:text-amber-400 transition"
              >
                <span>🔒</span> Bóveda KYC Cifrada (AES-256)
              </Link>
            )}

            {activeRole === 'super_admin' && (
              <Link
                href="/admin/audit"
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 font-medium text-zinc-300 hover:bg-zinc-800 hover:text-amber-400 transition"
              >
                <span>📜</span> Bitácora de Auditoría
              </Link>
            )}
          </nav>

          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-400">
            <p className="font-semibold text-zinc-300">Rol: {roleLabels[activeRole]}</p>
            <p className="mt-1 text-[11px] text-zinc-500">
              Acceso restringido a personal de agencia. Operación centralizada B2B.
            </p>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
