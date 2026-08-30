import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Profile } from '../lib/content/types.ts';
import {
  calculateHaversineDistance,
  CITY_COORDINATES,
  prioritizeProfilesByLocation,
  resolveVisitorCityFromHeaders,
} from '../lib/geo/geo-engine.ts';

test('calculateHaversineDistance accurately computes distance between Madrid and Guadalajara', () => {
  const dist = calculateHaversineDistance(CITY_COORDINATES.madrid, CITY_COORDINATES.guadalajara);
  assert.ok(dist > 45 && dist < 65, `Expected ~50-60km, got ${dist}`);
});

test('resolveVisitorCityFromHeaders extracts city from Edge headers', () => {
  assert.equal(resolveVisitorCityFromHeaders({ 'cf-ipcity': 'Barcelona' }), 'barcelona');
  assert.equal(resolveVisitorCityFromHeaders({ 'x-vercel-ip-city': 'Madrid' }), 'madrid');
  assert.equal(resolveVisitorCityFromHeaders({}), null);
});

test('prioritizeProfilesByLocation ranks Exact Match, Active Tour and Metropolitan Area accurately', () => {
  const sampleProfiles: Profile[] = [
    {
      id: 'profile-madrid',
      slug: 'valeria',
      displayName: 'Valeria',
      age: 24,
      biography: 'Bio',
      measurements: {},
      languages: ['es'],
      serviceIds: ['dinner'],
      media: [],
      availability: 'available',
      citySlugs: ['madrid'],
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
      id: 'profile-tour-barcelona',
      slug: 'sofia',
      displayName: 'Sofía',
      age: 26,
      biography: 'Bio',
      measurements: {},
      languages: ['es'],
      serviceIds: ['dinner'],
      media: [],
      availability: 'available',
      citySlugs: ['madrid'],
      tours: [
        {
          id: 'tour-1',
          citySlug: 'barcelona',
          startDate: '2026-08-25T00:00:00Z',
          endDate: '2026-09-05T00:00:00Z',
          active: true,
        },
      ],
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
      id: 'profile-barcelona-local',
      slug: 'lucia',
      displayName: 'Lucía',
      age: 25,
      biography: 'Bio',
      measurements: {},
      languages: ['es'],
      serviceIds: ['dinner'],
      media: [],
      availability: 'available',
      citySlugs: ['barcelona'],
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

  const now = '2026-08-30T12:00:00Z';
  const ranked = prioritizeProfilesByLocation(sampleProfiles, 'barcelona', now);

  assert.equal(ranked.length, 3);
  // Priority 1: Lucía (barcelona exact match)
  assert.equal(ranked[0].profile.slug, 'lucia');
  assert.equal(ranked[0].priority, 'priority_1_exact');

  // Priority 2: Sofía (active tour in barcelona)
  assert.equal(ranked[1].profile.slug, 'sofia');
  assert.equal(ranked[1].priority, 'priority_2_tour');
  assert.equal(ranked[1].badgeLabel, 'En tu ciudad esta semana');
});
