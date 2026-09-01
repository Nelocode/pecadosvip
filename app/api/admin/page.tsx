'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-amber-400">
          Panel de Control B2B — Agencia PecadosVIP
        </h1>
        <p className="mt-2 text-sm text-zinc-300">
          Gestión centralizada de perfiles, tarifas parametrizadas, verificaciones KYC (+18), marcas de agua multimedia y optimización SEO en tiempo real.
        </p>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Modelos Activas</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-400">8</p>
          <p className="mt-1 text-xs text-zinc-500">6 Publicadas, 2 Borradores</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Giras Activas (Tours)</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-400">3</p>
          <p className="mt-1 text-xs text-emerald-400">En tu ciudad esta semana</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Verificaciones KYC (+18)</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-400">100%</p>
          <p className="mt-1 text-xs text-zinc-500">Bóveda Cifrada AES-256</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Semáforo SEO Promedio</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-400">96 / 100</p>
          <p className="mt-1 text-xs text-zinc-500">5 Criterios On-Page Verdes</p>
        </div>
      </div>

      {/* Quick Actions & Recent Profiles Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-100">Perfiles de Modelos Gestionados</h2>
          <Link
            href="/admin/models/new"
            className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 transition hover:bg-amber-400"
          >
            + Alta Rápida (&lt; 3 min)
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="pb-3 font-semibold">Modelo</th>
                <th className="pb-3 font-semibold">Ciudad Base</th>
                <th className="pb-3 font-semibold">Modalidades</th>
                <th className="pb-3 font-semibold">Giras (*Tours*)</th>
                <th className="pb-3 font-semibold">Estado KYC</th>
                <th className="pb-3 font-semibold">SEO</th>
                <th className="pb-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              <tr>
                <td className="py-3.5 font-bold text-amber-400">Valeria</td>
                <td className="py-3.5 text-zinc-300">Madrid</td>
                <td className="py-3.5">
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-400">Incall</span>{' '}
                  <span className="rounded bg-sky-500/10 px-2 py-0.5 text-sky-400">Outcall</span>
                </td>
                <td className="py-3.5 text-zinc-400">Barcelona (Activa)</td>
                <td className="py-3.5 text-emerald-400 font-semibold">Verificada (+18)</td>
                <td className="py-3.5 text-emerald-400 font-semibold">100 (Verde)</td>
                <td className="py-3.5">
                  <Link href="/admin/models/valeria/edit" className="text-amber-500 hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-amber-400">Sofía</td>
                <td className="py-3.5 text-zinc-300">Barcelona</td>
                <td className="py-3.5">
                  <span className="rounded bg-sky-500/10 px-2 py-0.5 text-sky-400">Outcall</span>
                </td>
                <td className="py-3.5 text-zinc-400">Girona (Programada)</td>
                <td className="py-3.5 text-emerald-400 font-semibold">Verificada (+18)</td>
                <td className="py-3.5 text-emerald-400 font-semibold">95 (Verde)</td>
                <td className="py-3.5">
                  <Link href="/admin/models/sofia/edit" className="text-amber-500 hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
