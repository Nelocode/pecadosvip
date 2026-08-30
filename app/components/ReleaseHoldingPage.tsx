import Link from 'next/link';
import PublicFooter from './PublicFooter';
import PublicHeader from './PublicHeader';
import ProfileCard from './ProfileCard';
import PublicProfileMedia from './PublicProfileMedia';
import { getSyntheticCityMedia } from '../../lib/preview/synthetic-city-media';
import { getSyntheticPreviewProfiles } from '../../lib/preview/synthetic-preview';
import type { Locale } from '../../lib/i18n/locales';

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

export default function ReleaseHoldingPage({
  locale = 'es',
}: {
  locale?: Locale;
  semanticPath?: `/${string}` | '/';
}) {
  const profiles = getSyntheticPreviewProfiles();
  const heroProfile = profiles[0]; // Valeria
  const heroMedia = heroProfile.media.find((asset) => asset.role === 'gallery-03') || heroProfile.media[0];

  return (
    <div className="public-page synthetic-preview-page">
      <PublicHeader currentPath="/" locale={locale} />

      <main id="main-content" tabIndex={-1}>
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

        <section className="public-section synthetic-preview-coverage" id="cobertura">
          <div className="synthetic-preview-coverage-groups">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
              {coverageCities.map((city) => {
                const cityMedia = getSyntheticCityMedia(city.slug as any, locale);
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

        <section className="public-section public-profile-section synthetic-preview-catalog" id="perfiles">
          <div className="profile-grid synthetic-profile-grid">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.slug}
                profile={profile}
                locale={locale}
                preserveFullImage
                profileHref={`/perfiles/${profile.slug}`}
              />
            ))}
          </div>
        </section>
      </main>

      <PublicFooter locale={locale} />
    </div>
  );
}
