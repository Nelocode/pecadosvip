'use client';

import React, { useState } from 'react';
import type { CitySlug } from '@/lib/content/types';

export type LocationSelectorProps = {
  activeCity: CitySlug;
  onCityChange: (newCity: CitySlug) => void;
};

export function LocationSelector({ activeCity, onCityChange }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cityLabels: Record<CitySlug, string> = {
    madrid: 'Madrid',
    barcelona: 'Barcelona',
    girona: 'Girona',
    tarragona: 'Tarragona',
    toledo: 'Toledo',
    guadalajara: 'Guadalajara',
    segovia: 'Segovia',
  };

  const cities: CitySlug[] = ['madrid', 'barcelona', 'girona', 'tarragona', 'toledo', 'guadalajara', 'segovia'];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-zinc-900/90 px-3.5 py-1.5 text-xs font-semibold text-amber-400 shadow-sm hover:border-amber-500 hover:bg-zinc-800 transition"
      >
        <span>📍</span> Ubicación: <span className="font-extrabold text-zinc-100">{cityLabels[activeCity] || activeCity}</span>
        <span className="text-[10px] text-zinc-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-2xl z-50">
          <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Seleccionar Ciudad
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  onCityChange(city);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left font-medium transition ${
                  activeCity === city
                    ? 'bg-amber-500/10 text-amber-400 font-bold'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                }`}
              >
                <span>{cityLabels[city]}</span>
                {activeCity === city && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
