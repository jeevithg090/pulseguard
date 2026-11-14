const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * Great-circle distance between two `[lat, lng]` points using the haversine formula.
 * @returns {number} distance in kilometres
 */
export function haversineKm([lat1, lng1], [lat2, lng2]) {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Formats a distance in km for display ("850 m", "4.2 km", "18 km"). */
export function formatDistance(km) {
  if (km === null || km === undefined || Number.isNaN(km)) return '—';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

/** Builds an OpenStreetMap directions URL from an optional origin to a destination. */
export function directionsUrl(destination, origin) {
  const to = `${destination[0]},${destination[1]}`;
  const from = origin ? `${origin[0]},${origin[1]}` : '';
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${encodeURIComponent(
    `${from};${to}`,
  )}`;
}
