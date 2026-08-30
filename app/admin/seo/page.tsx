'use client';

import React from 'react';
import { analyzeProfileSeo } from '@/lib/seo/seo-evaluator';

export default function GlobalSeoDashboardPage() {
  const sampleProfiles = [
    {
      name: 'Valeria',
      city: 'Madrid',
      title: 'Acompañante VIP en Madrid | Valeria Escort de Lujo',
      meta: 'Reserva una experiencia exclusiva con Valeria en Madrid. Disfruta de la mejor compañía VIP. Contacta hoy mismo para agendar tu cita privada.',
      body: 'Valeria es una modelo VIP en Madrid disponible para eventos sociales y cenas.',
      kw: 'Valeria',
    },
    {
      name: 'Sofía',
      city: 'Barcelona',
      title: 'Acompañante VIP en Barcelona | Sofía Escort de Lujo',
      meta: 'Reserva una cita exclusiva con Sofía en Barcelona. Disfruta de compañía VIP para eventos. Contacta ahora.',
      body: 'Sofía es una elegante acompañante independiente en Barcelona.',
      kw: 'Sofía',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold text-amber-400">
          🚦 Módulo de Optimización SEO y Semáforo On-Page
        </h1>
        <p className="text-xs text-zinc-400">
          Evaluación automatizada en tiempo real inspirada en Yoast SEO: Title, Meta Description, Densidad de Keywords, Alt tags y Encabezados.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sampleProfiles.map((p, idx) => {
          const report = analyzeProfileSeo({
            title: p.title,
            metaDescription: p.meta,
            bodyText: p.body,
            targetKeyword: p.kw,
            targetCity: p.city,
            galleryImages: [{ alt: `${p.name} foto` }],
          });

          return (
            <div key={idx} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-amber-400">{p.name} ({p.city})</h3>
                  <p className="text-xs text-zinc-400">Keyword Objetivo: &quot;{p.kw}&quot;</p>
                </div>

                <span
                  className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                    report.overallStatus === 'green'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  Puntuación Global: {report.overallScore}/100
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <p className="font-semibold text-zinc-300">Título SEO</p>
                  <p className={`mt-1 font-bold ${report.metrics.title.status === 'green' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {report.metrics.title.message}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <p className="font-semibold text-zinc-300">Meta Descripción</p>
                  <p className={`mt-1 font-bold ${report.metrics.metaDescription.status === 'green' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {report.metrics.metaDescription.message}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <p className="font-semibold text-zinc-300">Densidad Keyword</p>
                  <p className={`mt-1 font-bold ${report.metrics.keywordDensity.status === 'green' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {report.metrics.keywordDensity.message}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <p className="font-semibold text-zinc-300">Galería Alt Tags</p>
                  <p className={`mt-1 font-bold ${report.metrics.galleryAlt.status === 'green' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {report.metrics.galleryAlt.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
