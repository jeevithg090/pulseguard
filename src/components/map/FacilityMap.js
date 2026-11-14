import React, { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import config from '../../config';
import { FACILITY_TYPE_LABELS } from '../../data/facilities';
import { formatDistance } from '../../utils/geo';

// Bundle Leaflet's marker images locally instead of relying on a CDN.
const facilityIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = L.divIcon({
  className: '',
  html: '<div class="pg-user-marker" aria-hidden="true"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [32, 32], maxZoom: 14 });
  }, [map, points]);
  return null;
}

function FocusSelected({ facility }) {
  const map = useMap();
  useEffect(() => {
    if (facility) map.flyTo(facility.position, Math.max(map.getZoom(), 14), { duration: 0.6 });
  }, [map, facility]);
  return null;
}

/** Interactive map of facilities (and the user's location, when known). */
export default function FacilityMap({
  facilities,
  center,
  userLocation,
  selected,
  onSelect,
  height = 420,
}) {
  const points = useMemo(() => {
    const pts = facilities.map((f) => f.position);
    if (userLocation) pts.push(userLocation);
    return pts;
    // Re-fit only when the set of visible facilities or the origin changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilities.map((f) => f.id).join(','), userLocation?.[0], userLocation?.[1]]);

  return (
    <div style={{ height }} role="region" aria-label="Map of healthcare facilities">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: '100%' }}>
        <TileLayer url={config.mapTileUrl} attribution={config.mapAttribution} />
        <FitBounds points={points} />
        <FocusSelected facility={selected} />
        {userLocation && (
          <Marker position={userLocation} icon={userIcon} title="Your location" keyboard={false}>
            <Popup>Your location</Popup>
          </Marker>
        )}
        {facilities.map((f) => (
          <Marker
            key={f.id}
            position={f.position}
            icon={facilityIcon}
            title={f.name}
            alt={f.name}
            eventHandlers={{ click: () => onSelect?.(f) }}
          >
            <Popup>
              <h3>{f.name}</h3>
              <p>
                {FACILITY_TYPE_LABELS[f.type]} · ★ {f.rating.toFixed(1)}
              </p>
              <p>
                ~{f.waitMinutes} min wait
                {f.distanceKm != null ? ` · ${formatDistance(f.distanceKm)}` : ''}
              </p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
