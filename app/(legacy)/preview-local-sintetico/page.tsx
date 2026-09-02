import type { Metadata } from 'next';
import Image from 'next/image';
// This route is runtime-guarded and must return 404 outside local development.
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import type { Availability, CitySlug } from '../../../lib/content/types';
import type { Locale } from '../../../lib/i18n/locales';
import {
  getSyntheticCityMedia,
  getSyntheticCityPresentation,
} from '../../../lib/preview/synthetic-city-media';
import type { SyntheticCityMediaSlug } from '../../../lib/preview/synthetic-city-media';
import { isSyntheticServiceLocale } from '../../../lib/preview/synthetic-services';
import { getSyntheticHeroMedia } from '../../../lib/preview/synthetic-hero-media';
import {
  filterSyntheticPreviewProfiles,
  getSyntheticPreviewProfiles,
  isSyntheticPreviewRequestAllowed,
} from '../../../lib/preview/synthetic-preview';
import type { SyntheticPreviewProfile } from '../../../lib/preview/synthetic-preview';
import ProfileCard from '../../components/ProfileCard';
import PublicProfileMedia from '../../components/PublicProfileMedia';
import SyntheticFiligree from '../../components/SyntheticFiligree';

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

const cityLabels: Record<SyntheticCityMediaSlug, string> = {
  madrid: 'Madrid',
  barcelona: 'Barcelona',
  girona: 'Girona',
  tarragona: 'Tarragona',
  toledo: 'Toledo',
  guadalajara: 'Guadalajara',
  segovia: 'Segovia',
  sitges: 'Sitges',
};

const coverageGroups: ReadonlyArray<{
  base: 'madrid' | 'barcelona';
  cities: readonly SyntheticCityMediaSlug[];
}> = [
  {
    base: 'madrid',
    cities: ['madrid', 'toledo', 'segovia', 'guadalajara'],
  },
  {
    base: 'barcelona',
    cities: ['barcelona', 'tarragona', 'girona', 'sitges'],
  },
];

type PreviewZone = (typeof coverageGroups)[number]['base'];

const profileHomeZones: Readonly<Record<string, PreviewZone>> = {
  valeria: 'madrid',
  lucia: 'madrid',
  alicia: 'madrid',
  sofia: 'barcelona',
  mia: 'barcelona',
  julia: 'barcelona',
};

const filterCityZones = {
  madrid: 'madrid',
  toledo: 'madrid',
  segovia: 'madrid',
  guadalajara: 'madrid',
  barcelona: 'barcelona',
  tarragona: 'barcelona',
  girona: 'barcelona',
} as const satisfies Readonly<Record<(typeof previewCities)[number], PreviewZone>>;

function getProfileCoverageZones(profile: SyntheticPreviewProfile): PreviewZone[] {
  const zones = new Set<PreviewZone>();
  for (const citySlug of profile.citySlugs) {
    const zone = filterCityZones[citySlug as keyof typeof filterCityZones];
    if (zone) {
      zones.add(zone);
    }
  }
  return [...zones];
}

const previewAvailabilities = [
  'available',
  'limited',
  'on-request',
  'unavailable',
] as const;

const trustSignals = [
  {
    code: '01',
    title: 'Discreción controlada',
    detail: 'Preview local sin canales externos ni indexación.',
  },
  {
    code: '02',
    title: 'Modelos sintéticas seleccionadas',
    detail: 'Seis identidades adultas ficticias, señalizadas como IA.',
  },
  {
    code: '03',
    title: 'Salidas y hoteles · propuesta',
    detail: 'Madrid, Barcelona y cobertura ilustrativa por confirmar.',
  },
  {
    code: '04',
    title: 'Atención desactivada',
    detail: 'No se envían mensajes, reservas ni pagos.',
  },
] as const;

const previewServices = [
  {
    number: '01',
    category: 'company',
    title: 'Acompañamiento premium',
    detail: 'Propuesta de contenido pendiente de validación comercial y legal.',
  },
  {
    number: '02',
    category: 'settings',
    title: 'Salidas a domicilios',
    detail: 'Categoría visual simulada; cobertura y condiciones no confirmadas.',
  },
  {
    number: '03',
    category: 'settings',
    title: 'Hoteles',
    detail: 'Categoría visual simulada; disponibilidad real aún no publicada.',
  },
  {
    number: '04',
    category: 'couples',
    title: 'Eventos y ocasiones especiales',
    detail: 'Concepto de servicio sujeto a definición y aprobación del cliente.',
  },
  {
    number: '05',
    category: 'wellbeing',
    title: 'Viajes y desplazamientos',
    detail: 'Alcance ilustrativo sin promesa operativa ni territorial.',
  },
  {
    number: '06',
    category: 'roleplay',
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
  const rawLocale = typeof raw.lang === 'string' ? raw.lang : undefined;
  const locale: Locale = isSyntheticServiceLocale(rawLocale) ? rawLocale : 'es';
  const cityPresentation = getSyntheticCityPresentation(locale);
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
  const hasFilters = city !== undefined || availability !== undefined;
  const profiles = validFilters
    ? hasFilters
      ? filterSyntheticPreviewProfiles({ city, availability })
      : getSyntheticPreviewProfiles()
    : [];
  const selectedZone = city
    ? filterCityZones[city as keyof typeof filterCityZones]
    : undefined;
  const profilesByZone: Record<PreviewZone, SyntheticPreviewProfile[]> = {
    madrid: [],
    barcelona: [],
  };
  for (const candidate of profiles) {
    const zones = selectedZone
      ? [selectedZone]
      : availability
        ? getProfileCoverageZones(candidate)
        : [profileHomeZones[candidate.slug]];
    for (const zone of zones) {
      if (zone) {
        profilesByZone[zone].push(candidate);
      }
    }
  }
  const heroMedia = getSyntheticHeroMedia('home-editorial');
  const zoneHref = (zone: PreviewZone) =>
    `/preview-local-sintetico?lang=${locale}&city=${zone}${
      availability ? `&availability=${availability}` : ''
    }#zona-${zone}`;

  return (
    <div className="public-page synthetic-preview-page">
      <SyntheticFiligree />
      <header className="public-header synthetic-preview-header" id="inicio">
        <a className="public-brand synthetic-preview-brand" href="#inicio">
          <Image
            alt=""
            aria-hidden="true"
            className="synthetic-preview-brand-mark"
            height={96}
            priority
            src="/icon.png"
            width={96}
          />
          <span className="synthetic-preview-brand-copy">
            <span>PecadosVip</span>
            <small>Discreción · Exclusividad · Placer</small>
          </span>
        </a>
        <nav className="public-nav synthetic-preview-nav" aria-label="Navegación del preview">
          <a href="#inicio" aria-current="page">Inicio</a>
          <a href={zoneHref('madrid')}>Madrid</a>
          <a href={zoneHref('barcelona')}>Barcelona</a>
          <a href="#perfiles">Modelos VIP</a>
          <a href="#servicios">Salidas</a>
          <a href="#seguridad">Nosotros</a>
          <a href="#seguridad">Contacto</a>
        </nav>
        <button
          className="synthetic-preview-reservation"
          type="button"
          disabled
          aria-label="Reserva desactivada en esta demostración local"
          title="La reserva no está disponible en esta demostración local"
        >
          Reserva privada
        </button>
        <a
          className="synthetic-preview-menu-link"
          href="#perfiles"
          aria-label="Ir a las zonas y perfiles"
        >
          Zonas
        </a>
        <strong className="synthetic-preview-local-status">
          <span className="visually-hidden">NO PUBLICAR · </span>Local
        </strong>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="synthetic-preview-hero" aria-labelledby="preview-title">
          <div className="synthetic-preview-hero-copy">
            <p className="public-eyebrow">Discreción · Exclusividad · Placer</p>
            <h1 id="preview-title">
              <span className="synthetic-preview-hero-title-primary">
                El lujo de elegir
              </span>{' '}
              <span className="synthetic-preview-hero-title-secondary">
                en tu casa o en hotel
              </span>
            </h1>
            <p className="synthetic-preview-hero-location">Madrid y Barcelona</p>
            <p className="synthetic-preview-hero-kicker">Nuestros servicios premium</p>
            <p className="synthetic-preview-hero-note">
              Concepto visual local; servicios y disponibilidad por confirmar.
            </p>
            <div className="public-actions">
              <a
                className="public-primary-action"
                href={zoneHref('madrid')}
              >
                Ver modelos Madrid
              </a>
              <a
                className="public-secondary-action"
                href={zoneHref('barcelona')}
              >
                Ver modelos Barcelona
              </a>
            </div>
          </div>
          <div className="synthetic-preview-hero-media">
            <PublicProfileMedia
              media={heroMedia}
              priority
              objectPosition="center center"
              preserveFullImage={false}
              sizes="94vw"
            />
            <span>Imagen generada con IA · identidad adulta ficticia</span>
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

        <section className="public-section synthetic-preview-city-experience" id="cobertura" aria-labelledby="coverage-title">
          <div className="public-section-heading synthetic-preview-section-heading synthetic-preview-city-experience-heading">
            <p className="public-eyebrow">Madrid · Barcelona</p>
            <h2 id="coverage-title">Dos zonas para elegir con claridad</h2>
            <p>{cityPresentation.coverageBody}</p>
            <p className="synthetic-city-disclosure">
              {getSyntheticCityMedia('madrid', locale).disclosure}
            </p>
          </div>

          <nav className="synthetic-preview-zone-switcher" aria-label="Elegir zona del preview">
            {coverageGroups.map((group) => (
              <a
                aria-current={selectedZone === group.base ? 'location' : undefined}
                href={zoneHref(group.base)}
                key={group.base}
              >
                <span>Zona {group.base === 'madrid' ? '01' : '02'}</span>
                <strong>{cityLabels[group.base]}</strong>
              </a>
            ))}
          </nav>

          <section
            className="synthetic-preview-catalog-zone-section"
            id="perfiles"
            aria-labelledby="preview-results-title"
          >
          <div className="synthetic-preview-catalog-intro">
            <div>
              <p className="public-eyebrow">Seis identidades adultas ficticias</p>
              <h2 id="preview-results-title">Modelos sintéticas por zona</h2>
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

          <details
            className="synthetic-preview-filter-panel"
            open={hasFilters || !validFilters}
          >
            <summary>
              <span>Filtrar modelos</span>
              <small>Ciudad y estado simulado</small>
            </summary>
            <form
              className="profile-filters synthetic-preview-filters"
              action="/preview-local-sintetico#perfiles"
              method="get"
            >
              <fieldset>
                <legend className="visually-hidden">Filtrar el catálogo sintético</legend>
                <input name="lang" type="hidden" value={locale} />
                <p className="profile-filter-help visually-hidden">
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
                  <a href={`/preview-local-sintetico?lang=${locale}#perfiles`}>Restablecer</a>
                </div>
              </fieldset>
            </form>
          </details>

          {!validFilters ? (
            <div className="public-empty-state public-empty-state-error" role="alert">
              <strong>Los filtros del preview no son válidos.</strong>
              <p>No se cargó ningún archivo. Restablece la maqueta para continuar.</p>
              <a href={`/preview-local-sintetico?lang=${locale}#perfiles`}>Restablecer filtros</a>
            </div>
          ) : null}

          <div className="synthetic-preview-city-zones">
            {coverageGroups.map((group, groupIndex) => {
              const zoneProfiles = profilesByZone[group.base];
              const zoneCityNames = group.cities.map((citySlug) => cityLabels[citySlug]);
              return (
                <article
                  className={`synthetic-preview-city-zone synthetic-preview-city-zone--${group.base}`}
                  id={`zona-${group.base}`}
                  key={group.base}
                  aria-labelledby={`zone-title-${group.base}`}
                >
                  <header className="synthetic-preview-city-zone-header">
                    <div>
                      <p className="public-eyebrow">Zona {String(groupIndex + 1).padStart(2, '0')}</p>
                      <h3 id={`zone-title-${group.base}`}>{cityLabels[group.base]}</h3>
                      <p>{zoneCityNames.join(' · ')}</p>
                    </div>
                    <a href={zoneHref(group.base)}>
                      Ver solo {cityLabels[group.base]}
                    </a>
                  </header>

                  <section className="synthetic-preview-zone-coverage" aria-labelledby={`zone-destinations-${group.base}`}>
                    <h4 id={`zone-destinations-${group.base}`}>Destinos de la zona</h4>
                    <ul>
                      {group.cities.map((citySlug) => {
                        const cityMedia = getSyntheticCityMedia(citySlug, locale);
                        return (
                          <li id={`city-${citySlug}`} key={citySlug}>
                            <figure className="synthetic-preview-city-media">
                              <PublicProfileMedia
                                media={cityMedia}
                                objectPosition={cityMedia.objectPosition}
                                preserveFullImage={false}
                                sizes="(max-width: 780px) 22vw, 11vw"
                              />
                              <figcaption>{cityMedia.shortDisclosure}</figcaption>
                            </figure>
                            <div className="synthetic-preview-city-copy">
                              <strong>{cityLabels[citySlug]}</strong>
                              <span>{cityPresentation.pendingStatus}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </section>

                  <section className="synthetic-preview-zone-profiles" aria-labelledby={`zone-profiles-${group.base}`}>
                    <div className="synthetic-preview-zone-profiles-heading">
                      <div>
                        <span>Selección ficticia</span>
                        <h4 id={`zone-profiles-${group.base}`}>Modelos {cityLabels[group.base]}</h4>
                      </div>
                      <strong>{zoneProfiles.length.toString().padStart(2, '0')}</strong>
                    </div>
                    {zoneProfiles.length > 0 ? (
                      <div className="profile-grid synthetic-profile-grid synthetic-preview-zone-profile-grid">
                        {zoneProfiles.map((candidate) => (
                          <ProfileCard
                            disclosure={candidate.syntheticNotice}
                            headingLevel={5}
                            key={candidate.slug}
                            preserveFullImage={false}
                            profile={candidate}
                            profileHref={`/preview-local-sintetico/perfiles/${candidate.slug}?lang=${locale}`}
                            variant="featured-compact"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="synthetic-preview-zone-empty" role="status">
                        <strong>Sin perfiles para esta selección.</strong>
                        <a href={zoneHref(group.base)}>
                          Explorar {cityLabels[group.base]}
                        </a>
                      </div>
                    )}
                  </section>
                </article>
              );
            })}
          </div>
          </section>
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
                <a href={`/preview-local-sintetico/servicios?lang=${locale}&category=${service.category}#service-catalog`}>
                  <span aria-hidden="true">{service.number}</span>
                  <h3>{service.title}</h3>
                  <p>{service.detail}</p>
                  <strong>Explorar rutas <span aria-hidden="true">→</span></strong>
                </a>
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

      <nav
        className="public-mobile-nav synthetic-preview-mobile-nav"
        id="mobile-navigation"
        aria-label="Navegación móvil del preview"
      >
        <a href="#inicio" aria-current="page">Inicio</a>
        <a href="#cobertura">Ciudades</a>
        <a href="#perfiles">Perfiles</a>
        <a href={`/preview-local-sintetico/servicios?lang=${locale}`}>Servicios</a>
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
          <a href={`/preview-local-sintetico/servicios?lang=${locale}`}>Servicios</a>
          <a href="#main-content">Volver arriba</a>
        </nav>
        <span>Revisión humana, comercial y legal pendiente</span>
      </footer>
    </div>
  );
}
