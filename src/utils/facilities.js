import { haversineKm } from './geo';

/** Adds a `distanceKm` field to each facility measured from `origin`. */
export function withDistances(facilities, origin) {
  return facilities.map((f) => ({
    ...f,
    distanceKm: origin ? haversineKm(origin, f.position) : null,
  }));
}

const SORTERS = {
  distance: (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
  rating: (a, b) => b.rating - a.rating,
  waitTime: (a, b) => a.waitMinutes - b.waitMinutes,
  name: (a, b) => a.name.localeCompare(b.name),
};

export const FACILITY_SORT_OPTIONS = [
  { value: 'distance', label: 'Nearest' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'waitTime', label: 'Shortest wait' },
  { value: 'name', label: 'Name (A–Z)' },
];

/**
 * Filters and sorts facilities. All criteria compose (search AND type AND …).
 * @param {object[]} facilities facilities with optional `distanceKm`
 * @param {{query?: string, type?: string, service?: string, minRating?: number,
 *   open24h?: boolean, favoritesOnly?: boolean, favorites?: string[], sortBy?: string}} criteria
 */
export function searchFacilities(facilities, criteria = {}) {
  const {
    query = '',
    type = 'all',
    service = 'all',
    minRating = 0,
    open24h = false,
    favoritesOnly = false,
    favorites = [],
    sortBy = 'distance',
  } = criteria;
  const q = query.trim().toLowerCase();

  const filtered = facilities.filter((f) => {
    const matchesQuery =
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.address.toLowerCase().includes(q) ||
      f.services.some((s) => s.toLowerCase().includes(q));
    const matchesType = type === 'all' || f.type === type;
    const matchesService = service === 'all' || f.services.includes(service);
    const matchesRating = f.rating >= minRating;
    const matchesHours = !open24h || f.open24h;
    const matchesFavorite = !favoritesOnly || favorites.includes(f.id);
    return (
      matchesQuery &&
      matchesType &&
      matchesService &&
      matchesRating &&
      matchesHours &&
      matchesFavorite
    );
  });

  return filtered.sort(SORTERS[sortBy] ?? SORTERS.distance);
}
