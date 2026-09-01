'use client';

import React from 'react';

export default function ConversionAnalyticsDashboardPage() {
  const channelMetrics = [
    { channel: 'WhatsApp', clics: 142, conversionRate: '62%', topCity: 'Madrid' },
    { channel: 'Telegram', clics: 88, conversionRate: '28%', topCity: 'Barcelona' },
    { channel: 'Llamada Directa (tel:)', clics: 34, conversionRate: '15%', topCity: 'Madrid' },
    { channel: 'Formulario Cifrado (E2EE)', clics: 18, conversionRate: '8%', topCity: 'Girona' },
  ];

  const modelMetrics = [
    { name: 'Valeria', city: 'Madrid', whatsapp: 78, telegram: 42, total: 120 },
    { name: 'Sofía', city: 'Barcelona', whatsapp: 64, telegram: 46, total: 110 },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold text-amber-400">
          📈 Panel Comercial de Analítica de Clics y Conversión por Canal
        </h1>
        <p className="text-xs text-zinc-400">
          Trazabilidad en tiempo real de interacciones por canal (WhatsApp, Telegram, Teléfono, Formulario Cifrado), modelo y ciudad de origen.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Clics de Contacto</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-400">282</p>
          <p className="mt-1 text-xs text-emerald-400">+18% esta semana</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Canal Principal</p>
          <p className="mt-2 text-2xl font-extrabold text-emerald-400">WhatsApp (62%)</p>
          <p className="mt-1 text-xs text-zinc-500">142 interacciones</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Ciudad de Mayor Demanda</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-400">Madrid</p>
          <p className="mt-1 text-xs text-zinc-500">54% del tráfico total</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Modelo Más Consultada</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-400">Valeria</p>
          <p className="mt-1 text-xs text-zinc-500">120 consultas privadas</p>
        </div>
      </div>

      {/* Channel Breakdown Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-zinc-100 border-b border-zinc-800 pb-2">
          Desglose de Rendimiento por Canal de Comunicación
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="pb-3 font-semibold">Canal de Comunicación</th>
                <th className="pb-3 font-semibold">Clics Registrados</th>
                <th className="pb-3 font-semibold">Porcentaje de Conversión</th>
                <th className="pb-3 font-semibold">Ciudad Principal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
              {channelMetrics.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3.5 font-sans font-bold text-amber-400">{row.channel}</td>
                  <td className="py-3.5 text-zinc-200">{row.clics}</td>
                  <td className="py-3.5 text-emerald-400 font-bold">{row.conversionRate}</td>
                  <td className="py-3.5 font-sans text-zinc-300">{row.topCity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
