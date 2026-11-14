/**
 * Runtime configuration, read from `REACT_APP_*` environment variables at build time.
 * See `.env.example` for documentation of every variable.
 */
const env = process.env;

const config = {
  appName: 'PulseGuard',
  /** Phone number used by the "Call support" / "Text support" actions. */
  supportPhone: env.REACT_APP_SUPPORT_PHONE || '+1-555-0100',
  /** Emergency number surfaced in urgent triage results and the footer. */
  emergencyNumber: env.REACT_APP_EMERGENCY_NUMBER || '112',
  /** Map tile server (any XYZ tile template accepted by Leaflet). */
  mapTileUrl: env.REACT_APP_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  mapAttribution:
    env.REACT_APP_MAP_ATTRIBUTION ||
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

export default config;
