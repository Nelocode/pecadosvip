import type { Metadata } from 'next';
import PublicHeader from '@/app/components/PublicHeader';
import PublicFooter from '@/app/components/PublicFooter';

export const metadata: Metadata = {
  title: 'Servicios VIP de Compañía | PecadosVIP',
  description: 'Catálogo exclusivo de servicios de compañía para cenas de gala, eventos sociales, hoteles y residencias privadas.',
};

const servicesList = [
  { number: '01', title: 'Acompañamiento Premium', detail: 'Cenas de lujo, eventos sociales, óperas y reuniones corporativas de alto nivel.' },
  { number: '02', title: 'Salidas a Domicilio', detail: 'Atención exclusiva en la comodidad y total privacidad de tu residencia.' },
  { number: '03', title: 'Hoteles de Lujo', detail: 'Desplazamiento directo a las suites de los principales hoteles 5 estrellas.' },
  { number: '04', title: 'Eventos Especiales', detail: 'Compañía refinada para celebraciones privadas, veladas y eventos VIP.' },
  { number: '05', title: 'Viajes y Escapadas', detail: 'Acompañamiento en viajes de vacaciones y desplazamientos de negocios.' },
  { number: '06', title: 'Atención Personalizada', detail: 'Servicios a medida planificados con la máxima discreción y confidencialidad.' },
];

export default function ServiciosPage() {
  return (
    <div className="public-page synthetic-preview-page">
      <PublicHeader currentPath="/servicios" />

      <main id="main-content" tabIndex={-1} className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        <div className="synthetic-preview-section-heading">
          <p className="public-eyebrow">Exclusividad · Atención a Medida</p>
          <h1 className="text-3xl font-extrabold text-amber-400">Servicios VIP de Compañía</h1>
          <p className="text-sm text-zinc-400 mt-2">
            Propuesta de servicios exclusivos desarrollados para satisfacer las expectativas más exigentes.
          </p>
        </div>

        <div className="synthetic-preview-service-grid">
          {servicesList.map((service) => (
            <article key={service.number}>
              <a href="/contacto">
                <span aria-hidden="true">{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.detail}</p>
                <strong>Consultar disponibilidad <span aria-hidden="true">→</span></strong>
              </a>
            </article>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
