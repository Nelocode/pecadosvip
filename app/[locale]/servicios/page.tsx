import { getPublicServices } from '../../../lib/content/public-services';
import { getRuntimeVisibilityState } from '../../../lib/content/runtime-publication';
import { getRuntimeContentSnapshot } from '../../../lib/content/runtime-snapshot';
import { getCatalog } from '../../../lib/i18n/catalog';
import { SOURCE_LOCALE } from '../../../lib/i18n/locales';
import { buildLocalizedPublicMetadata } from '../../../lib/seo';
import PublicServiceHub from '../../components/PublicServiceHub';
import ReleaseHoldingPage from '../../components/ReleaseHoldingPage';
import { localeOrNotFound, type LocaleRouteParams } from '../../locale-routing';

type Props = { params: LocaleRouteParams };

export async function generateMetadata({ params }: Props) {
  const locale = localeOrNotFound((await params).locale);
  const meta = getCatalog(locale).meta.services;
  return buildLocalizedPublicMetadata({
    locale,
    semanticPath: '/servicios',
    title: meta.title,
    description: meta.description,
    forceNoIndex: locale !== SOURCE_LOCALE,
    languageAlternates: false,
  });
}

export default async function ServicesPage({ params }: Props) {
  const locale = localeOrNotFound((await params).locale);
  if (
    !getRuntimeVisibilityState().renderPublicExperience ||
    locale !== SOURCE_LOCALE
  ) {
    return <ReleaseHoldingPage locale={locale} semanticPath="/servicios" />;
  }

  const snapshot = getRuntimeContentSnapshot();
  const services = getPublicServices(snapshot);
  return <PublicServiceHub locale={locale} services={services} />;
}
