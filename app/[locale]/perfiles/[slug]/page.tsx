import { notFound } from 'next/navigation';

import { getPublicProfileDetail } from '../../../../lib/content/public-profiles';
import { hasProfileCandidateRoute } from '../../../../lib/content/route-manifest';
import { getRuntimeContentSnapshot } from '../../../../lib/content/runtime-snapshot';
import { getRuntimeVisibilityState } from '../../../../lib/content/runtime-publication';
import { getCatalog, interpolate } from '../../../../lib/i18n/catalog';
import { formatDecimal } from '../../../../lib/i18n/format';
import { localizedPath, SOURCE_LOCALE } from '../../../../lib/i18n/locales';
import { buildLocalizedPublicMetadata } from '../../../../lib/seo';
import ContactOptions from '../../../components/ContactOptions';
import ProvisionalNotice from '../../../components/ProvisionalNotice';
import PublicFooter from '../../../components/PublicFooter';
import PublicHeader from '../../../components/PublicHeader';
import PublicProfileMedia from '../../../components/PublicProfileMedia';
import ReleaseHoldingPage from '../../../components/ReleaseHoldingPage';
import { localeOrNotFound } from '../../../locale-routing';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const profileSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function generateMetadata({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = localeOrNotFound(rawLocale);
  if (!profileSlugPattern.test(slug)) notFound();
  const snapshot = getRuntimeContentSnapshot();
  if (!hasProfileCandidateRoute(snapshot, slug)) notFound();
  const messages = getCatalog(locale).meta.profile;
  const profile = locale === SOURCE_LOCALE
    ? getPublicProfileDetail(snapshot, slug)
    : undefined;

  if (!profile) {
    return buildLocalizedPublicMetadata({
      locale,
      semanticPath: `/perfiles/${slug}`,
      title: messages.unavailableTitle,
      description: messages.unavailableDescription,
      forceNoIndex: true,
    });
  }

  return buildLocalizedPublicMetadata({
    locale,
    semanticPath: `/perfiles/${profile.slug}`,
    title: profile.displayName,
    description: profile.biography,
    imageAlt: profile.cover.alt,
    languageAlternates: false,
  });
}

export default async function ProfileDetailPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = localeOrNotFound(rawLocale);
  if (!profileSlugPattern.test(slug)) notFound();
  const snapshot = getRuntimeContentSnapshot();
  if (!hasProfileCandidateRoute(snapshot, slug)) notFound();
  if (!getRuntimeVisibilityState().renderPublicExperience || locale !== SOURCE_LOCALE) {
    return (
      <ReleaseHoldingPage
        locale={locale}
        semanticPath={`/perfiles/${slug}`}
      />
    );
  }

  const profile = getPublicProfileDetail(snapshot, slug);
  if (!profile) notFound();
  const messages = getCatalog(locale).profile;
  const measurements = Object.entries(profile.measurements).filter(
    ([, value]) => value !== undefined,
  );
  const measurementPresentation: Record<string, { label: string; unit: string }> = {
    heightCm: { label: messages.measurements.heightCm, unit: messages.units.centimeters },
    weightKg: { label: messages.measurements.weightKg, unit: messages.units.kilograms },
    bustCm: { label: messages.measurements.bustCm, unit: messages.units.centimeters },
    waistCm: { label: messages.measurements.waistCm, unit: messages.units.centimeters },
    hipsCm: { label: messages.measurements.hipsCm, unit: messages.units.centimeters },
  };

  return (
    <div className="public-page">
      <PublicHeader currentPath={`/perfiles/${profile.slug}`} locale={locale} />
      <main id="main-content" tabIndex={-1}>
        <ProvisionalNotice locale={locale} />
        <article className="profile-detail" aria-labelledby="profile-detail-title">
          <section
            className="profile-detail-media"
            aria-label={interpolate(messages.galleryAria, { name: profile.displayName })}
          >
            {profile.media.map((media) => (
              <div className="profile-detail-image" key={`${media.desktopUrl}-${media.order}`}>
                <PublicProfileMedia
                  media={media}
                  priority={media.order === 0}
                  sizes="(max-width: 820px) 92vw, 48vw"
                />
              </div>
            ))}
          </section>
          <div className="profile-detail-copy">
            <p className="public-eyebrow">{messages.publishedEyebrow}</p>
            <h1 id="profile-detail-title">{profile.displayName}</h1>
            <p>
              {interpolate(messages.ageYears, { age: profile.age })} ·{' '}
              {profile.citySlugs.join(' · ')}
            </p>
            <p>{profile.biography}</p>
            {measurements.length > 0 ? (
              <dl>
                {measurements.map(([label, value]) => (
                  <div key={label}>
                    <dt>{measurementPresentation[label]?.label ?? label}</dt>
                    <dd>
                      {formatDecimal(Number(value), locale)}{' '}
                      {measurementPresentation[label]?.unit}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <h2>{messages.servicesTitle}</h2>
            <ul>
              {profile.services.map((service) => (
                <li key={service.slug}>
                  <a href={localizedPath(locale, `/servicios/${service.slug}`)}>
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
            <ContactOptions locale={locale} />
          </div>
        </article>
      </main>
      <PublicFooter locale={locale} />
    </div>
  );
}
