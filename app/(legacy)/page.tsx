import type { Metadata } from 'next';
import Link from 'next/link';
import { buildPublicMetadata } from '../../lib/seo';
import PublicFooter from '../components/PublicFooter';
import PublicHeader from '../components/PublicHeader';
import ProfileCard from '../components/ProfileCard';
import PublicProfileMedia from '../components/PublicProfileMedia';
import { getSyntheticCityMedia } from '../../lib/preview/synthetic-city-media';
import { getSyntheticPreviewProfiles } from '../../lib/preview/synthetic-preview';

export const metadata: Metadata = buildPublicMetadata({
  path: '/',
  title: 'PecadosVIP | Acompañantes VIP en Madrid y Barcelona',
  description:
    'Experiencia exclusiva de compañía privada con desplazamiento a hoteles y domicilios en Madrid, Barcelona y ciudades principales.',
});

const trustSignals = [
  { code: '01', title: 'Solo mayores de 18 años', detail: 'Verificación de mayoría de edad y privacidad cuidada.' },
  { code: '02', title: 'Atención discreta y privada', detail: 'Desplazamiento directo a hoteles de lujo y domicilios.' },
  { code: '03', title: 'Sin local abierto al público', detail: 'Coordinación 100% privada sin intermediarios expositivos.' },
  { code: '04', title: 'Contacto directo seguro', detail: 'Canales directos de WhatsApp, Telegram y llamada telefónica.' },
];

const coverageCities = [
  { slug: 'madrid', name: 'Madrid', label: 'Cobertura VIP Madrid' },
  { slug: 'barcelona', name: 'Barcelona', label: 'Cobertura VIP Barcelona' },
  { slug: 'girona', name: 'Girona', label: 'Zona Cataluña' },
  { slug: 'tarragona', name: 'Tarragona', label: 'Zona Costa' },
  { slug: 'toledo', name: 'Toledo', label: 'Zona Centro' },
  { slug: 'guadalajara', name: 'Guadalajara', label: 'Zona Centro' },
] as const;

const servicesList = [
  { number: '01', title: 'Acompañamiento Premium', detail: 'Cenas de lujo, eventos sociales y cenas corporativas de alto nivel.' },
  { number: '02', title: 'Salidas a Domicilios', detail: 'Atención exclusiva en la comodidad y privacidad de tu residencia.' },
  { number: '03', title: 'Hoteles de Lujo', detail: 'Desplazamiento a los principales hoteles de 5 estrellas y suites.' },
  { number: '04', title: 'Eventos Especiales', detail: 'Compañía sofisticada para veladas, galas y celebraciones privadas.' },
  { number: '05', title: 'Viajes y Escapadas', detail: 'Acompañamiento en viajes de negocios y vacaciones de descanso.' },
  { number: '06', title: 'Atención Personalizada', detail: 'Experiencias a medida coordinadas con la mayor confidencialidad.' },
];

export default function Home() {
  const profiles = getSyntheticPreviewProfiles();
  const heroProfile = profiles[0]; // Valeria
  const heroMedia = heroProfile.media.find((asset) => asset.role === 'gallery-03') || heroProfile.media[0];

  return (
    <div className="public-page synthetic-preview-page">
      <PublicHeader currentPath="/" />

      <main id="main-content" tabIndex={-1}>
        {/* Luxury Hero Section matching Screenshot 1 */}
        <section className="synthetic-preview-hero" aria-labelledby="home-title">
          <div className="synthetic-preview-hero-copy">
            <p className="public-eyebrow">Discreción · Exclusividad · Placer</p>
            <h1 id="home-title">
              <span className="synthetic-preview-hero-title-primary">
                El lujo de elegir
              </span>{' '}
              <span className="synthetic-preview-hero-title-secondary">
                en tu casa o en hotel
              </span>
            </h1>
            <p className="synthetic-preview-hero-location">Madrid y Barcelona</p>
            <p className="synthetic-preview-hero-note">
              Servicio exclusivo de compañía privada de alto nivel. Atención personalizada con la máxima discreción y profesionalidad.
            </p>
            <div className="public-actions">
              <a className="public-primary-action" href="/perfiles">
                Ver perfiles
              </a>
              <a className="public-secondary-action" href="/contacto">
                Contacto privado
              </a>
            </div>
          </div>

          <div className="synthetic-preview-hero-media">
            <PublicProfileMedia
              media={heroMedia}
              priority
              preserveFullImage
              sizes="(max-width: 780px) 100vw, 48vw"
            />
            <span>{heroProfile.displayName} · Perfil Destacado</span>
          </div>
        </section>

        {/* Trust Signals Strip */}
        <section className="public-trust-strip synthetic-preview-trust" aria-label="Principios de atención">
          {trustSignals.map((signal) => (
            <article key={signal.code}>
              <span aria-hidden="true">{signal.code}</span>
              <div>
                <strong>{signal.title}</strong>
                <small>{signal.detail}</small>
              </div>
            </article>
          ))}
        </section>

        {/* Coverage Section with City Media */}
        <section className="public-section synthetic-preview-coverage" id="cobertura" aria-labelledby="coverage-title">
          <div className="public-section-heading synthetic-preview-section-heading">
            <p className="public-eyebrow">Cobertura geográfica VIP</p>
            <h2 id="coverage-title">Ciudades y Zonas de Cobertura</h2>
            <p>Atención prioritaria en Madrid y Barcelona, con desplazamientos disponibles a zonas metropolitanas.</p>
          </div>

          <div className="synthetic-preview-coverage-groups">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
              {coverageCities.map((city) => {
                const cityMedia = getSyntheticCityMedia(city.slug as any, 'es');
                return (
                  <Link href={`/${city.slug}`} key={city.slug} className="group block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 hover:border-amber-500/50 transition">
                    <figure className="synthetic-preview-city-media mb-2 h-36 overflow-hidden rounded-lg">
                      <PublicProfileMedia
                        media={cityMedia}
                        objectPosition={cityMedia.objectPosition}
                        preserveFullImage={false}
                        sizes="24vw"
                      />
                    </figure>
                    <div className="synthetic-preview-city-copy">
                      <strong className="text-amber-400 group-hover:text-amber-300">{city.name}</strong>
                      <span className="text-xs text-zinc-400 block">{city.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Profile Catalog Section */}
        <section className="public-section public-profile-section synthetic-preview-catalog" id="perfiles" aria-labelledby="profiles-title">
          <div className="public-section-heading public-section-heading-inline synthetic-preview-section-heading">
            <div>
              <p className="public-eyebrow">Catálogo Exclusivo</p>
              <h2 id="profiles-title">Modelos Destacadas</h2>
              <p>Perfiles verificados disponibles para reservaciones privadas en hotel o domicilio.</p>
            </div>
            <a href="/perfiles" className="text-xs font-bold uppercase text-amber-400 hover:underline">
              Ver todos los perfiles →
            </a>
          </div>

          <div className="profile-grid synthetic-profile-grid">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.slug}
                profile={profile}
                preserveFullImage
                profileHref={`/perfiles/${profile.slug}`}
              />
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="public-section synthetic-preview-services" id="servicios" aria-labelledby="services-title">
          <div className="public-section-heading synthetic-preview-section-heading">
            <p className="public-eyebrow">Servicios VIP</p>
            <h2 id="services-title">Experiencias de Compañía Exclusivas</h2>
            <p>Servicios diseñados para satisfacer las expectativas más exigentes con total discreción.</p>
          </div>

          <div className="synthetic-preview-service-grid">
            {servicesList.map((service) => (
              <article key={service.number}>
                <a href="/servicios">
                  <span aria-hidden="true">{service.number}</span>
                  <h3>{service.title}</h3>
                  <p>{service.detail}</p>
                  <strong>Ver detalles <span aria-hidden="true">→</span></strong>
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
