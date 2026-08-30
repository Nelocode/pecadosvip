import { notFound } from 'next/navigation';

import {
  getPublicProfilesForService,
  getPublicService,
} from '../../../../lib/content/public-services';
import { hasServiceCandidateRoute } from '../../../../lib/content/route-manifest';
import { getRuntimeVisibilityState } from '../../../../lib/content/runtime-publication';
import { getRuntimeContentSnapshot } from '../../../../lib/content/runtime-snapshot';
import { getCatalog } from '../../../../lib/i18n/catalog';
import { SOURCE_LOCALE } from '../../../../lib/i18n/locales';
import { buildLocalizedPublicMetadata } from '../../../../lib/seo';
import PublicServiceDetail from '../../../components/PublicServiceDetail';
import ReleaseHoldingPage from '../../../components/ReleaseHoldingPage';
import { localeOrNotFound } from '../../../locale-routing';

type Props = { params: Promise<{ locale: string; slug: string }> };
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function generateMetadata({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = localeOrNotFound(rawLocale);
  if (!slugPattern.test(slug)) notFound();
  const snapshot = getRuntimeContentSnapshot();
  if (!hasServiceCandidateRoute(snapshot, slug)) notFound();
  const meta = getCatalog(locale).meta.service;
  const service = locale === SOURCE_LOCALE
    ? getPublicService(snapshot, slug)
    : undefined;

  return buildLocalizedPublicMetadata({
    locale,
    semanticPath: `/servicios/${slug}`,
    title: service?.name ?? meta.unavailableTitle,
    description: service?.description ?? meta.unavailableDescription,
    forceNoIndex: !service,
    languageAlternates: false,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = localeOrNotFound(rawLocale);
  if (!slugPattern.test(slug)) notFound();
  const snapshot = getRuntimeContentSnapshot();
  if (!hasServiceCandidateRoute(snapshot, slug)) notFound();
  if (
    !getRuntimeVisibilityState().renderPublicExperience ||
    locale !== SOURCE_LOCALE
  ) {
    return (
      <ReleaseHoldingPage locale={locale} semanticPath={`/servicios/${slug}`} />
    );
  }

  const service = getPublicService(snapshot, slug);
  if (!service) notFound();
  const profiles = getPublicProfilesForService(snapshot, service.slug);
  if (!profiles) notFound();

  return (
    <PublicServiceDetail
      locale={locale}
      profiles={profiles}
      service={service}
    />
  );
}
