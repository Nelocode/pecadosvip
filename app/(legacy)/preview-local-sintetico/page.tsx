/* eslint-disable @next/next/no-html-link-for-pages -- native navigation is the verified Vinext fallback. */
import type { Metadata } from 'next';
// This route is runtime-guarded and must return 404 outside local development.
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import type { Availability, CitySlug } from '../../../lib/content/types';
import {
  filterSyntheticPreviewProfiles,
  getSyntheticPreviewProfiles,
  isSyntheticPreviewRequestAllowed,
} from '../../../lib/preview/synthetic-preview';
import ProfileCard from '../../components/ProfileCard';
import PublicProfileMedia from '../../components/PublicProfileMedia';

export const metadata: Metadata = {
  title: 'PecadosVip · Previsualización local sintética',
  description:
    'Home local no publicable con identidades adultas ficticias generadas con IA para validar la experiencia visual.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const dynamic = 'force-dynamic';

type RawSearchParams = Record<string, string | string[] | undefined>;
type SyntheticPreviewPageProps = {
  searchParams: Promise<RawSearchParams>;
};

const previewCities = [
  'madrid',
  'barcelona',
  'girona',
  'tarragona',
  'toledo',
  'guadalajara',
  'segovia',
] as const satisfies readonly CitySlug[];

const cityLabels: Record<CitySlug, string> = {
  madrid: 'Madrid',
  barcelona: 'Barcelona',
  girona: 'Girona',
  tarragona: 'Tarragona',
  toledo: 'Toledo',
  guadalajara: 'Guadalajara',
  segovia: 'Segovia',
};

const coverageGroups: ReadonlyArray<{
  base: string;
  cities: readonly CitySlug[];
}> = [
  {
    base: 'Zona Madrid',
    cities: ['madrid', 'toledo', 'segovia', 'guadalajara'],
  },
  {
    base: 'Zona Barcelona',
    cities: ['barcelona', 'tarragona', 'girona'],
  },
];

const previewAvailabilities = [
  'available',
  'limited',
  'on-request',
  'unavailable',
] as const;

const trustSignals = [
  {
    code: '01',
    title: 'Solo mayores de 18 años',
    detail: 'Concepto adulto; verificación real pendiente.',
  },
  {
    code: '02',
    title: 'Imágenes identificadas como IA',
    detail: 'Las seis identidades de esta maqueta son ficticias.',
  },
  {
    code: '03',
    title: 'Canales desconectados',
    detail: 'No se envían mensajes, reservas ni pagos.',
  },
  {
    code: '04',
    title: 'Preview no indexable',
    detail: 'Acceso limitado al entorno local de desarrollo.',
  },
] as const;

const previewServices = [
  {
    number: '01',
    title: 'Acompañamiento premium',
    detail: 'Propuesta de contenido pendiente de validación comercial y legal.',
  },
  {
    number: '02',
    title: 'Salidas a domicilios',
    detail: 'Categoría visual simulada; cobertura y condiciones no confirmadas.',
  },
  {
    number: '03',
    title: 'Hoteles',
    detail: 'Categoría visual simulada; disponibilidad real aún no publicada.',
  },
  {
    number: '04',
    title: 'Eventos y ocasiones especiales',
    detail: 'Concepto de servicio sujeto a definición y aprobación del cliente.',
  },
  {
    number: '05',
    title: 'Viajes y desplazamientos',
    detail: 'Alcance ilustrativo sin promesa operativa ni territorial.',
  },
  {
    number: '06',
    title: 'Atención personalizada',
    detail: 'Experiencia propuesta; los canales permanecen desactivados.',
  },
] as const;

function isSingleAllowed<T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[],
): value is T | undefined {
  return value === undefined || (typeof value === 'string' && allowed.includes(value as T));
}

export default async function SyntheticPreviewPage({
  searchParams,
}: SyntheticPreviewPageProps) {
  const requestHeaders = await headers();
  const previewEnvironment = {
    NODE_ENV: import.meta.env.DEV ? 'development' : 'production',
    PECADOSVIP_LOCAL_SYNTHETIC_PREVIEW:
      import.meta.env.VITE_PECADOSVIP_LOCAL_SYNTHETIC_PREVIEW,
  };
  if (
    !isSyntheticPreviewRequestAllowed(
      requestHeaders.get('host'),
      previewEnvironment,
    )
  ) {
    notFound();
  }

  const raw = await searchParams;
  const requestedCity = raw.city === '' ? undefined : raw.city;
  const requestedAvailability =
    raw.availability === '' ? undefined : raw.availability;
  const validFilters =
    isSingleAllowed(requestedCity, previewCities) &&
    isSingleAllowed(requestedAvailability, previewAvailabilities);
  const city = validFilters
    ? (requestedCity as CitySlug | undefined)
    : undefined;
  const availability = validFilters
    ? (requestedAvailability as Availability | undefined)
    : undefined;
  const profiles = validFilters
    ? filterSyntheticPreviewProfiles({ city, availability })
    : [];
  const hasFilters = city !== undefined || availability !== undefined;
  const heroProfile = getSyntheticPreviewProfiles()[0]!;
  const heroMedia = heroProfile.media.find((asset) => asset.role === 'gallery-03')!;

  return (
    <div className="public-page synthetic-preview-page">
      <header className="public-header synthetic-preview-header" id="inicio">
        <a className="public-brand synthetic-preview-brand" href="#inicio">
          <span>PecadosVip</span>
          <small>Preview local</small>
        </a>
        <nav className="public-nav synthetic-preview-nav" aria-label="Navegación del preview">
          <a href="#inicio" aria-current="page">Inicio</a>
          <a href="#cobertura">Cobertura</a>
          <a href="#perfiles">Perfiles</a>
          <a href="#servicios">Servicios</a>
          <a href="#seguridad">Controles</a>
        </nav>
        <button
          className="synthetic-preview-reservation"
          type="button"
          disabled
          title="La reserva no está disponible en esta demostración local"
        >
          Reserva desactivada
        </button>
        <strong>NO PUBLICAR</strong>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="synthetic-preview-hero" aria-labelledby="preview-title">
          <div className="synthetic-preview-hero-copy">
            <p className="public-eyebrow">Discreción · Exclusividad · Placer</p>
            <h1 id="preview-title">
              El lujo de elegir
              <span>en tu casa o en hotel</span>
            </h1>
            <p className="synthetic-preview-hero-location">Madrid y Barcelona</p>
            <p className="synthetic-preview-hero-note">
              Concepto visual local. Ciudades, servicios y disponibilidad por
              confirmar antes de cualquier publicación.
            </p>
            <div className="public-actions">
              <a className="public-primary-action" href="#perfiles">
                Ver perfiles sintéticos
              </a>
              <a className="public-secondary-action" href="#cobertura">
                Explorar cobertura
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
            <span>Imagen generada con IA · {heroProfile.displayName}</span>
          </div>
        </section>

        <section className="public-trust-strip synthetic-preview-trust" aria-label="Controles visibles de la demostración">
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

        <section className="public-section synthetic-preview-coverage" id="cobertura" aria-labelledby="coverage-title">
          <div className="public-section-heading synthetic-preview-section-heading">
            <p className="public-eyebrow">Cobertura visual · simulada</p>
            <h2 id="coverage-title">Siete ciudades en la experiencia propuesta</h2>
            <p>
              Esta distribución sirve para validar arquitectura y diseño. Ninguna
              ciudad se presenta como cobertura comercial confirmada.
            </p>
          </div>
          <div className="synthetic-preview-coverage-groups">
            {coverageGroups.map((group) => (
              <article key={group.base} aria-labelledby={`coverage-${group.base.replace(' ', '-').toLowerCase()}`}>
                <h3 id={`coverage-${group.base.replace(' ', '-').toLowerCase()}`}>{group.base}</h3>
                <ul>
                  {group.cities.map((citySlug) => (
                    <li key={citySlug}>
                      <strong>{cityLabels[citySlug]}</strong>
                      <span>En confirmación</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="public-section public-profile-section synthetic-preview-catalog" id="perfiles" aria-labelledby="preview-results-title">
          <div className="public-section-heading public-section-heading-inline synthetic-preview-section-heading">
            <div>
              <p className="public-eyebrow">Seis identidades adultas ficticias</p>
              <h2 id="preview-results-title">Modelos sintéticas destacadas</h2>
              <p id="synthetic-preview-note">
                Todas las imágenes fueron generadas con IA para esta maqueta local.
                No representan personas reales ni disponibilidad comercial.
              </p>
            </div>
            {validFilters ? (
              <span className="synthetic-preview-result-count" role="status">
                {profiles.length} {profiles.length === 1 ? 'perfil ficticio' : 'perfiles ficticios'}
              </span>
            ) : null}
          </div>

          <form
            className="profile-filters synthetic-preview-filters"
            action="/preview-local-sintetico#perfiles"
            method="get"
          >
            <fieldset>
              <legend>Filtrar el catálogo sintético</legend>
              <p className="profile-filter-help">
                Los filtros solo reorganizan las seis identidades ficticias del preview.
              </p>
              <label htmlFor="preview-city">
                Ciudad simulada
                <select id="preview-city" name="city" defaultValue={city ?? ''}>
                  <option value="">Todas</option>
                  {previewCities.map((citySlug) => (
                    <option key={citySlug} value={citySlug}>{cityLabels[citySlug]}</option>
                  ))}
                </select>
              </label>
              <label htmlFor="preview-availability">
                Estado simulado
                <select
                  id="preview-availability"
                  name="availability"
                  defaultValue={availability ?? ''}
                >
                  <option value="">Todos</option>
                  <option value="available">Disponible</option>
                  <option value="limited">Limitada</option>
                  <option value="on-request">Bajo consulta</option>
                  <option value="unavailable">No disponible</option>
                </select>
              </label>
              <div className="synthetic-preview-filter-actions">
                <button type="submit">Aplicar filtros</button>
                <a href="/preview-local-sintetico#perfiles">Restablecer</a>
              </div>
            </fieldset>
          </form>

          {!validFilters ? (
            <div className="public-empty-state public-empty-state-error" role="alert">
              <strong>Los filtros del preview no son válidos.</strong>
              <p>No se cargó ningún archivo. Restablece la maqueta para continuar.</p>
              <a href="/preview-local-sintetico#perfiles">Restablecer filtros</a>
            </div>
          ) : profiles.length > 0 ? (
            <div className="profile-grid synthetic-profile-grid">
              {profiles.map((candidate) => (
                <ProfileCard
                  disclosure={candidate.syntheticNotice}
                  key={candidate.slug}
                  preserveFullImage
                  profile={candidate}
                  profileHref={`/preview-local-sintetico/perfiles/${candidate.slug}`}
                />
              ))}
            </div>
          ) : hasFilters ? (
            <div className="public-empty-state" role="status">
              <strong>No hay perfiles ficticios para esta combinación.</strong>
              <p>Prueba otra ciudad o estado para continuar revisando la interfaz.</p>
              <a href="/preview-local-sintetico#perfiles">Restablecer filtros</a>
            </div>
          ) : null}
        </section>

        <section className="public-section synthetic-preview-services" id="servicios" aria-labelledby="services-title">
          <div className="public-section-heading synthetic-preview-section-heading">
            <p className="public-eyebrow">Servicios exclusivos · propuesta</p>
            <h2 id="services-title">Una arquitectura preparada para crecer</h2>
            <p>
              Estas categorías son parte del diseño solicitado. Sus condiciones,
              alcance y disponibilidad requieren aprobación antes de publicarse.
            </p>
          </div>
          <div className="synthetic-preview-service-grid">
            {previewServices.map((service) => (
              <article key={service.number}>
                <span aria-hidden="true">{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.detail}</p>
              </article>
            ))}
          </div>
          <div className="synthetic-preview-disabled-conversion" role="note">
            <div>
              <p className="public-eyebrow">Conversión protegida</p>
              <h3>Contacto y reserva permanecen desactivados</h3>
              <p>No hay destino externo, formulario, pago ni mensajería en este preview.</p>
            </div>
            <button type="button" disabled>Contactar · no disponible</button>
          </div>
        </section>

        <section className="synthetic-preview-safety" id="seguridad" aria-labelledby="preview-safety-title">
          <p className="public-eyebrow">Controles activos</p>
          <h2 id="preview-safety-title">Solo demostración local</h2>
          <ul>
            <li>Las seis identidades son ficticias y están señalizadas como IA.</li>
            <li>Los archivos originales siguen fuera de las rutas públicas de producción.</li>
            <li>No hay enlaces de contacto, reservas, pagos ni indexación.</li>
            <li>La cobertura, los servicios y los textos continúan en confirmación.</li>
          </ul>
        </section>
      </main>

      <nav className="public-mobile-nav synthetic-preview-mobile-nav" aria-label="Navegación móvil del preview">
        <a href="#inicio" aria-current="page">Inicio</a>
        <a href="#cobertura">Ciudades</a>
        <a href="#perfiles">Perfiles</a>
        <a href="#servicios">Servicios</a>
        <a href="#seguridad">Control</a>
      </nav>

      <footer className="public-footer synthetic-preview-footer">
        <div>
          <p className="synthetic-preview-footer-brand">PecadosVip</p>
          <p>Harness local no indexable · sin canales externos</p>
        </div>
        <nav aria-label="Enlaces internos del pie">
          <a href="#inicio">Inicio</a>
          <a href="#perfiles">Perfiles</a>
          <a href="#servicios">Servicios</a>
          <a href="#main-content">Volver arriba</a>
        </nav>
        <span>Revisión humana, comercial y legal pendiente</span>
      </footer>
    </div>
  );
}
