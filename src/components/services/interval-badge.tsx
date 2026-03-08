'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/database';

type ServiceInterval = Database['public']['Tables']['service_intervals']['Row'];

export function getServiceStatus(interval: ServiceInterval, bikeDistanceKm?: number): 'ok' | 'due_soon' | 'overdue' {
  if (!interval.last_performed_at) return 'overdue';

  if (interval.interval_type === 'days') {
    const lastDate = new Date(interval.last_performed_at);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince >= interval.interval_value) return 'overdue';
    if (daysSince >= interval.interval_value * 0.85) return 'due_soon';
    return 'ok';
  }

  if (interval.interval_type === 'distance' && bikeDistanceKm != null && interval.last_performed_distance_km != null) {
    const kmSince = bikeDistanceKm - Number(interval.last_performed_distance_km);
    if (kmSince >= interval.interval_value) return 'overdue';
    if (kmSince >= interval.interval_value * 0.85) return 'due_soon';
    return 'ok';
  }

  return 'ok';
}

export function IntervalBadge({ interval }: { interval: ServiceInterval }) {
  const t = useTranslations('services');
  const status = getServiceStatus(interval);

  return (
    <Badge
      variant="secondary"
      className={cn(
        'text-xs',
        status === 'ok' && 'bg-success/10 text-success',
        status === 'due_soon' && 'bg-warning/10 text-warning',
        status === 'overdue' && 'bg-destructive/10 text-destructive animate-pulse'
      )}
    >
      {t(`status.${status === 'due_soon' ? 'dueSoon' : status}`)}
    </Badge>
  );
}
