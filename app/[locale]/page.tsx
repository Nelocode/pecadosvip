import { queryPublicProfiles } from '../../lib/content/public-profiles';
import { getRuntimeContentSnapshot } from '../../lib/content/runtime-snapshot';
import { getRuntimeVisibilityState } from '../../lib/content/runtime-publication';
import { getCatalog } from '../../lib/i18n/catalog';
import { localizedPath, SOURCE_LOCALE } from '../../lib/i18n/locales';
import { buildLocalizedPublicMetadata } from '../../lib/seo';
import ProfileCard from '../components/ProfileCard';
import ProvisionalNotice from '../components/ProvisionalNotice';
import PublicFooter from '../components/PublicFooter';
import PublicHeader from '../components/PublicHeader';
import ReleaseHoldingPage from '../components/ReleaseHoldingPage';
import { localeOrNotFound, type LocaleRouteParams } from '../locale-routing';

type LocalePageProps = { params: LocaleRouteParams };

export async function generateMetadata({ params }: LocalePageProps) {
  const locale = localeOrNotFound((await params).locale);
  const messages = getCatalog(locale).meta.home;
  return buildLocalizedPublicMetadata({
    locale,
    semanticPath: '/',
    title: messages.title,
    description: messages.description,
  });
}

export default async function LocalizedHome({ params }: LocalePageProps) {
  const locale = localeOrNotFound((await params).locale);
  const messages = getCatalog(locale).home;
  if (!getRuntimeVisibilityState().renderPublicExperience) {
    return <ReleaseHoldingPage locale={locale} semanticPath="/" />;
  }

  const profiles = locale === SOURCE_LOCALE
    ? queryPublicProfiles(getRuntimeContentSnapshot(), {
        page: 1,
        pageSize: 4,
      })
    : undefined;
  const href = (path: `/${string}` | '/') => localizedPath(locale, path);

  return (
    <div className="public-page">
      <PublicHeader currentPath="/" locale={locale} />
      <main id="main-content" tabIndex={-1}>
        <ProvisionalNotice locale={locale} />

        <section className="public-hero" aria-labelledby="home-title">
          <div className="public-hero-copy">
            <p className="public-eyebrow">{messages.hero.eyebrow}</p>
            <h1 id="home-title">
              {messages.hero.title}
              <span>{messages.hero.titleAccent}</span>
            </h1>
            <p>{messages.hero.body}</p>
            <div className="public-actions">
              <a className="public-primary-action" href={href('/perfiles')}>
                {messages.hero.profilesCta}
              </a>
              <a className="public-secondary-action" href={href('/contacto')}>
                {messages.hero.contactCta}
              </a>
            </div>
          </div>
          <div className="public-hero-art" aria-hidden="true">
            <span className="public-apple public-apple-large"><span /></span>
            <p>{messages.hero.artLabel}</p>
          </div>
        </section>

        <section className="public-trust-strip" aria-label={messages.trust.ariaLabel}>
          {messages.trust.items.map((item) => (
            <article key={item.code}><span>{item.code}</span><strong>{item.text}</strong></article>
          ))}
        </section>

        <section className="public-section" aria-labelledby="cities-title">
          <div className="public-section-heading">
            <p className="public-eyebrow">{messages.cities.eyebrow}</p>
            <h2 id="cities-title">{messages.cities.title}</h2>
            <p>{messages.cities.body}</p>
          </div>
          <div className="public-city-grid">
            <a href={href('/madrid')}>
              <span>{messages.cities.madridCode}</span>
              <strong>Madrid</strong>
              <small>{messages.cities.cardCta}</small>
            </a>
            <a href={href('/barcelona')}>
              <span>{messages.cities.barcelonaCode}</span>
              <strong>Barcelona</strong>
              <small>{messages.cities.cardCta}</small>
            </a>
          </div>
        </section>

        <section className="public-section public-profile-section" aria-labelledby="profiles-title">
          <div className="public-section-heading public-section-heading-inline">
            <div>
              <p className="public-eyebrow">{messages.profiles.eyebrow}</p>
              <h2 id="profiles-title">{messages.profiles.title}</h2>
            </div>
            <a href={href('/perfiles')}>{messages.profiles.openCatalog}</a>
          </div>
          {profiles?.ok && profiles.items.length > 0 ? (
            <div className="profile-grid">
              {profiles.items.map((profile) => (
                <ProfileCard profile={profile} locale={locale} key={profile.slug} />
              ))}
            </div>
          ) : (
            <div className="public-empty-state" role="status">
              <strong>{messages.profiles.emptyTitle}</strong>
              <p>{messages.profiles.emptyBody}</p>
            </div>
          )}
        </section>

        <section className="public-final-cta" aria-labelledby="contact-title">
          <p className="public-eyebrow">{messages.finalContact.eyebrow}</p>
          <h2 id="contact-title">{messages.finalContact.title}</h2>
          <a href={href('/contacto')}>{messages.finalContact.cta}</a>
        </section>
      </main>
      <PublicFooter locale={locale} />
    </div>
  );
}
