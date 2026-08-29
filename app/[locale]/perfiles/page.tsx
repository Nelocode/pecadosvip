import { parsePublicProfileSearchParams } from '../../../lib/content/public-query-params';
import { queryPublicProfiles } from '../../../lib/content/public-profiles';
import { getRuntimeContentSnapshot } from '../../../lib/content/runtime-snapshot';
import { getRuntimeVisibilityState } from '../../../lib/content/runtime-publication';
import {
  formatPluralMessage,
  getCatalog,
  interpolate,
} from '../../../lib/i18n/catalog';
import { localizedPath, SOURCE_LOCALE } from '../../../lib/i18n/locales';
import { buildLocalizedPublicMetadata } from '../../../lib/seo';
import ProfileCard from '../../components/ProfileCard';
import ProvisionalNotice from '../../components/ProvisionalNotice';
import PublicFooter from '../../components/PublicFooter';
import PublicHeader from '../../components/PublicHeader';
import ReleaseHoldingPage from '../../components/ReleaseHoldingPage';
import { localeOrNotFound, type LocaleRouteParams } from '../../locale-routing';

type RawSearchParams = Record<string, string | string[] | undefined>;
type Props = {
  params: LocaleRouteParams;
  searchParams: Promise<RawSearchParams>;
};

function toUrlSearchParams(raw: RawSearchParams): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (value !== undefined) {
      params.append(key, value);
    }
  }
  return params;
}

export async function generateMetadata({ params, searchParams }: Props) {
  const locale = localeOrNotFound((await params).locale);
  const raw = await searchParams;
  const meta = getCatalog(locale).meta.profiles;
  return buildLocalizedPublicMetadata({
    locale,
    semanticPath: '/perfiles',
    title: meta.title,
    description: meta.description,
    forceNoIndex: Object.keys(raw).length > 0,
    languageAlternates: false,
  });
}

export default async function ProfilesPage({ params, searchParams }: Props) {
  const locale = localeOrNotFound((await params).locale);
  const messages = getCatalog(locale).profiles;
  if (!getRuntimeVisibilityState().renderPublicExperience) {
    return <ReleaseHoldingPage locale={locale} semanticPath="/perfiles" />;
  }

  const parsed = parsePublicProfileSearchParams(
    toUrlSearchParams(await searchParams),
  );
  const result = parsed.ok && locale === SOURCE_LOCALE
    ? queryPublicProfiles(getRuntimeContentSnapshot(), parsed.query)
    : undefined;
  const query = parsed.ok ? parsed.query : {};
  const hasActiveFilters = Object.keys(query).length > 0;
  const profilesPath = localizedPath(locale, '/perfiles');

  return (
    <div className="public-page">
      <PublicHeader currentPath="/perfiles" locale={locale} />
      <main id="main-content" tabIndex={-1}>
        <ProvisionalNotice locale={locale} />

        <section className="catalog-hero" aria-labelledby="catalog-title">
          <p className="public-eyebrow">{messages.eyebrow}</p>
          <h1 id="catalog-title">{messages.title}</h1>
          <p>{messages.intro}</p>
        </section>

        <form className="profile-filters" action={profilesPath} method="get">
          <fieldset>
            <legend>{messages.filters.legend}</legend>
            <p className="profile-filter-help" id="profile-filter-help">
              {interpolate(messages.filters.ageHelp, { minAge: 18, maxAge: 99 })}
            </p>
            <label htmlFor="profile-city">
              {messages.filters.city}
              <select id="profile-city" name="city" defaultValue={query.city ?? ''}>
                <option value="">{messages.filters.allCities}</option>
                <option value="madrid">Madrid</option>
                <option value="barcelona">Barcelona</option>
              </select>
            </label>
            <label htmlFor="profile-availability">
              {messages.filters.availability}
              <select
                id="profile-availability"
                name="availability"
                defaultValue={query.availability ?? ''}
              >
                <option value="">{messages.filters.allAvailability}</option>
                <option value="available">{messages.availability.available}</option>
                <option value="limited">{messages.availability.limited}</option>
                <option value="on-request">{messages.availability.onRequest}</option>
                <option value="unavailable">{messages.availability.unavailable}</option>
              </select>
            </label>
            <label htmlFor="profile-min-age">
              {messages.filters.minimumAge}
              <input
                id="profile-min-age"
                name="minAge"
                type="number"
                inputMode="numeric"
                min="18"
                max="99"
                aria-describedby="profile-filter-help"
                defaultValue={query.minAge}
              />
            </label>
            <label htmlFor="profile-max-age">
              {messages.filters.maximumAge}
              <input
                id="profile-max-age"
                name="maxAge"
                type="number"
                inputMode="numeric"
                min="18"
                max="99"
                aria-describedby="profile-filter-help"
                defaultValue={query.maxAge}
              />
            </label>
            <button type="submit">{messages.filters.apply}</button>
          </fieldset>
        </form>

        <section className="catalog-results" aria-labelledby="results-title">
          <div className="catalog-results-heading">
            <h2 id="results-title">{messages.results.title}</h2>
            {result?.ok ? (
              <span role="status">
                {formatPluralMessage(messages.results.count, 'count', result.total, locale)}
              </span>
            ) : null}
          </div>

          {!parsed.ok ? (
            <div className="public-empty-state public-empty-state-error" role="alert">
              <strong>{messages.results.invalidTitle}</strong>
              <p>{messages.results.invalidBody}</p>
              <a href={profilesPath}>{messages.results.reset}</a>
            </div>
          ) : result?.ok && result.items.length > 0 ? (
            <div className="profile-grid">
              {result.items.map((profile) => (
                <ProfileCard profile={profile} locale={locale} key={profile.slug} />
              ))}
            </div>
          ) : hasActiveFilters ? (
            <div className="public-empty-state" role="status">
              <strong>{messages.results.filteredEmptyTitle}</strong>
              <p>{messages.results.filteredEmptyBody}</p>
              <a href={profilesPath}>{messages.results.reset}</a>
            </div>
          ) : (
            <div className="public-empty-state" role="status">
              <strong>{messages.results.unpublishedTitle}</strong>
              <p>{messages.results.unpublishedBody}</p>
            </div>
          )}
        </section>
      </main>
      <PublicFooter locale={locale} />
    </div>
  );
}
