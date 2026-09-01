'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CmsRole } from '@/lib/content/types';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userEmail] = useState<string>('admin@pecadosvip.com');
  const [activeRole] = useState<CmsRole>('super_admin');

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Administrador',
    booking_agent: 'Agente de Cuentas (Booking)',
    seo_specialist: 'Especialista SEO / Redactor',
    kyc_officer: 'Oficial de Cumplimiento (KYC)',
    admin: 'Admin Legacy',
    editor: 'Editor Legacy',
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors
    }
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="admin-portal-root">
      {/* Top Admin Header */}
      <header className="admin-header">
        <div className="admin-brand">
          <Link href="/admin" className="admin-brand-title">
            PecadosVIP <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">CMS Admin</span>
          </Link>
          <span className="admin-badge">
            B2B Centralizado
          </span>
        </div>

        {/* Authenticated User Session Badge & Logout */}
        <div className="admin-user-info">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Usuario:</span>
            <span className="font-semibold text-zinc-200">{userEmail}</span>
            <span className="admin-badge">
              {roleLabels[activeRole] || activeRole}
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-800" />

          <button
            type="button"
            onClick={handleLogout}
            className="admin-btn-logout"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Admin Sidebar & Content Layout */}
      <div className="admin-container">
        {/* Navigation Sidebar */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <Link
              href="/admin"
              className="admin-nav-link"
            >
              <span>📊</span> Panel Principal (Dashboard)
            </Link>

            {(activeRole === 'super_admin' || activeRole === 'booking_agent') && (
              <Link
                href="/admin/models/new"
                className="admin-nav-link-cta"
              >
                <span>✨</span> Alta Rápida de Modelo (&lt; 3 min)
              </Link>
            )}

            {(activeRole === 'super_admin' || activeRole === 'seo_specialist') && (
              <Link
                href="/admin/seo"
                className="admin-nav-link"
              >
                <span>🚦</span> Semáforo SEO en Tiempo Real
              </Link>
            )}

            {(activeRole === 'super_admin' || activeRole === 'kyc_officer') && (
              <Link
                href="/admin/kyc"
                className="admin-nav-link"
              >
                <span>🔒</span> Bóveda KYC Cifrada (AES-256)
              </Link>
            )}

            {activeRole === 'super_admin' && (
              <Link
                href="/admin/analytics"
                className="admin-nav-link"
              >
                <span>📈</span> Analítica Comercial
              </Link>
            )}

            {activeRole === 'super_admin' && (
              <Link
                href="/admin/audit"
                className="admin-nav-link"
              >
                <span>📜</span> Bitácora de Auditoría
              </Link>
            )}
          </nav>

          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-400">
            <p className="font-semibold text-zinc-300">Rol Autenticado: {roleLabels[activeRole] || activeRole}</p>
            <p className="mt-1 text-[11px] text-zinc-500">
              Base de Datos SQLite activa. Acceso cifrado y registrado por IP.
            </p>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
