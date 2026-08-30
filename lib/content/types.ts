export const citySlugs = [
  'madrid',
  'barcelona',
  'girona',
  'tarragona',
  'toledo',
  'guadalajara',
  'segovia',
] as const;

export type CitySlug = (typeof citySlugs)[number];
export type PublicationStatus = 'draft' | 'hidden' | 'published' | 'archived';
export type Availability = 'available' | 'limited' | 'unavailable' | 'on-request';
export type ApprovalState = 'pending' | 'approved' | 'rejected';
export type CmsRole =
  | 'super_admin'
  | 'booking_agent'
  | 'seo_specialist'
  | 'kyc_officer'
  | 'admin'
  | 'editor';

export type LanguageFluency = 'native' | 'fluent' | 'intermediate' | 'basic';

export type SpokenLanguage = {
  language: string;
  fluency: LanguageFluency;
};

export type RateItem = {
  durationMinutes: number;
  durationLabel: string;
  price: number;
  currency: 'EUR';
  notes?: string;
};

export type RateMatrix = {
  rates: RateItem[];
  displacementSurcharge?: number;
  specializedServiceSurcharges?: Array<{
    serviceName: string;
    extraPrice: number;
  }>;
};

export type TourItinerary = {
  id: string;
  citySlug: CitySlug;
  startDate: string;
  endDate: string;
  active: boolean;
  notes?: string;
};

export type SupplementServiceItem = {
  serviceId: string;
  extraPrice: number;
  notes?: string;
};

export type ServicePreferences = {
  includedServiceIds: string[];
  supplementServices: SupplementServiceItem[];
  serviceLimits: string[];
};

export type PhysicalTraits = {
  ethnicity?: string;
  hairColor?: string;
  eyeColor?: string;
  silhouette?: string;
  nationality?: string;
};

export type KycDocumentRecord = {
  id: string;
  documentType: 'id_card' | 'verification_selfie' | 'rights_contract';
  fileId: string;
  encryptedAt: string;
  verifiedBy: string;
};

export type ApprovalRecord = {
  state: ApprovalState;
  sourceReference?: string;
  approvedBy?: string;
  approvedAt?: string;
};

export type SeoFields = {
  title: string;
  description: string;
  canonicalPath: `/${string}` | '/';
  indexable: boolean;
  lastModified: string;
};

export type MediaAsset = {
  id: string;
  kind: 'image' | 'video';
  desktopUrl: string;
  mobileUrl?: string;
  alt: string;
  order: number;
  rightsConfirmed: boolean;
  rightsEvidence?: string;
};

export type ProfileMeasurements = {
  heightCm?: number;
  weightKg?: number;
  bustCm?: number;
  waistCm?: number;
  hipsCm?: number;
};

export type Profile = {
  id: string;
  slug: string;
  displayName: string;
  age: number | null;
  biography: string;
  measurements: ProfileMeasurements;
  physicalTraits?: PhysicalTraits;
  languages: string[];
  spokenLanguages?: SpokenLanguage[];
  serviceIds: string[];
  servicePreferences?: ServicePreferences;
  rates?: RateMatrix;
  incall?: boolean;
  outcall?: boolean;
  coverageZones?: string[];
  tours?: TourItinerary[];
  verifiedBadge?: boolean;
  kycDocuments?: KycDocumentRecord[];
  media: MediaAsset[];
  availability: Availability;
  citySlugs: CitySlug[];
  status: PublicationStatus;
  approval: ApprovalRecord;
  verificationEvidenceReference?: string;
  adultAgeConfirmed: boolean;
  publicationConsentConfirmed: boolean;
  rightsConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
  revision: number;
};

export type CoverageArea = {
  name: string;
  confirmed: boolean;
};

export type Faq = {
  question: string;
  answer: string;
};

export type CityPage = {
  id: string;
  slug: CitySlug;
  name: string;
  cluster: 'madrid' | 'barcelona';
  status: PublicationStatus;
  serviceConfirmed: boolean;
  approval: ApprovalRecord;
  headline: string;
  introduction: string;
  differentiators: string[];
  coverageAreas: CoverageArea[];
  profileSlugs: string[];
  faqs: Faq[];
  nearbyCitySlugs: CitySlug[];
  seo: SeoFields;
  updatedAt: string;
};

export type Service = {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: PublicationStatus;
  approval: ApprovalRecord;
};

export type ContactSettings = {
  telegramUrl?: string;
  whatsappUrl?: string;
  phoneUrl?: string;
  emailUrl?: string;
  formActionUrl?: string;
};

export type LegalDocument = {
  title: string;
  body: string;
  approval: ApprovalRecord;
  updatedAt: string;
};

export type SiteSettings = {
  brandName: string;
  canonicalOrigin?: string;
  publicationEnabled: boolean;
  analyticsConsentConfigured: boolean;
  contact: ContactSettings;
  legal: {
    legalNotice: LegalDocument;
    privacy: LegalDocument;
    cookies: LegalDocument;
    serviceTerms: LegalDocument;
  };
};

export type ContentSnapshot = {
  cities: CityPage[];
  profiles: Profile[];
  services: Service[];
  settings: SiteSettings;
};

export type AuditEvent = {
  id: string;
  actorId: string;
  actorRole: CmsRole;
  requestId: string;
  action:
    | 'create'
    | 'edit'
    | 'duplicate'
    | 'publish'
    | 'hide'
    | 'archive'
    | 'restore'
    | 'availability-change'
    | 'reorder-media'
    | 'record-evidence'
    | 'approve'
    | 'return-to-draft';
  entityType: 'profile' | 'city' | 'service' | 'settings';
  entityId: string;
  sourceEntityId?: string;
  occurredAt: string;
  fromRevision?: number;
  toRevision?: number;
  fromStatus?: PublicationStatus;
  toStatus?: PublicationStatus;
  changedFields: string[];
};
