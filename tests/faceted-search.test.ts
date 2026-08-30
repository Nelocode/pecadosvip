import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Profile } from '../lib/content/types.ts';
import { filterProfilesFaceted } from '../lib/content/faceted-search.ts';

test('filterProfilesFaceted filters by city, incall/outcall, availability, and physical traits', () => {
  const sampleProfiles: Profile[] = [
    {
      id: 'prof-1',
      slug: 'valeria',
      displayName: 'Valeria',
      age: 24,
      biography: 'Bio',
      measurements: { heightCm: 175 },
      languages: ['es'],
      serviceIds: ['dinner'],
      media: [],
      availability: 'available',
      citySlugs: ['madrid'],
      incall: true,
      outcall: true,
      verifiedBadge: true,
      status: 'published',
      approval: { state: 'approved' },
      adultAgeConfirmed: true,
      publicationConsentConfirmed: true,
      rightsConfirmed: true,
      createdAt: '2026-08-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z',
      revision: 1,
    },
    {
      id: 'prof-2',
      slug: 'sofia',
      displayName: 'Sofía',
      age: 26,
      biography: 'Bio',
      measurements: { heightCm: 168 },
      languages: ['es'],
      serviceIds: ['dinner'],
      media: [],
      availability: 'limited',
      citySlugs: ['barcelona'],
      incall: false,
      outcall: true,
      verifiedBadge: false,
      status: 'published',
      approval: { state: 'approved' },
      adultAgeConfirmed: true,
      publicationConsentConfirmed: true,
      rightsConfirmed: true,
      createdAt: '2026-08-01T00:00:00Z',
      updatedAt: '2026-08-01T00:00:00Z',
      revision: 1,
    },
  ];

  const resultMadrid = filterProfilesFaceted(sampleProfiles, { citySlug: 'madrid' });
  assert.equal(resultMadrid.totalMatches, 1);
  assert.equal(resultMadrid.profiles[0].slug, 'valeria');

  const resultAvailable = filterProfilesFaceted(sampleProfiles, { availableNowOnly: true });
  assert.equal(resultAvailable.totalMatches, 1);
  assert.equal(resultAvailable.profiles[0].slug, 'valeria');
});
