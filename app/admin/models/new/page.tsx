'use client';

import React, { useState, useTransition } from 'react';
import { analyzeProfileSeo } from '@/lib/seo/seo-evaluator';

export default function NewModelFastCreationPage() {
  const [, startTransition] = useTransition();

  // Model Form State
  const [artisticName, setArtisticName] = useState('Valeria VIP');
  const [age, setAge] = useState<number>(24);
  const [nationality, setNationality] = useState('Española');
  const [citySlug, setCitySlug] = useState('madrid');
  const [incall, setIncall] = useState(true);
  const [outcall, setOutcall] = useState(true);
  const [biography, setBiography] = useState(
    'Valeria es una distinguida modelo independiente en Madrid. Disponible para eventos sociales de alto nivel, cenas exclusivas y compañía de lujo.'
  );

  // Physical traits
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(54);
  const [bustCm, setBustCm] = useState(90);
  const [waistCm, setWaistCm] = useState(60);
  const [hipsCm, setHipsCm] = useState(90);
  const [eyeColor, setEyeColor] = useState('Verdes');
  const [hairColor, setHairColor] = useState('Castaño');

  // Rates Matrix
  const [price1h, setPrice1h] = useState(250);
  const [price2h, setPrice2h] = useState(450);
  const [priceFullNight, setPriceFullNight] = useState(1200);

  // SEO On-Page Form State
  const [seoTitle, setSeoTitle] = useState('Acompañante VIP en Madrid | Valeria Escort de Lujo');
  const [metaDescription, setMetaDescription] = useState(
    'Reserva una experiencia exclusiva con Valeria en Madrid. Disfruta de la mejor compañía VIP. Contacta hoy mismo para agendar tu cita privada.'
  );
  const [targetKeyword, setTargetKeyword] = useState('Valeria');

  // Live SEO Evaluation
  const seoReport = analyzeProfileSeo({
    title: seoTitle,
    metaDescription,
    bodyText: biography,
    targetKeyword,
    targetCity: citySlug,
    galleryImages: [{ alt: 'Valeria foto principal en Madrid' }],
  });

  const handleApplyTemplate = () => {
    startTransition(() => {
      setArtisticName('Sofía Modelo');
      setAge(25);
      setCitySlug('barcelona');
      setSeoTitle('Acompañante VIP en Barcelona | Sofía Escort de Lujo');
      setMetaDescription(
        'Reserva una cita exclusiva con Sofía en Barcelona. Disfruta de compañía VIP para eventos y cenas. Contacta ahora para reservar.'
      );
      setTargetKeyword('Sofía');
      setBiography(
        'Sofía es una elegante acompañante de lujo disponible en Barcelona. Servicios de alta calidad para clientes exigentes.'
      );
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`¡Perfil de "${artisticName}" creado con éxito en menos de 3 minutos!\nPuntuación SEO: ${seoReport.overallScore}/100.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-400">
            Alta Rápida de Modelo (&lt; 3 minutos)
          </h1>
          <p className="text-xs text-zinc-400">
            Formulario optimizado para agencias B2B con autocompletado y Semáforo SEO en tiempo real.
          </p>
        </div>
        <button
          type="button"
          onClick={handleApplyTemplate}
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/20"
        >
          ⚡ Cargar Plantilla de Ejemplo
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Main Model Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Section 1: Personal & Artistic Data */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
            <h2 className="text-base font-bold text-zinc-100 border-b border-zinc-800 pb-2">
              1. Datos Personales y Artísticos
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-zinc-300">Nombre Artístico</label>
                <input
                  type="text"
                  value={artisticName}
                  onChange={(e) => setArtisticName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300">Edad (+18 años)</label>
                <input
                  type="number"
                  min={18}
                  max={60}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10))}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300">Nacionalidad</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300">Ciudad Principal</label>
                <select
                  value={citySlug}
                  onChange={(e) => setCitySlug(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                >
                  <option value="madrid">Madrid</option>
                  <option value="barcelona">Barcelona</option>
                  <option value="girona">Girona</option>
                  <option value="tarragona">Tarragona</option>
                  <option value="toledo">Toledo</option>
                  <option value="guadalajara">Guadalajara</option>
                  <option value="segovia">Segovia</option>
                </select>
              </div>
            </div>

            {/* Physical traits */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 pt-2">
              <div>
                <label className="block text-[11px] text-zinc-400">Altura (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value, 10))}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400">Peso (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseInt(e.target.value, 10))}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400">Busto (cm)</label>
                <input
                  type="number"
                  value={bustCm}
                  onChange={(e) => setBustCm(parseInt(e.target.value, 10))}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400">Cintura (cm)</label>
                <input
                  type="number"
                  value={waistCm}
                  onChange={(e) => setWaistCm(parseInt(e.target.value, 10))}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400">Cadera (cm)</label>
                <input
                  type="number"
                  value={hipsCm}
                  onChange={(e) => setHipsCm(parseInt(e.target.value, 10))}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Service Modalities & Rates */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
            <h2 className="text-base font-bold text-zinc-100 border-b border-zinc-800 pb-2">
              2. Modalidades y Estructura Tarifaria
            </h2>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-zinc-200">
                <input
                  type="checkbox"
                  checked={incall}
                  onChange={(e) => setIncall(e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-500"
                />
                Incall (Atención en departamento/hotel propio)
              </label>

              <label className="flex items-center gap-2 text-sm text-zinc-200">
                <input
                  type="checkbox"
                  checked={outcall}
                  onChange={(e) => setOutcall(e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-500"
                />
                Outcall (Visita a domicilio/hotel cliente)
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-zinc-300">Tarifa 1 Hora (€)</label>
                <input
                  type="number"
                  value={price1h}
                  onChange={(e) => setPrice1h(parseInt(e.target.value, 10))}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-sm text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300">Tarifa 2 Horas (€)</label>
                <input
                  type="number"
                  value={price2h}
                  onChange={(e) => setPrice2h(parseInt(e.target.value, 10))}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-sm text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300">Noche Completa (€)</label>
                <input
                  type="number"
                  value={priceFullNight}
                  onChange={(e) => setPriceFullNight(parseInt(e.target.value, 10))}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-sm text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Biography Copy & SEO Inputs */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
            <h2 className="text-base font-bold text-zinc-100 border-b border-zinc-800 pb-2">
              3. Redacción y Optimización SEO
            </h2>

            <div>
              <label className="block text-xs font-medium text-zinc-300">Biografía / Descripción del Perfil</label>
              <textarea
                rows={4}
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3.5 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300">Título SEO (Title Tag)</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-sm text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300">Meta Descripción SEO</label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3.5 text-sm text-zinc-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 py-4 font-bold text-zinc-950 shadow-lg hover:from-amber-400 hover:to-amber-500 transition"
          >
            🚀 Crear y Guardar Perfil de Modelo
          </button>
        </form>

        {/* Right 1 Column: Real-Time SEO Traffic Light Panel */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-zinc-100">🚦 Semáforo SEO On-Page</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  seoReport.overallStatus === 'green'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : seoReport.overallStatus === 'orange'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                Puntuación: {seoReport.overallScore}/100
              </span>
            </div>

            {/* Individual Metrics Traffic Light List */}
            <div className="space-y-4 text-xs">
              {/* Metric 1: Title */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-zinc-300">Título SEO (Title Tag)</span>
                  <span className={seoReport.metrics.title.status === 'green' ? 'text-emerald-400' : 'text-rose-400'}>
                    {seoReport.metrics.title.status === 'green' ? '● Verde' : '● Alerta'}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-400">{seoReport.metrics.title.message}</p>
              </div>

              {/* Metric 2: Meta Description */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-zinc-300">Meta Descripción</span>
                  <span className={seoReport.metrics.metaDescription.status === 'green' ? 'text-emerald-400' : 'text-amber-400'}>
                    {seoReport.metrics.metaDescription.status === 'green' ? '● Verde' : '● Alerta'}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-400">{seoReport.metrics.metaDescription.message}</p>
              </div>

              {/* Metric 3: Keyword Density */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-zinc-300">Densidad de Keyword</span>
                  <span className={seoReport.metrics.keywordDensity.status === 'green' ? 'text-emerald-400' : 'text-amber-400'}>
                    {seoReport.metrics.keywordDensity.status === 'green' ? '● Verde' : '● Alerta'}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-400">{seoReport.metrics.keywordDensity.message}</p>
              </div>

              {/* Metric 4: Gallery Alt Tags */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-zinc-300">Atributos Alt en Galería</span>
                  <span className={seoReport.metrics.galleryAlt.status === 'green' ? 'text-emerald-400' : 'text-amber-400'}>
                    {seoReport.metrics.galleryAlt.status === 'green' ? '● Verde' : '● Alerta'}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-400">{seoReport.metrics.galleryAlt.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
