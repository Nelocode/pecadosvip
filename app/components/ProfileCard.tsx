import type { PublicProfileCard } from '../../lib/content/public-profiles';
import { getCatalog, interpolate } from '../../lib/i18n/catalog';
import { localizedPath, type Locale } from '../../lib/i18n/locales';
import PublicProfileMedia from './PublicProfileMedia';

export default function ProfileCard({
  profile,
  profileHref,
  locale,
  disclosure,
  preserveFullImage = true,
}: {
  profile: PublicProfileCard;
  profileHref?: string | null;
  locale?: Locale;
  disclosure?: string;
  preserveFullImage?: boolean;
}) {
  const effectiveLocale = locale ?? 'es';
  const messages = getCatalog(effectiveLocale).profiles;
  const availabilityLabels: Record<PublicProfileCard['availability'], string> = {
    available: messages.availability.available,
    limited: messages.availability.limited,
    unavailable: messages.availability.unavailable,
    'on-request': messages.availability.onRequest,
  };
  const headingId = `profile-${profile.slug}-title`;
  const href =
    profileHref === undefined
      ? locale
        ? localizedPath(locale, `/perfiles/${profile.slug}`)
        : `/perfiles/${profile.slug}`
      : profileHref;

  return (
    <article className="profile-card" aria-labelledby={headingId}>
      <div className="profile-card-media">
        <PublicProfileMedia
          media={profile.cover}
          sizes="(max-width: 720px) 88vw, (max-width: 1100px) 44vw, 280px"
          preserveFullImage={preserveFullImage}
        />
      </div>
      <div className="profile-card-copy">
        {disclosure ? (
          <p className="profile-card-disclosure">{disclosure}</p>
        ) : null}
        <h2 id={headingId}>{profile.displayName}</h2>
        <p>
          {profile.citySlugs.join(' · ')} ·{' '}
          {interpolate(messages.card.ageYears, { age: profile.age })}
        </p>
        <span data-availability={profile.availability}>
          <span className="visually-hidden">{messages.card.statusPrefix} </span>
          {availabilityLabels[profile.availability]}
        </span>
        {href ? (
          <a
            href={href}
            aria-label={interpolate(messages.card.viewProfileAria, {
              name: profile.displayName,
            })}
          >
            {messages.card.viewProfile}
          </a>
        ) : (
          <span aria-label={interpolate(messages.card.syntheticViewAria, {
            name: profile.displayName,
          })}>
            {messages.card.syntheticView}
          </span>
        )}
      </div>
    </article>
  );
}
