'use client';

import { useBike } from '@/hooks/use-bikes';
import { BikeForm } from './bike-form';

export function EditBikeForm({ bikeId }: { bikeId: string }) {
  const { data: bike, isLoading } = useBike(bikeId);

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-lg bg-muted" />;
  }

  if (!bike) return null;

  return <BikeForm bike={bike} />;
}
