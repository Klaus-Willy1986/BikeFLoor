import { gpx as gpxToGeoJSON } from '@tmcw/togeojson';
import FitParser from 'fit-file-parser';

export interface ParsedTrack {
  title: string | null;
  distance_km: number;
  elevation_m: number | null;
  duration_seconds: number | null;
  date: string;
  average_speed_kmh: number | null;
  geojson: GeoJSON.FeatureCollection;
  bounds: { ne: { lat: number; lng: number }; sw: { lat: number; lng: number } };
  pointCount: number;
  source: 'gpx' | 'fit';
}

function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateElevationGain(elevations: number[]): number {
  let gain = 0;
  for (let i = 1; i < elevations.length; i++) {
    const diff = elevations[i] - elevations[i - 1];
    if (diff > 0) gain += diff;
  }
  return Math.round(gain);
}

function calculateBounds(coords: [number, number][]) {
  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity;
  for (const [lng, lat] of coords) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }
  return {
    ne: { lat: maxLat, lng: maxLng },
    sw: { lat: minLat, lng: minLng },
  };
}

function extractCoordsFromGeoJSON(
  geojson: GeoJSON.FeatureCollection
): [number, number][] {
  const coords: [number, number][] = [];
  for (const feature of geojson.features) {
    if (feature.geometry.type === 'LineString') {
      for (const c of feature.geometry.coordinates) {
        coords.push([c[0], c[1]]);
      }
    } else if (feature.geometry.type === 'MultiLineString') {
      for (const line of feature.geometry.coordinates) {
        for (const c of line) {
          coords.push([c[0], c[1]]);
        }
      }
    }
  }
  return coords;
}

function extractElevationsFromGeoJSON(
  geojson: GeoJSON.FeatureCollection
): number[] {
  const elevations: number[] = [];
  for (const feature of geojson.features) {
    if (feature.geometry.type === 'LineString') {
      for (const c of feature.geometry.coordinates) {
        if (c.length >= 3) elevations.push(c[2]);
      }
    } else if (feature.geometry.type === 'MultiLineString') {
      for (const line of feature.geometry.coordinates) {
        for (const c of line) {
          if (c.length >= 3) elevations.push(c[2]);
        }
      }
    }
  }
  return elevations;
}

function extractTimesFromGeoJSON(
  geojson: GeoJSON.FeatureCollection
): Date[] {
  const times: Date[] = [];
  for (const feature of geojson.features) {
    const props = feature.properties;
    if (props?.coordinateProperties?.times) {
      const t = props.coordinateProperties.times;
      if (Array.isArray(t)) {
        const flat = t.flat(Infinity) as string[];
        for (const ts of flat) {
          times.push(new Date(ts));
        }
      }
    }
  }
  return times;
}

function calculateDistanceFromCoords(coords: [number, number][]): number {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversine(coords[i - 1][1], coords[i - 1][0], coords[i][1], coords[i][0]);
  }
  return Math.round(total * 10) / 10;
}

export function parseGPX(text: string): ParsedTrack {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  const geojson = gpxToGeoJSON(doc) as GeoJSON.FeatureCollection;

  const coords = extractCoordsFromGeoJSON(geojson);
  if (coords.length === 0) throw new Error('No track points found in GPX');

  const elevations = extractElevationsFromGeoJSON(geojson);
  const times = extractTimesFromGeoJSON(geojson);
  const distance_km = calculateDistanceFromCoords(coords);
  const bounds = calculateBounds(coords);

  const elevation_m =
    elevations.length > 0 ? calculateElevationGain(elevations) : null;

  let duration_seconds: number | null = null;
  let date = new Date().toISOString().split('T')[0];
  if (times.length >= 2) {
    const start = times[0].getTime();
    const end = times[times.length - 1].getTime();
    duration_seconds = Math.round((end - start) / 1000);
    date = times[0].toISOString().split('T')[0];
  }

  const average_speed_kmh =
    duration_seconds && duration_seconds > 0
      ? Math.round((distance_km / (duration_seconds / 3600)) * 10) / 10
      : null;

  // Extract title from GPX metadata or track name
  const nameEl =
    doc.querySelector('trk > name') || doc.querySelector('metadata > name');
  const title = nameEl?.textContent || null;

  return {
    title,
    distance_km,
    elevation_m,
    duration_seconds,
    date,
    average_speed_kmh,
    geojson,
    bounds,
    pointCount: coords.length,
    source: 'gpx',
  };
}

export function parseFIT(buffer: ArrayBuffer): Promise<ParsedTrack> {
  return new Promise((resolve, reject) => {
    const fitParser = new FitParser({
      force: true,
      speedUnit: 'km/h',
      lengthUnit: 'km',
      elapsedRecordField: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fitParser.parse(buffer, (error: unknown, data: any) => {
      if (error) {
        reject(new Error('Failed to parse FIT file'));
        return;
      }

      const sessions = data.sessions as Array<Record<string, unknown>> | undefined;
      const records = data.records as Array<Record<string, unknown>> | undefined;

      if (!records?.length) {
        reject(new Error('No records found in FIT file'));
        return;
      }

      // Build GeoJSON from records
      const coordinates: number[][] = [];
      const elevations: number[] = [];
      const times: Date[] = [];

      for (const rec of records) {
        const lat = rec.position_lat as number | undefined;
        const lng = rec.position_long as number | undefined;
        if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
          const alt = rec.altitude as number | undefined;
          if (alt != null) {
            coordinates.push([lng, lat, alt]);
            elevations.push(alt);
          } else {
            coordinates.push([lng, lat]);
          }
          if (rec.timestamp) times.push(new Date(rec.timestamp as string));
        }
      }

      if (coordinates.length === 0) {
        reject(new Error('No GPS data found in FIT file'));
        return;
      }

      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates,
            },
          },
        ],
      };

      const coords2d = coordinates.map(
        (c) => [c[0], c[1]] as [number, number]
      );
      const bounds = calculateBounds(coords2d);

      // Prefer session data for summary
      const session = sessions?.[0];
      let distance_km = session?.total_distance
        ? Number(session.total_distance)
        : calculateDistanceFromCoords(coords2d);
      // fit-file-parser with lengthUnit 'km' should give km
      if (distance_km > 1000) distance_km = distance_km / 1000;
      distance_km = Math.round(distance_km * 10) / 10;

      const elevation_m = session?.total_ascent
        ? Math.round(Number(session.total_ascent))
        : elevations.length > 0
          ? calculateElevationGain(elevations)
          : null;

      let duration_seconds: number | null = null;
      if (session?.total_timer_time) {
        duration_seconds = Math.round(Number(session.total_timer_time));
        // fit-file-parser may return ms
        if (duration_seconds > 100000) duration_seconds = Math.round(duration_seconds / 1000);
      } else if (times.length >= 2) {
        duration_seconds = Math.round(
          (times[times.length - 1].getTime() - times[0].getTime()) / 1000
        );
      }

      const date =
        session?.start_time || session?.timestamp || times[0]
          ? new Date(
              (session?.start_time || session?.timestamp || times[0]) as string
            )
              .toISOString()
              .split('T')[0]
          : new Date().toISOString().split('T')[0];

      const average_speed_kmh =
        session?.avg_speed != null
          ? Math.round(Number(session.avg_speed) * 10) / 10
          : duration_seconds && duration_seconds > 0
            ? Math.round((distance_km / (duration_seconds / 3600)) * 10) / 10
            : null;

      resolve({
        title: null,
        distance_km,
        elevation_m,
        duration_seconds,
        date,
        average_speed_kmh,
        geojson,
        bounds,
        pointCount: coordinates.length,
        source: 'fit',
      });
    });
  });
}

export function downsampleTrack(
  geojson: GeoJSON.FeatureCollection,
  maxPoints = 2000
): GeoJSON.FeatureCollection {
  const result: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  for (const feature of geojson.features) {
    if (
      feature.geometry.type === 'LineString' &&
      feature.geometry.coordinates.length > maxPoints
    ) {
      const coords = feature.geometry.coordinates;
      const step = coords.length / maxPoints;
      const sampled: GeoJSON.Position[] = [coords[0]];
      for (let i = 1; i < maxPoints - 1; i++) {
        sampled.push(coords[Math.round(i * step)]);
      }
      sampled.push(coords[coords.length - 1]);
      result.features.push({
        type: 'Feature',
        properties: feature.properties,
        geometry: { type: 'LineString', coordinates: sampled },
      });
    } else if (
      feature.geometry.type === 'MultiLineString'
    ) {
      const allCoords = feature.geometry.coordinates.flat();
      if (allCoords.length > maxPoints) {
        const step = allCoords.length / maxPoints;
        const sampled: GeoJSON.Position[] = [allCoords[0]];
        for (let i = 1; i < maxPoints - 1; i++) {
          sampled.push(allCoords[Math.round(i * step)]);
        }
        sampled.push(allCoords[allCoords.length - 1]);
        result.features.push({
          type: 'Feature',
          properties: feature.properties,
          geometry: { type: 'LineString', coordinates: sampled },
        });
      } else {
        result.features.push({
          type: 'Feature',
          properties: feature.properties,
          geometry: { type: 'LineString', coordinates: allCoords },
        });
      }
    } else {
      result.features.push(feature);
    }
  }

  return result;
}
