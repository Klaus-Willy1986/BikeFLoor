'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface FitBoundsProps {
  bounds: LatLngBoundsExpression;
}

function FitBounds({ bounds }: FitBoundsProps) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [map, bounds]);
  return null;
}

interface RouteMapInnerProps {
  geojson: GeoJSON.FeatureCollection;
  bounds: {
    ne: { lat: number; lng: number };
    sw: { lat: number; lng: number };
  };
  height?: string;
}

export function RouteMapInner({
  geojson,
  bounds,
  height = '300px',
}: RouteMapInnerProps) {
  const geoJsonKey = useRef(0);

  useEffect(() => {
    geoJsonKey.current += 1;
  }, [geojson]);

  const leafletBounds: LatLngBoundsExpression = [
    [bounds.sw.lat, bounds.sw.lng],
    [bounds.ne.lat, bounds.ne.lng],
  ];

  const center: [number, number] = [
    (bounds.ne.lat + bounds.sw.lat) / 2,
    (bounds.ne.lng + bounds.sw.lng) / 2,
  ];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height, width: '100%', borderRadius: '0.5rem' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        key={geoJsonKey.current}
        data={geojson}
        style={() => ({
          color: '#d97706',
          weight: 3,
          opacity: 0.85,
        })}
      />
      <FitBounds bounds={leafletBounds} />
    </MapContainer>
  );
}
