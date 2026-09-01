import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import {
  getSyntheticPreviewProfile,
  isSyntheticPreviewRequestAllowed,
  syntheticPreviewAssetRoles,
  type SyntheticPreviewAssetRole,
} from '../../../../../lib/preview/synthetic-preview';
import type { Locale } from '../../../../../lib/i18n/locales';
import { isSyntheticServiceLocale } from '../../../../../lib/preview/synthetic-services';
import PublicProfileMedia from '../../../../components/PublicProfileMedia';
import SyntheticFiligree from '../../../../components/SyntheticFiligree';

export const metadata: Metadata = {
  title: 'Ficha sintética · Previsualización local',
  description: 'Ficha local de una identidad adulta ficticia generada con IA.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const dynamic = 'force-dynamic';

type SyntheticProfilePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const availabilityLabels = {
  available: 'Disponible · simulación',
  limited: 'Disponibilidad limitada · simulación',
  unavailable: 'No disponible · simulación',
  'on-request': 'Bajo consulta · simulación',
} as const;

function selectedRole(
  raw: string | string[] | undefined,
): SyntheticPreviewAssetRole {
  return typeof raw === 'string' &&
    syntheticPreviewAssetRoles.includes(raw as SyntheticPreviewAssetRole)
    ? (raw as SyntheticPreviewAssetRole)
    : 'cover';
}

export default async function SyntheticProfilePage({
  params,
  searchParams,
}: SyntheticProfilePageProps) {
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

  const { slug } = await params;
  const profile = getSyntheticPreviewProfile(slug);
  if (!profile) notFound();

  const query = await searchParams;
  const rawLocale = typeof query.lang === 'string' ? query.lang : undefined;
  const locale: Locale = isSyntheticServiceLocale(rawLocale) ? rawLocale : 'es';
  const activeRole = selectedRole(query.foto);
  const activeMedia =
    profile.media.find((candidate) => candidate.role === activeRole) ??
    profile.cover;

  return (
    <div className="public-page synthetic-preview-page synthetic-profile-page">
      <SyntheticFiligree />
      <header className="public-header synthetic-preview-header">
        <a className="public-brand" href={`/preview-local-sintetico?lang=${locale}#inicio`}>
          PecadosVip
        </a>
        <strong>PREVIEW LOCAL · NO PUBLICAR</strong>
      </header>
      <main id="main-content" tabIndex={-1}>
        <nav className="synthetic-profile-breadcrumb" aria-label="Migas de pan">
          <a href={`/preview-local-sintetico?lang=${locale}#perfiles`}>Perfiles sintéticos</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{profile.displayName}</span>
        </nav>

        <article className="profile-detail synthetic-profile-detail" aria-labelledby="profile-detail-title">
          <section
            className="profile-detail-media synthetic-profile-media"
            aria-label={`Galería sintética de ${profile.displayName}`}
          >
            <div className="profile-detail-image synthetic-profile-active-image">
              <PublicProfileMedia
                media={activeMedia}
                priority
                sizes="(max-width: 780px) 90vw, 52vw"
              />
              <span>IMAGEN GENERADA CON IA</span>
            </div>
            <nav className="synthetic-profile-thumbnails" aria-label="Seleccionar fotografía">
              {profile.media.map((candidate) => (
                <a
                  aria-current={candidate.role === activeRole ? 'true' : undefined}
                  aria-label={`Mostrar ${candidate.label.toLowerCase()} de ${profile.displayName}`}
                  href={`/preview-local-sintetico/perfiles/${profile.slug}?lang=${locale}&foto=${candidate.role}`}
                  key={candidate.role}
                >
                  <PublicProfileMedia
                    media={{ ...candidate, alt: '' }}
                    sizes="(max-width: 780px) 22vw, 120px"
                    preserveFullImage={false}
                  />
                  <span>{candidate.role === 'cover' ? 'Portada' : candidate.role.slice(-2)}</span>
                </a>
              ))}
            </nav>
          </section>

          <div className="profile-detail-copy synthetic-profile-copy">
            <p className="public-eyebrow">{profile.syntheticNotice}</p>
            <h1 id="profile-detail-title">{profile.displayName}</h1>
            <p className="synthetic-profile-summary">
              {profile.age} años · {profile.citySlugs.join(' · ')}
            </p>
            <p>{profile.biography}</p>

            <dl>
              <div>
                <dt>Identidad</dt>
                <dd>Completamente ficticia</dd>
              </div>
              <div>
                <dt>Estado visual</dt>
                <dd>{availabilityLabels[profile.availability]}</dd>
              </div>
              <div>
                <dt>Origen visual</dt>
                <dd>Generación sintética con IA</dd>
              </div>
              <div>
                <dt>Publicación</dt>
                <dd>No autorizada</dd>
              </div>
            </dl>

            <section className="synthetic-profile-concept" aria-labelledby="profile-concept-title">
              <h2 id="profile-concept-title">Concepto de la maqueta</h2>
              <ul>
                {profile.conceptTags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </section>

            <div className="synthetic-profile-disabled-contact" role="note">
              <strong>Contacto y reserva desactivados</strong>
              <p>
                Esta ficha solo demuestra navegación y presentación. No envía
                datos ni abre canales externos.
              </p>
              <button type="button" disabled>
                Contactar · no disponible en preview
              </button>
            </div>
            <a className="synthetic-profile-back" href={`/preview-local-sintetico?lang=${locale}#perfiles`}>
              ← Volver a todos los perfiles
            </a>
          </div>
        </article>
      </main>
      <footer className="public-footer synthetic-preview-footer">
        <p>Harness local no indexable · sin canales externos</p>
        <a href={`/preview-local-sintetico?lang=${locale}#perfiles`}>Ver catálogo</a>
        <span>Revisión humana y legal pendiente</span>
      </footer>
    </div>
  );
}
