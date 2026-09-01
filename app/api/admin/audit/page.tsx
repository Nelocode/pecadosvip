'use client';

import React from 'react';

export default function AuditLogsPage() {
  const sampleAuditLogs = [
    {
      id: 'aud-001',
      actor: 'Super Administrador (local-admin)',
      role: 'super_admin',
      action: 'Cifrado de Documento KYC (+18)',
      resource: 'Modelo: Valeria (valeria)',
      ip: '127.0.0.1',
      timestamp: '2026-08-30T17:15:00Z',
    },
    {
      id: 'aud-002',
      actor: 'Booking Agent (agent-01)',
      role: 'booking_agent',
      action: 'Actualización de Tarifas e Itinerario de Gira (Barcelona)',
      resource: 'Modelo: Sofía (sofia)',
      ip: '127.0.0.1',
      timestamp: '2026-08-30T16:45:00Z',
    },
    {
      id: 'aud-003',
      actor: 'Especialista SEO (seo-01)',
      role: 'seo_specialist',
      action: 'Optimización de Title Tag y Meta Descripción',
      resource: 'Modelo: Valeria (valeria)',
      ip: '127.0.0.1',
      timestamp: '2026-08-30T16:10:00Z',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold text-amber-400">
          📜 Bitácora de Auditoría e Historial Inmutable
        </h1>
        <p className="text-xs text-zinc-400">
          Registro inmutable de todas las acciones del panel: operador de agencia, rol, dirección IP de origen, fecha/hora y detalle de cambios.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="pb-3 font-semibold">ID Evento</th>
                <th className="pb-3 font-semibold">Operador</th>
                <th className="pb-3 font-semibold">Rol</th>
                <th className="pb-3 font-semibold">Acción Ejecutada</th>
                <th className="pb-3 font-semibold">Recurso / Modelo</th>
                <th className="pb-3 font-semibold">IP Origen</th>
                <th className="pb-3 font-semibold">Fecha / Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
              {sampleAuditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-3.5 font-bold text-amber-500">{log.id}</td>
                  <td className="py-3.5 font-sans font-medium text-zinc-200">{log.actor}</td>
                  <td className="py-3.5">
                    <span className="rounded bg-amber-500/10 px-2 py-0.5 text-amber-400 font-sans">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3.5 font-sans text-zinc-300">{log.action}</td>
                  <td className="py-3.5 font-sans text-zinc-400">{log.resource}</td>
                  <td className="py-3.5 text-zinc-400">{log.ip}</td>
                  <td className="py-3.5 text-zinc-500">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
