import { getCatalog } from '@/lib/i18n/catalog';
import { localizedPath } from '@/lib/i18n/locales';
import { buildLocalizedPublicMetadata } from '@/lib/seo';
import PublicHeader from '@/app/components/PublicHeader';
import PublicFooter from '@/app/components/PublicFooter';
import ProfileCard from '@/app/components/ProfileCard';
import { getSyntheticPreviewProfiles } from '@/lib/preview/synthetic-preview';
import { localeOrNotFound, type LocaleRouteParams } from '@/app/locale-routing';

type LocalePageProps = { params: LocaleRouteParams };

export async function generateMetadata({ params }: LocalePageProps) {
  const locale = localeOrNotFound((await params).locale);
  const messages = getCatalog(locale).meta.home;
  return buildLocalizedPublicMetadata({
    locale,
    semanticPath: '/perfiles',
    title: `Catálogo de Perfiles VIP | PecadosVIP`,
    description: messages.description,
  });
}

export default async function LocalizedPerfilesPage({ params }: LocalePageProps) {
  const locale = localeOrNotFound((await params).locale);
  const href = (path: `/${string}` | '/') => localizedPath(locale, path);
  const profiles = getSyntheticPreviewProfiles();

  return (
    <div className="public-page synthetic-preview-page">
      <PublicHeader currentPath="/perfiles" locale={locale} />

      <main id="main-content" tabIndex={-1} className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        <div className="synthetic-preview-section-heading">
          <p className="public-eyebrow">Exclusividad · Galería Verificada</p>
          <h1 className="text-3xl font-extrabold text-amber-400">Catálogo de Perfiles VIP</h1>
          <p className="text-sm text-zinc-400 mt-2">
            Perfiles seleccionados disponibles para atención privada en hoteles de lujo y domicilios.
          </p>
        </div>

        <div className="profile-grid synthetic-profile-grid">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.slug}
              profile={profile}
              locale={locale}
              preserveFullImage
              profileHref={href(`/perfiles/${profile.slug}` as any)}
            />
          ))}
        </div>
      </main>

      <PublicFooter locale={locale} />
    </div>
  );
}
