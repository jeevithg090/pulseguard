import { searchFacilities, withDistances } from '../facilities';
import { directionsUrl, formatDistance, haversineKm } from '../geo';
import { FACILITIES, DEFAULT_MAP_CENTER } from '../../data/facilities';

describe('geo', () => {
  it('computes great-circle distance', () => {
    // Bengaluru → Chennai is roughly 290 km.
    expect(haversineKm([12.9716, 77.5946], [13.0827, 80.2707])).toBeCloseTo(290, -1);
    expect(haversineKm([1, 1], [1, 1])).toBe(0);
  });
  it('formats distances', () => {
    expect(formatDistance(0.42)).toBe('420 m');
    expect(formatDistance(4.26)).toBe('4.3 km');
    expect(formatDistance(18.4)).toBe('18 km');
    expect(formatDistance(null)).toBe('—');
  });
  it('builds directions links', () => {
    expect(directionsUrl([1, 2])).toContain(encodeURIComponent(';1,2'));
    expect(directionsUrl([1, 2], [3, 4])).toContain(encodeURIComponent('3,4;1,2'));
  });
});

describe('searchFacilities', () => {
  const facilities = withDistances(FACILITIES, DEFAULT_MAP_CENTER);

  it('sorts by distance by default', () => {
    const result = searchFacilities(facilities);
    const distances = result.map((f) => f.distanceKm);
    expect(distances).toEqual([...distances].sort((a, b) => a - b));
  });

  it('combines search, type and service filters', () => {
    const result = searchFacilities(facilities, { query: 'cardio', type: 'hospital' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((f) => f.type === 'hospital' && f.services.includes('Cardiology'))).toBe(
      true,
    );

    const clinics = searchFacilities(facilities, { type: 'clinic', service: 'Dermatology' });
    expect(clinics.map((f) => f.id)).toEqual(['koramangala-wellness']);
  });

  it('filters by rating, opening hours and favourites', () => {
    expect(searchFacilities(facilities, { minRating: 4.6 }).every((f) => f.rating >= 4.6)).toBe(
      true,
    );
    expect(searchFacilities(facilities, { open24h: true }).every((f) => f.open24h)).toBe(true);
    expect(
      searchFacilities(facilities, { favoritesOnly: true, favorites: ['mg-road-urgent-care'] }).map(
        (f) => f.id,
      ),
    ).toEqual(['mg-road-urgent-care']);
  });

  it('supports other sort orders', () => {
    const byWait = searchFacilities(facilities, { sortBy: 'waitTime' }).map((f) => f.waitMinutes);
    expect(byWait).toEqual([...byWait].sort((a, b) => a - b));
    const byRating = searchFacilities(facilities, { sortBy: 'rating' }).map((f) => f.rating);
    expect(byRating).toEqual([...byRating].sort((a, b) => b - a));
  });

  it('returns an empty list when nothing matches', () => {
    expect(searchFacilities(facilities, { query: 'zzz-no-match' })).toEqual([]);
  });
});
