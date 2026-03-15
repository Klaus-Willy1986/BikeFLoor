'use client';

import dynamic from 'next/dynamic';

const RouteMapInner = dynamic(
  () =>
    import('@/components/shared/route-map-inner').then(
      (mod) => mod.RouteMapInner
    ),
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse rounded-lg bg-muted" /> }
);

interface RouteMapProps {
  geojson: GeoJSON.FeatureCollection;
  bounds: {
    ne: { lat: number; lng: number };
    sw: { lat: number; lng: number };
  };
  height?: string;
}

export function RouteMap({ geojson, bounds, height }: RouteMapProps) {
  return <RouteMapInner geojson={geojson} bounds={bounds} height={height} />;
}
