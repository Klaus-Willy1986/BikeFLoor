import { BIKE_CATALOG } from '@/lib/bike-catalog';

interface BikeWithImage {
  photo_url?: string | null;
  manufacturer?: string | null;
  model?: string | null;
}

/**
 * Resolve the best available image for a bike:
 * 1. User-uploaded photo_url
 * 2. Catalog imageUrl match
 * 3. null (no image available)
 */
export function resolveBikeImage(bike: BikeWithImage): string | null {
  if (bike.photo_url) return bike.photo_url;

  if (bike.manufacturer && bike.model) {
    const entry = BIKE_CATALOG.find(
      (b) =>
        b.manufacturer.toLowerCase() === bike.manufacturer!.toLowerCase() &&
        b.model.toLowerCase() === bike.model!.toLowerCase()
    );
    if (entry?.imageUrl) return entry.imageUrl;
  }

  return null;
}
