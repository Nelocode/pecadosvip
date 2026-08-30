import type { Metadata } from 'next';
import PublicHeader from '@/app/components/PublicHeader';
import PublicFooter from '@/app/components/PublicFooter';

export const metadata: Metadata = {
  title: 'Contacto Privado | PecadosVIP',
  description: 'Canales directos de atención y reservación privada para Madrid, Barcelona y zonas VIP.',
};

export default function ContactoPage() {
  return (
    <div className="public-page synthetic-preview-page">
      <PublicHeader currentPath="/contacto" />

      <main id="main-content" tabIndex={-1} className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
        <div className="synthetic-preview-section-heading text-center">
          <p className="public-eyebrow">Atención Discreta y Confidencial</p>
          <h1 className="text-3xl font-extrabold text-amber-400">Contacto Privado VIP</h1>
          <p className="text-sm text-zinc-400 mt-2">
            Coordinación directa de reservas y consultas con la máxima discreción.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl space-y-6 backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://wa.me/34600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-2xl bg-emerald-600/90 px-6 py-4 text-sm font-bold text-zinc-100 hover:bg-emerald-500 transition shadow-lg"
            >
              <span className="text-xl">💬</span> WhatsApp Directo
            </a>

            <a
              href="https://t.me/pecadosvip"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-2xl bg-sky-600/90 px-6 py-4 text-sm font-bold text-zinc-100 hover:bg-sky-500 transition shadow-lg"
            >
              <span className="text-xl">✈️</span> Telegram Privado
            </a>
          </div>

          <div className="border-t border-zinc-800 pt-6 text-center">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Atención Telefónica Directa</p>
            <a href="tel:+34600000000" className="inline-block mt-2 text-2xl font-extrabold text-amber-400 hover:text-amber-300 transition">
              +34 600 000 000
            </a>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-center text-xs text-zinc-400">
            🔒 <strong>Garantía de Confidencialidad:</strong> Ningún dato de contacto es compartido ni almacenado en registros públicos. Exclusivamente para mayores de 18 años.
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
