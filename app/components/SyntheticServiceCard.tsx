import type { Locale } from '../../lib/i18n/locales';
import {
  getSyntheticServiceMessages,
  type SyntheticServiceCard as SyntheticServiceCardData,
} from '../../lib/preview/synthetic-services';
import { getSyntheticPreviewProfile } from '../../lib/preview/synthetic-preview';
import PublicProfileMedia from './PublicProfileMedia';

export default function SyntheticServiceCard({
  service,
  locale,
  action,
}: {
  service: SyntheticServiceCardData;
  locale: Locale;
  action: string;
}) {
  const profile = getSyntheticPreviewProfile(service.profileSlug);
  const media = profile?.media.find((candidate) => candidate.role === service.mediaRole);
  if (!profile || !media) return null;
  const messages = getSyntheticServiceMessages(locale);

  return (
    <article className="synthetic-service-card">
      <a href={`/preview-local-sintetico/servicios/${service.slug}?lang=${locale}`}>
        <div className="synthetic-service-card-media">
          <PublicProfileMedia
            media={{ ...media, alt: '' }}
            preserveFullImage={false}
            sizes="(max-width: 780px) 50vw, (max-width: 1180px) 33vw, 25vw"
          />
          <span>{messages.media.aiShort}</span>
        </div>
        <div className="synthetic-service-card-copy">
          <span>{service.groupLabel}</span>
          <h3>{service.name}</h3>
          <p>{service.teaser}</p>
          <strong>{action} <span aria-hidden="true">→</span></strong>
        </div>
      </a>
    </article>
  );
}
