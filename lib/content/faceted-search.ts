import type { Availability, CitySlug, Profile } from './types.ts';

export type FacetedSearchFilterInput = {
  citySlug?: CitySlug;
  minPrice?: number;
  maxPrice?: number;
  incallOnly?: boolean;
  outcallOnly?: boolean;
  availableNowOnly?: boolean;
  verifiedOnly?: boolean;
  serviceId?: string;
  minHeightCm?: number;
  maxHeightCm?: number;
  hairColor?: string;
  eyeColor?: string;
};

export type FacetedSearchResult = {
  totalMatches: number;
  profiles: Profile[];
  availableCityFacets: Record<string, number>;
  availableServiceFacets: Record<string, number>;
};

export function filterProfilesFaceted(
  profiles: Profile[],
  filter: FacetedSearchFilterInput
): FacetedSearchResult {
  const cityFacets: Record<string, number> = {};
  const serviceFacets: Record<string, number> = {};

  const filtered = profiles.filter((p) => {
    // City filter
    if (filter.citySlug && !p.citySlugs.includes(filter.citySlug)) {
      const activeInTour = p.tours?.some(
        (t) => t.citySlug === filter.citySlug && t.active
      );
      if (!activeInTour) return false;
    }

    // Incall filter
    if (filter.incallOnly && p.incall !== true) return false;

    // Outcall filter
    if (filter.outcallOnly && p.outcall !== true) return false;

    // Available now filter
    if (filter.availableNowOnly && p.availability !== 'available') return false;

    // Verified badge filter
    if (filter.verifiedOnly && p.verifiedBadge !== true) return false;

    // Service ID filter
    if (filter.serviceId && !p.serviceIds.includes(filter.serviceId)) return false;

    // Height filter
    if (filter.minHeightCm && (p.measurements.heightCm || 0) < filter.minHeightCm) return false;
    if (filter.maxHeightCm && (p.measurements.heightCm || 0) > filter.maxHeightCm) return false;

    // Hair color filter
    if (filter.hairColor && p.physicalTraits?.hairColor?.toLowerCase() !== filter.hairColor.toLowerCase()) {
      return false;
    }

    // Price range filter
    if (p.rates?.rates && p.rates.rates.length > 0) {
      const minModelRate = Math.min(...p.rates.rates.map((r) => r.price));
      if (filter.minPrice && minModelRate < filter.minPrice) return false;
      if (filter.maxPrice && minModelRate > filter.maxPrice) return false;
    }

    // Accumulate facets
    for (const city of p.citySlugs) {
      cityFacets[city] = (cityFacets[city] || 0) + 1;
    }
    for (const svc of p.serviceIds) {
      serviceFacets[svc] = (serviceFacets[svc] || 0) + 1;
    }

    return true;
  });

  return {
    totalMatches: filtered.length,
    profiles: filtered,
    availableCityFacets: cityFacets,
    availableServiceFacets: serviceFacets,
  };
}
