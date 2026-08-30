'use client';

import { useState, useEffect } from 'react';

const AGE_GATE_COOKIE_NAME = 'pvip_age_confirmed_v1';

export function AgeGateModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if age confirmation cookie exists
    const cookies = document.cookie.split(';').map((c) => c.trim());
    const hasConfirmedAge = cookies.some((c) => c.startsWith(`${AGE_GATE_COOKIE_NAME}=true`));

    if (!hasConfirmedAge) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirmAge = () => {
    // Set encrypted/secure cookie valid for 30 days
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${AGE_GATE_COOKIE_NAME}=true; expires=${expires}; path=/; SameSite=Strict; Secure`;
    setIsOpen(false);
  };

  const handleRejectAge = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div className="max-w-md rounded-2xl border border-amber-500/30 bg-zinc-900 p-6 text-center text-zinc-100 shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
          <span className="text-2xl font-bold">+18</span>
        </div>

        <h2 id="age-gate-title" className="text-xl font-bold text-amber-400">
          Verificación de Mayoría de Edad
        </h2>

        <p className="mt-3 text-sm text-zinc-300">
          Este sitio web contiene material reservado exclusivamente para adultos (+18 años). Al ingresar, confirmas bajo tu responsabilidad legal que eres mayor de edad en tu jurisdicción.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleConfirmAge}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 font-semibold text-zinc-950 transition hover:from-amber-400 hover:to-amber-500"
          >
            Soy Mayor de Edad (+18)
          </button>
          <button
            onClick={handleRejectAge}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 font-semibold text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
          >
            Salir
          </button>
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          Al hacer clic en &quot;Soy Mayor de Edad&quot;, aceptas nuestras políticas de cookies y privacidad.
        </p>
      </div>
    </div>
  );
}
