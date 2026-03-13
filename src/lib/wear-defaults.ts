import type { BIKE_TYPES } from '@/lib/constants';

type BikeType = (typeof BIKE_TYPES)[number];

/**
 * Recommended max_distance_km per bike type + component category.
 * Mirrors the bike_type_wear_defaults DB table for client-side access.
 */
export const BIKE_TYPE_WEAR_DEFAULTS: Record<string, Record<string, number>> = {
  road: {
    chain: 5000,
    cassette: 10000,
    brake_pads: 3000,
    brake_rotors: 15000,
    tires_front: 6000,
    tires_rear: 5000,
    handlebar_tape: 5000,
    cables: 10000,
  },
  mtb: {
    chain: 3000,
    cassette: 8000,
    brake_pads: 2000,
    brake_rotors: 10000,
    tires_front: 4000,
    tires_rear: 3000,
    fork: 5000,
    shock: 5000,
  },
  gravel: {
    chain: 4000,
    cassette: 10000,
    brake_pads: 2500,
    brake_rotors: 12000,
    tires_front: 5000,
    tires_rear: 4000,
    handlebar_tape: 5000,
    cables: 8000,
  },
  city: {
    chain: 5000,
    brake_pads: 5000,
    tires_front: 8000,
    tires_rear: 7000,
    cables: 10000,
  },
  ebike: {
    chain: 3000,
    cassette: 6000,
    brake_pads: 2000,
    brake_rotors: 10000,
    tires_front: 5000,
    tires_rear: 4000,
  },
  tt: {
    chain: 5000,
    cassette: 10000,
    brake_pads: 3000,
    tires_front: 4000,
    tires_rear: 3500,
    handlebar_tape: 5000,
  },
};

/**
 * Get recommended max distance for a bike type + category combination.
 * Returns null if no recommendation exists.
 */
export function getRecommendedMaxDistance(
  bikeType: string | null | undefined,
  categoryKey: string | null | undefined
): number | null {
  if (!bikeType || !categoryKey) return null;
  return BIKE_TYPE_WEAR_DEFAULTS[bikeType]?.[categoryKey] ?? null;
}
