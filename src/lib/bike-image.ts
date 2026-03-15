interface BikeWithImage {
  photo_url?: string | null;
}

/**
 * Resolve the best available image for a bike:
 * 1. User-uploaded photo_url
 * 2. null (no image available)
 */
export function resolveBikeImage(bike: BikeWithImage): string | null {
  if (bike.photo_url) return bike.photo_url;
  return null;
}
