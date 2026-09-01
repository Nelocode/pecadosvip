import { cities } from '../../app/city-data.ts';
import { contactConfig } from '../contact-config.ts';
import type {
  ApprovalRecord,
  CityPage,
  CitySlug,
  ContentSnapshot,
  LegalDocument,
} from './types.ts';
import { resolveRuntimeContentFromEnvironment } from './runtime-content-source.ts';
import type {
  RuntimeContentActivationState,
  RuntimeContentResolution,
} from './runtime-content-activation.ts';

const runtimeTimestamp = '2026-08-27T00:00:00-05:00';

const pendingApproval: ApprovalRecord = { state: 'pending' };

const barcelonaClusterSlugs: ReadonlySet<CitySlug> = new Set([
  'barcelona',
  'girona',
  'tarragona',
]);

function operationalClusterFor(slug: CitySlug): 'madrid' | 'barcelona' {
  return barcelonaClusterSlugs.has(slug) ? 'barcelona' : 'madrid';
}

function nearbyCitySlugsFor(slug: CitySlug): CitySlug[] {
  if (slug === 'madrid') return ['toledo', 'guadalajara', 'segovia'];
  if (slug === 'barcelona') return ['girona', 'tarragona'];
  return [operationalClusterFor(slug)];
}

function emptyLegalDocument(title: string): LegalDocument {
  return {
    title,
    body: '',
    approval: pendingApproval,
    updatedAt: runtimeTimestamp,
  };
}

const draftCities: CityPage[] = Object.values(cities).map(
  (city): CityPage => ({
    id: `city-${city.slug}`,
    slug: city.slug,
    name: city.city,
    cluster: operationalClusterFor(city.slug),
    status: 'draft',
    serviceConfirmed: false,
    approval: pendingApproval,
    headline: `${city.headline} ${city.headlineAccent}`,
    introduction: city.introBody.join('\n\n'),
    differentiators: [
      'Desplazamiento a hoteles y domicilios',
      'Cobertura bajo confirmación',
      'Coordinación privada',
    ],
    coverageAreas: [
      ...city.highlights.map((area) => ({
        name: area.name,
        confirmed: false,
      })),
      ...city.locations.map((name) => ({ name, confirmed: false })),
    ],
    profileSlugs: [],
    faqs: structuredClone(city.faqs),
    nearbyCitySlugs: nearbyCitySlugsFor(city.slug),
    seo: {
      title: `Compañía privada en ${city.city}`,
      description: city.lead,
      canonicalPath: `/${city.slug}`,
      indexable: false,
      lastModified: runtimeTimestamp,
    },
    updatedAt: runtimeTimestamp,
  }),
);

const runtimeDraftSnapshot: ContentSnapshot = {
  cities: draftCities,
  profiles: [
    {
      id: "profile-valeria",
      slug: "valeria",
      displayName: "Valeria",
      age: 27,
      biography: "Concepto editorial ficticio de elegancia mediterránea.",
      measurements: {
        heightCentimeters: 170,
        weightKilograms: 55,
        chestCentimeters: 90,
        waistCentimeters: 60,
        hipsCentimeters: 90
      },
      languages: ["Español", "Inglés"],
      serviceIds: [],
      media: [
        {
          kind: "image",
          id: "media-valeria-cover", role: "cover",
          label: "Retrato",
          sourcePath: "assets/synthetic-profiles/valeria/cover/valeria-cover-v01.png",
          desktopUrl: "/assets/synthetic-profiles/valeria/cover",
          mobileUrl: "/assets/synthetic-profiles/valeria/cover",
          alt: "Valeria cover",
          order: 0
        },
        {
          kind: "image",
          id: "media-valeria-gallery-01", role: "gallery-01",
          label: "Retrato",
          sourcePath: "assets/synthetic-profiles/valeria/gallery/valeria-gallery-01-v01.png",
          desktopUrl: "/assets/synthetic-profiles/valeria/gallery-01",
          mobileUrl: "/assets/synthetic-profiles/valeria/gallery-01",
          alt: "Valeria gallery",
          order: 1
        }
      ],
      availability: "available",
      citySlugs: ["madrid"],
      status: "published",
      approval: { state: "approved", approvedAt: "2026-08-27T00:00:00-05:00", approvedBy: "system" },
      adultAgeConfirmed: true,
      publicationConsentConfirmed: true,
      rightsConfirmed: true,
      createdAt: "2026-08-27T00:00:00-05:00",
      updatedAt: "2026-08-27T00:00:00-05:00",
      revision: 1
    }
],
  services: [],
  settings: {
    brandName: 'PecadosVip',
    publicationEnabled: false,
    analyticsConsentConfigured: false,
    contact: contactConfig.contact,
    legal: {
      legalNotice: emptyLegalDocument('Aviso legal'),
      privacy: emptyLegalDocument('Privacidad'),
      cookies: emptyLegalDocument('Cookies'),
      serviceTerms: emptyLegalDocument('Términos del servicio'),
    },
  },
};

export function getRuntimeContentResolution(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): RuntimeContentResolution {
  const resolution = resolveRuntimeContentFromEnvironment(
    runtimeDraftSnapshot,
    environment,
  );
  return structuredClone(resolution);
}

export function getRuntimeContentSnapshot(): ContentSnapshot {
  return getRuntimeContentResolution().snapshot;
}

export function getRuntimeContentActivationState(): RuntimeContentActivationState {
  return getRuntimeContentResolution().activation;
}
